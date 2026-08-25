import { StudentProfile, SkillLevel } from "@/types/student";
import { ProjectAnalysisResult } from "@/types/project";
import { CandidateMatch, CandidateScoreBreakdown } from "@/types/matching";
import { normalizeSkill } from "./normalizer";

const LEVEL_WEIGHTS: Record<SkillLevel, number> = {
  Expert: 100,
  Advanced: 85,
  Intermediate: 65,
  Beginner: 40,
};

/**
 * Calculates deterministic candidate score based on strict 6-factor formula
 */
export function scoreCandidate(
  student: StudentProfile,
  project: ProjectAnalysisResult
): CandidateMatch {
  // 1. Skill Match (40% weight)
  const reqSkills = project.requiredSkills.map((s) => normalizeSkill(s).canonical || s);
  const prefSkills = project.preferredSkills.map((s) => normalizeSkill(s).canonical || s);

  const matchedRequired: string[] = [];
  let reqSkillScoreSum = 0;

  for (const req of reqSkills) {
    const studentSkill = student.skills.find(
      (s) => (normalizeSkill(s.name).canonical || s.name).toLowerCase() === req.toLowerCase()
    );

    if (studentSkill) {
      matchedRequired.push(req);
      reqSkillScoreSum += LEVEL_WEIGHTS[studentSkill.level] || 65;
    }
  }

  const reqSkillScore =
    reqSkills.length > 0 ? (reqSkillScoreSum / (reqSkills.length * 100)) * 100 : 80;

  const matchedPreferred: string[] = [];
  let prefSkillScoreSum = 0;

  for (const pref of prefSkills) {
    const studentSkill = student.skills.find(
      (s) => (normalizeSkill(s.name).canonical || s.name).toLowerCase() === pref.toLowerCase()
    );

    if (studentSkill) {
      matchedPreferred.push(pref);
      prefSkillScoreSum += LEVEL_WEIGHTS[studentSkill.level] || 65;
    }
  }

  const prefSkillScore =
    prefSkills.length > 0 ? (prefSkillScoreSum / (prefSkills.length * 100)) * 100 : 70;

  const skillMatch = Math.min(
    100,
    prefSkills.length > 0 ? reqSkillScore * 0.75 + prefSkillScore * 0.25 : reqSkillScore
  );

  // 2. Interest Alignment (20% weight)
  const matchedInterests: string[] = [];
  for (const domain of project.domain) {
    const normDomain = domain.toLowerCase();
    const hasInterest = student.interests.some(
      (i) =>
        i.toLowerCase().includes(normDomain) ||
        normDomain.includes(i.toLowerCase()) ||
        (normDomain.includes("sustain") && i.toLowerCase().includes("climate")) ||
        (normDomain.includes("smart") && i.toLowerCase().includes("iot"))
    );
    if (hasInterest) {
      matchedInterests.push(domain);
    }
  }

  const domainCount = Math.max(1, project.domain.length);
  let interestAlignment = (matchedInterests.length / domainCount) * 100;
  if (matchedInterests.length > 0) {
    interestAlignment = Math.min(100, interestAlignment + 20); // Affinity bonus
  } else {
    interestAlignment = 30; // Baseline
  }

  // 3. Availability (15% weight)
  const projAvail = (project.availabilityRequirement || "Flexible").toLowerCase();
  let availabilityScore = 70;

  if (student.availability.includes("Flexible")) {
    availabilityScore = 100;
  } else if (projAvail.includes("flexible")) {
    availabilityScore = student.availability.length >= 2 ? 90 : 75;
  } else if (
    student.availability.some((a) => projAvail.includes(a.toLowerCase()))
  ) {
    availabilityScore = 95;
  } else if (student.availability.length === 1 && student.availability[0] === "Weekends") {
    availabilityScore = 40; // Constrained
  } else {
    availabilityScore = 60;
  }

  // 4. Experience (10% weight)
  const expMap: Record<string, number> = {
    Expert: 100,
    Advanced: 85,
    Intermediate: 65,
    Beginner: 45,
  };
  const expScore = expMap[student.experienceLevel] || 65;
  const yearBonus = student.year >= 4 ? 15 : student.year === 3 ? 10 : 5;
  const experience = Math.min(100, expScore + yearBonus);

  // 5. Past Project Relevance (10% weight)
  const matchedProjects: string[] = [];
  let projectRelevanceSum = 0;

  for (const proj of student.pastProjects) {
    const textToMatch = `${proj.title} ${proj.category} ${proj.description || ""} ${proj.skills.join(" ")}`.toLowerCase();
    const matchesCategory = project.projectCategory
      .toLowerCase()
      .split(" ")
      .some((word) => word.length > 3 && textToMatch.includes(word));
    const matchesDomain = project.domain.some((d) =>
      textToMatch.includes(d.toLowerCase())
    );
    const matchesSkills = reqSkills.some((s) =>
      textToMatch.includes(s.toLowerCase())
    );

    if (matchesCategory || matchesDomain || matchesSkills) {
      matchedProjects.push(proj.title);
      projectRelevanceSum += 45;
    }
  }
  const pastProjectRelevance = Math.min(100, Math.max(30, projectRelevanceSum));

  // 6. Collaboration Fit (5% weight)
  let collaborationFit = 75;
  if (student.preferredTeamSize === project.recommendedTeamSize) {
    collaborationFit += 15;
  }
  if (student.collaborationStyle === "Balanced" || student.collaborationStyle === "Agile / Fast-Paced") {
    collaborationFit += 10;
  }
  collaborationFit = Math.min(100, collaborationFit);

  // Final Weighted Candidate Score
  const overallScore = Math.round(
    skillMatch * 0.4 +
      interestAlignment * 0.2 +
      availabilityScore * 0.15 +
      experience * 0.1 +
      pastProjectRelevance * 0.1 +
      collaborationFit * 0.05
  );

  // Assign best matched role
  let assignedRole = student.preferredRoles[0] || "Team Member";
  for (const role of project.roles) {
    if (student.preferredRoles.some((r) => r.toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(r.toLowerCase()))) {
      assignedRole = role;
      break;
    }
  }

  const breakdown: CandidateScoreBreakdown = {
    skillMatch: Math.round(skillMatch),
    interestAlignment: Math.round(interestAlignment),
    availability: Math.round(availabilityScore),
    experience: Math.round(experience),
    pastProjectRelevance: Math.round(pastProjectRelevance),
    collaborationFit: Math.round(collaborationFit),
  };

  return {
    student,
    overallScore,
    assignedRole,
    breakdown,
    matchedRequiredSkills: matchedRequired,
    matchedPreferredSkills: matchedPreferred,
    matchedInterests,
    matchedProjects,
  };
}

/**
 * Scores and ranks an entire pool of student profiles
 */
export function rankCandidates(
  students: StudentProfile[],
  project: ProjectAnalysisResult
): CandidateMatch[] {
  const scored = students.map((s) => scoreCandidate(s, project));
  return scored.sort((a, b) => b.overallScore - a.overallScore);
}
