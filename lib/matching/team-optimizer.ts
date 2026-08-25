import { ProjectAnalysisResult } from "@/types/project";
import { CandidateMatch, TeamScoreBreakdown } from "@/types/matching";
import { normalizeSkill } from "./normalizer";

/**
 * Calculates deterministic team score for a specific combination of candidates
 */
export function evaluateTeamScore(
  team: CandidateMatch[],
  project: ProjectAnalysisResult
): { teamScore: number; breakdown: TeamScoreBreakdown } {
  if (team.length === 0) {
    return {
      teamScore: 0,
      breakdown: {
        skillCoverage: 0,
        complementarity: 0,
        candidateQuality: 0,
        interestAlignment: 0,
        availability: 0,
        experienceRelevance: 0,
      },
    };
  }

  const reqSkills = project.requiredSkills.map((s) => normalizeSkill(s).canonical || s);
  const prefSkills = project.preferredSkills.map((s) => normalizeSkill(s).canonical || s);

  // 1. Skill Coverage (35% weight)
  const coveredRequired = new Set<string>();
  const skillCountMap = new Map<string, number>();

  for (const member of team) {
    for (const s of member.student.skills) {
      const canonical = normalizeSkill(s.name).canonical || s.name;
      skillCountMap.set(canonical, (skillCountMap.get(canonical) || 0) + 1);

      if (reqSkills.some((req) => req.toLowerCase() === canonical.toLowerCase())) {
        coveredRequired.add(canonical);
      }
    }
  }

  const reqCoverageRatio = reqSkills.length > 0 ? coveredRequired.size / reqSkills.length : 1;
  const skillCoverage = Math.min(100, Math.round(reqCoverageRatio * 100));

  // 2. Complementarity (25% weight)
  // High when members bring distinct skills, low when there is excessive duplication
  let redundancyPenalties = 0;
  skillCountMap.forEach((count, skillName) => {
    // If more than 2 members share the exact same primary technical skill (e.g. CV or Python)
    if (count > 2 && skillName !== "Python" && skillName !== "APIs") {
      redundancyPenalties += (count - 2) * 15;
    }
  });

  // Distinct roles covered
  const distinctRoles = new Set(team.map((m) => m.assignedRole)).size;
  const roleDiversityBonus = Math.min(30, (distinctRoles / Math.max(1, project.roles.length)) * 30);

  let complementarity = 70 + roleDiversityBonus - redundancyPenalties;
  // Complementarity bonus if all required skills are covered with minimal overlap
  if (reqCoverageRatio >= 1.0) {
    complementarity += 15;
  }
  complementarity = Math.max(20, Math.min(100, Math.round(complementarity)));

  // 3. Candidate Quality (15% weight)
  const avgCandidateScore =
    team.reduce((acc, m) => acc + m.overallScore, 0) / team.length;
  const candidateQuality = Math.round(avgCandidateScore);

  // 4. Interest Alignment (10% weight)
  const avgInterest =
    team.reduce((acc, m) => acc + m.breakdown.interestAlignment, 0) / team.length;
  const interestAlignment = Math.round(avgInterest);

  // 5. Availability (10% weight)
  // Availability overlap
  const allFlexible = team.every((m) => m.student.availability.includes("Flexible"));
  const avgAvailability =
    team.reduce((acc, m) => acc + m.breakdown.availability, 0) / team.length;
  const availability = Math.round(allFlexible ? 98 : avgAvailability);

  // 6. Experience Relevance (5% weight)
  const avgExp =
    team.reduce(
      (acc, m) => acc + (m.breakdown.experience + m.breakdown.pastProjectRelevance) / 2,
      0
    ) / team.length;
  const experienceRelevance = Math.round(avgExp);

  // Final Team Score (0-100)
  const teamScore = Math.round(
    skillCoverage * 0.35 +
      complementarity * 0.25 +
      candidateQuality * 0.15 +
      interestAlignment * 0.1 +
      availability * 0.1 +
      experienceRelevance * 0.05
  );

  return {
    teamScore: Math.min(100, Math.max(0, teamScore)),
    breakdown: {
      skillCoverage,
      complementarity,
      candidateQuality,
      interestAlignment,
      availability,
      experienceRelevance,
    },
  };
}

/**
 * Generates combinations of size k from an array
 */
function getCombinations<T>(array: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (array.length === 0) return [];
  const head = array[0];
  const tail = array.slice(1);
  const withHead = getCombinations(tail, k - 1).map((c) => [head, ...c]);
  const withoutHead = getCombinations(tail, k);
  return [...withHead, ...withoutHead];
}

/**
 * Optimizes team composition using combinatorial evaluation over ranked candidates
 */
export function optimizeTeam(
  rankedCandidates: CandidateMatch[],
  project: ProjectAnalysisResult,
  targetSize?: number
): {
  team: CandidateMatch[];
  teamScore: number;
  breakdown: TeamScoreBreakdown;
} {
  const k = targetSize || project.recommendedTeamSize || 4;

  if (rankedCandidates.length <= k) {
    const { teamScore, breakdown } = evaluateTeamScore(rankedCandidates, project);
    return { team: rankedCandidates, teamScore, breakdown };
  }

  // Pre-filter top candidates (pool of 12-14) to maintain snappy performance
  const candidatePool = rankedCandidates.slice(0, Math.min(14, rankedCandidates.length));
  const combinations = getCombinations(candidatePool, k);

  let bestTeam: CandidateMatch[] = candidatePool.slice(0, k);
  let bestResult = evaluateTeamScore(bestTeam, project);

  for (const combo of combinations) {
    const result = evaluateTeamScore(combo, project);
    if (result.teamScore > bestResult.teamScore) {
      bestTeam = combo;
      bestResult = result;
    }
  }

  return {
    team: bestTeam,
    teamScore: bestResult.teamScore,
    breakdown: bestResult.breakdown,
  };
}
