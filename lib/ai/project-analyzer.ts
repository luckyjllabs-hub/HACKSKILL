import { ProjectAnalysisInput, ProjectAnalysisResult } from "@/types/project";
import { projectAnalysisSchema, ProjectAnalysisZod } from "./schemas";
import { callGeminiStructured } from "./gemini";
import { PROJECT_ANALYSIS_SYSTEM_PROMPT } from "./prompts";
import { normalizeSkillList } from "@/lib/matching/normalizer";

/**
 * Deterministic fallback analyzer when Gemini API is unavailable
 */
export function analyzeProjectFallback(input: ProjectAnalysisInput): ProjectAnalysisResult {
  const desc = input.description.toLowerCase();
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];
  const domains: string[] = [];
  const roles: string[] = [];
  let category = "Full-Stack Software";

  // Skill & Domain detection heuristics
  if (desc.includes("waste") || desc.includes("recycle") || desc.includes("sustain") || desc.includes("circular")) {
    category = "AI / Sustainability";
    domains.push("Sustainability", "Smart Cities");
    requiredSkills.push("Computer Vision", "Machine Learning", "Sustainability");
    preferredSkills.push("Frontend", "Backend", "UI/UX");
    roles.push("ML Engineer", "Full Stack Developer", "UI/UX Designer", "Domain Specialist");
  } else if (desc.includes("pothole") || desc.includes("road") || desc.includes("camera") || desc.includes("traffic")) {
    category = "AI / Computer Vision";
    domains.push("Smart Cities", "Transportation");
    requiredSkills.push("Computer Vision", "Machine Learning", "Python", "Mobile");
    preferredSkills.push("Backend", "Geospatial Data", "UI/UX");
    roles.push("Computer Vision Lead", "Mobile Developer", "Geospatial Lead", "Backend Developer");
  } else if (desc.includes("agri") || desc.includes("crop") || desc.includes("farm") || desc.includes("drone")) {
    category = "Agriculture / AI / IoT";
    domains.push("Agriculture", "IoT", "Smart Cities");
    requiredSkills.push("Computer Vision", "Machine Learning", "Agriculture", "IoT");
    preferredSkills.push("Mobile", "UI/UX");
    roles.push("ML Engineer", "Agritech Domain Specialist", "IoT Engineer", "Mobile Developer");
  } else if (desc.includes("mental") || desc.includes("health") || desc.includes("stress") || desc.includes("wellness")) {
    category = "Healthcare / NLP";
    domains.push("Healthcare", "Wellness", "AI");
    requiredSkills.push("Natural Language Processing", "Python", "Healthcare");
    preferredSkills.push("UI/UX", "Backend", "Database");
    roles.push("NLP Specialist", "Healthcare Domain Lead", "UI/UX Designer", "Full Stack Developer");
  } else if (desc.includes("fintech") || desc.includes("loan") || desc.includes("credit") || desc.includes("fraud") || desc.includes("money")) {
    category = "FinTech / Data Science";
    domains.push("FinTech", "Startups");
    requiredSkills.push("FinTech", "Data Science", "Python", "Backend");
    preferredSkills.push("Cybersecurity", "APIs");
    roles.push("FinTech Specialist", "Data Scientist", "Backend Lead");
  } else {
    // General keyword extraction
    if (desc.includes("vision") || desc.includes("image")) requiredSkills.push("Computer Vision");
    if (desc.includes("nlp") || desc.includes("llm") || desc.includes("text")) requiredSkills.push("Natural Language Processing");
    if (desc.includes("ml") || desc.includes("ai") || desc.includes("model")) requiredSkills.push("Machine Learning", "Python");
    if (desc.includes("mobile") || desc.includes("app") || desc.includes("flutter")) requiredSkills.push("Mobile");
    if (desc.includes("iot") || desc.includes("sensor") || desc.includes("hardware")) requiredSkills.push("IoT");
    if (desc.includes("gis") || desc.includes("map")) requiredSkills.push("Geospatial Data");
    if (desc.includes("security") || desc.includes("auth")) requiredSkills.push("Cybersecurity");

    if (requiredSkills.length === 0) {
      requiredSkills.push("Frontend", "Backend", "Database");
    }

    preferredSkills.push("UI/UX", "APIs");
    domains.push("Software Engineering");
    roles.push("Lead Developer", "Full Stack Developer", "UI/UX Designer");
  }

  const { canonicalList: canonicalRequired, details } = normalizeSkillList(requiredSkills);
  const { canonicalList: canonicalPreferred } = normalizeSkillList(preferredSkills);

  return {
    projectCategory: category,
    domain: domains.length > 0 ? domains : ["Technology"],
    requiredSkills: canonicalRequired.length > 0 ? canonicalRequired : requiredSkills,
    preferredSkills: canonicalPreferred,
    roles: roles.length > 0 ? roles : ["Full Stack Developer", "ML Engineer", "UI/UX Designer"],
    recommendedTeamSize: input.desiredTeamSize || 4,
    experienceRequirements: ["Project-level execution experience", "Collaboration track record"],
    availabilityRequirement: input.availability || "Flexible",
    normalizedSkills: details,
    isFallback: true,
  };
}

/**
 * Analyzes project using Gemini with strict Zod validation and safe fallback
 */
export async function analyzeProject(
  input: ProjectAnalysisInput
): Promise<ProjectAnalysisResult> {
  const userPrompt = `Project Description:
"${input.description}"

Constraints:
- Desired Team Size: ${input.desiredTeamSize || 4}
- Optional Category: ${input.category || "Infer from description"}
- Optional Availability Requirement: ${input.availability || "Flexible"}

Analyze the project requirements and respond in the exact JSON schema:
{
  "projectCategory": "string",
  "domain": ["string"],
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "roles": ["string"],
  "recommendedTeamSize": number,
  "experienceRequirements": ["string"],
  "availabilityRequirement": "string"
}`;

  const { data, error } = await callGeminiStructured<ProjectAnalysisZod>(
    PROJECT_ANALYSIS_SYSTEM_PROMPT,
    userPrompt
  );

  if (error || !data) {
    console.warn("[Project Analyzer] Falling back to deterministic analysis:", error);
    return analyzeProjectFallback(input);
  }

  // Validate response with Zod
  const parseResult = projectAnalysisSchema.safeParse(data);
  if (!parseResult.success) {
    console.warn("[Project Analyzer] Zod validation failed on Gemini output:", parseResult.error);
    return analyzeProjectFallback(input);
  }

  const validated = parseResult.data;

  // Run skill normalization
  const { canonicalList: canonicalRequired, details: reqDetails } = normalizeSkillList(
    validated.requiredSkills
  );
  const { canonicalList: canonicalPreferred, details: prefDetails } = normalizeSkillList(
    validated.preferredSkills
  );

  return {
    projectCategory: validated.projectCategory,
    domain: validated.domain,
    requiredSkills: canonicalRequired.length > 0 ? canonicalRequired : validated.requiredSkills,
    preferredSkills: canonicalPreferred,
    roles: validated.roles,
    recommendedTeamSize: validated.recommendedTeamSize || input.desiredTeamSize || 4,
    experienceRequirements: validated.experienceRequirements,
    availabilityRequirement: validated.availabilityRequirement || input.availability || "Flexible",
    normalizedSkills: [...reqDetails, ...prefDetails],
    isFallback: false,
  };
}
