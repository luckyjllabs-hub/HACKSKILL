import { ProjectAnalysisResult } from "@/types/project";
import { StudentProfile } from "@/types/student";
import { gapExplanationSchema, GapExplanationZod } from "./schemas";
import { callGeminiStructured } from "./gemini";
import { GAP_EXPLANATION_SYSTEM_PROMPT } from "./prompts";

export interface GapExplanationResult {
  gapSummary: string;
  criticalSkill: string;
  recommendationReason: string;
  candidateEvidence: string[];
}

/**
 * Fallback grounded gap explainer
 */
export function explainGapFallback(
  criticalSkill: string,
  candidate: StudentProfile,
  project: ProjectAnalysisResult
): GapExplanationResult {
  const evidence: string[] = [];
  const skillObj = candidate.skills.find(
    (s) => s.name.toLowerCase() === criticalSkill.toLowerCase()
  );
  if (skillObj) {
    evidence.push(`Direct ${skillObj.level} expertise in ${skillObj.name}`);
  }
  if (candidate.pastProjects.length > 0) {
    evidence.push(
      `Built "${candidate.pastProjects[0].title}" covering ${candidate.pastProjects[0].skills.join(", ")}`
    );
  }
  evidence.push(`Available during ${candidate.availability.join(", ")}`);

  return {
    gapSummary: `Your project requires ${criticalSkill} capability to successfully execute its milestones. The current team is deficient in this capability.`,
    criticalSkill,
    recommendationReason: `${candidate.name} is the optimal addition because their profile directly provides verified ${criticalSkill} experience without adding redundant overhead.`,
    candidateEvidence: evidence,
  };
}

/**
 * Generates grounded AI explanation for why a skill gap matters and why a candidate resolves it
 */
export async function explainGap(
  criticalSkill: string,
  candidate: StudentProfile,
  project: ProjectAnalysisResult
): Promise<GapExplanationResult> {
  const userPrompt = `PROJECT:
Category: ${project.projectCategory}
Missing Critical Skill: ${criticalSkill}

RECOMMENDED CANDIDATE:
Name: ${candidate.name}
Department: ${candidate.department}
Experience: ${candidate.experienceLevel}
Skills: ${JSON.stringify(candidate.skills)}
Past Projects: ${JSON.stringify(candidate.pastProjects)}
Availability: ${candidate.availability.join(", ")}

Generate a grounded explanation in the requested JSON structure:
{
  "gapSummary": "string",
  "criticalSkill": "string",
  "recommendationReason": "string",
  "candidateEvidence": ["string"]
}`;

  const { data, error } = await callGeminiStructured<GapExplanationZod>(
    GAP_EXPLANATION_SYSTEM_PROMPT,
    userPrompt
  );

  if (error || !data) {
    console.warn("[Gap Explainer] Falling back to deterministic explanation:", error);
    return explainGapFallback(criticalSkill, candidate, project);
  }

  const parseResult = gapExplanationSchema.safeParse(data);
  if (!parseResult.success) {
    console.warn("[Gap Explainer] Zod validation failed:", parseResult.error);
    return explainGapFallback(criticalSkill, candidate, project);
  }

  return parseResult.data;
}
