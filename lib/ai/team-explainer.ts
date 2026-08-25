import { ProjectAnalysisResult } from "@/types/project";
import { CandidateMatch, TeamExplanationResult } from "@/types/matching";
import { teamExplanationSchema, TeamExplanationZod } from "./schemas";
import { callGeminiStructured } from "./gemini";
import { TEAM_EXPLANATION_SYSTEM_PROMPT } from "./prompts";
import { normalizeSkill } from "@/lib/matching/normalizer";

/**
 * Fallback grounded explanation generator
 */
export function explainTeamFallback(
  team: CandidateMatch[],
  project: ProjectAnalysisResult
): TeamExplanationResult {
  const members = team.map((member) => {
    const matchedSkills = member.matchedRequiredSkills.concat(
      member.matchedPreferredSkills
    );
    const skillsFilled =
      matchedSkills.length > 0
        ? matchedSkills
        : member.student.skills.map((s) => s.name);

    const evidence: string[] = [];
    if (member.student.pastProjects.length > 0) {
      evidence.push(
        `Completed "${member.student.pastProjects[0].title}" in ${member.student.pastProjects[0].category}`
      );
    }
    evidence.push(
      `${member.student.experienceLevel} proficiency with ${member.student.skills.map((s) => s.name).slice(0, 3).join(", ")}`
    );

    return {
      profileId: member.student.id,
      role: member.assignedRole,
      reason: `${member.student.name} provides vital ${member.assignedRole} execution capabilities, covering key project requirements.`,
      skillsFilled: skillsFilled.slice(0, 3),
      evidence,
    };
  });

  return {
    teamSummary: `This ${team.length}-member team was formulated to maximize complementary skill coverage for ${project.projectCategory}. It balances technical execution with domain requirements.`,
    members,
    complementarityExplanation: `Each member fulfills distinct roles (${team.map((m) => m.assignedRole).join(", ")}) minimizing redundancy and providing complete coverage across required capabilities.`,
    remainingGaps: [],
  };
}

/**
 * Generates grounded AI explanation for the selected team
 */
export async function explainTeam(
  team: CandidateMatch[],
  project: ProjectAnalysisResult
): Promise<TeamExplanationResult> {
  const teamEvidencePayload = {
    projectCategory: project.projectCategory,
    requiredSkills: project.requiredSkills,
    preferredSkills: project.preferredSkills,
    selectedTeam: team.map((m) => ({
      profileId: m.student.id,
      name: m.student.name,
      assignedRole: m.assignedRole,
      skills: m.student.skills,
      experienceLevel: m.student.experienceLevel,
      pastProjects: m.student.pastProjects,
      matchedSkills: m.matchedRequiredSkills.concat(m.matchedPreferredSkills),
    })),
  };

  const userPrompt = `PROJECT REQUIREMENTS:
Category: ${project.projectCategory}
Required Skills: ${project.requiredSkills.join(", ")}
Preferred Skills: ${project.preferredSkills.join(", ")}

SELECTED TEAM CANDIDATES:
${JSON.stringify(teamEvidencePayload.selectedTeam, null, 2)}

Provide a grounded explanation in the requested JSON structure:
{
  "teamSummary": "string",
  "members": [
    {
      "profileId": "string",
      "role": "string",
      "reason": "string",
      "skillsFilled": ["string"],
      "evidence": ["string"]
    }
  ],
  "complementarityExplanation": "string",
  "remainingGaps": ["string"]
}`;

  const { data, error } = await callGeminiStructured<TeamExplanationZod>(
    TEAM_EXPLANATION_SYSTEM_PROMPT,
    userPrompt
  );

  if (error || !data) {
    console.warn("[Team Explainer] Falling back to deterministic explanation:", error);
    return explainTeamFallback(team, project);
  }

  const parseResult = teamExplanationSchema.safeParse(data);
  if (!parseResult.success) {
    console.warn("[Team Explainer] Zod validation failed:", parseResult.error);
    return explainTeamFallback(team, project);
  }

  return parseResult.data;
}
