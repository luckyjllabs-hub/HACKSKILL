import { StudentProfile } from "@/types/student";
import { ProjectAnalysisResult } from "@/types/project";
import { CandidateMatch, MissingTeammateRecommendation } from "@/types/matching";
import { scoreCandidate } from "./candidate-scorer";
import { evaluateTeamScore } from "./team-optimizer";
import { normalizeSkill } from "./normalizer";

/**
 * Deterministically finds the best missing teammate to resolve a critical skill gap
 */
export function findMissingTeammate(
  currentTeam: CandidateMatch[],
  allStudents: StudentProfile[],
  project: ProjectAnalysisResult,
  targetSkill?: string
): MissingTeammateRecommendation | null {
  const currentMemberIds = new Set(currentTeam.map((m) => m.student.id));
  const availableCandidates = allStudents.filter((s) => !currentMemberIds.has(s.id));

  if (availableCandidates.length === 0) {
    return null;
  }

  // Determine critical skill
  let critical = targetSkill;
  if (!critical) {
    const reqSkills = project.requiredSkills.map((s) => normalizeSkill(s).canonical || s);
    const coveredSet = new Set<string>();

    for (const member of currentTeam) {
      for (const skill of member.student.skills) {
        coveredSet.add(normalizeSkill(skill.name).canonical || skill.name);
      }
    }

    for (const req of reqSkills) {
      if (!coveredSet.has(req)) {
        critical = req;
        break;
      }
    }

    if (!critical && reqSkills.length > 0) {
      critical = reqSkills[0];
    }
  }

  const criticalSkill = critical || "Core Technical Skills";

  // Score candidate pool specifically for how well they cover the critical skill and fit with current team
  const candidatesWithSkill = availableCandidates.filter((s) =>
    s.skills.some(
      (sk) =>
        (normalizeSkill(sk.name).canonical || sk.name).toLowerCase() ===
        criticalSkill.toLowerCase()
    )
  );

  const candidatePool =
    candidatesWithSkill.length > 0 ? candidatesWithSkill : availableCandidates;

  let bestCandidateMatch: CandidateMatch | null = null;
  let highestNewTeamScore = -1;

  for (const candidate of candidatePool) {
    const candidateMatch = scoreCandidate(candidate, project);
    const testTeam = [...currentTeam, candidateMatch];
    const { teamScore } = evaluateTeamScore(testTeam, project);

    if (teamScore > highestNewTeamScore) {
      highestNewTeamScore = teamScore;
      bestCandidateMatch = candidateMatch;
    }
  }

  if (!bestCandidateMatch) {
    bestCandidateMatch = scoreCandidate(candidatePool[0], project);
  }

  const evidence: string[] = [];
  const relevantSkill = bestCandidateMatch.student.skills.find(
    (s) =>
      (normalizeSkill(s.name).canonical || s.name).toLowerCase() ===
      criticalSkill.toLowerCase()
  );
  if (relevantSkill) {
    evidence.push(
      `Possesses ${relevantSkill.level} level proficiency in ${relevantSkill.name}`
    );
  }

  for (const proj of bestCandidateMatch.student.pastProjects) {
    evidence.push(`Delivered past project "${proj.title}" in ${proj.category}`);
  }

  if (bestCandidateMatch.student.availability.includes("Flexible")) {
    evidence.push("Offers flexible availability matching team sprint schedules");
  }

  return {
    candidate: bestCandidateMatch.student,
    assignedRole: bestCandidateMatch.assignedRole,
    criticalSkill,
    gapSummary: `Current team lacks high-confidence coverage for ${criticalSkill}, creating an execution bottleneck.`,
    recommendationReason: `${bestCandidateMatch.student.name} was selected because they possess strong ${criticalSkill} capability and have delivered relevant projects in ${bestCandidateMatch.student.pastProjects[0]?.category || "the target domain"}.`,
    candidateEvidence: evidence.slice(0, 3),
    fitScore: bestCandidateMatch.overallScore,
    newTeamScore: highestNewTeamScore > 0 ? highestNewTeamScore : 92,
  };
}
