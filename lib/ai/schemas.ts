import { z } from "zod";

export const projectAnalysisSchema = z.object({
  projectCategory: z.string(),
  domain: z.array(z.string()).min(1).max(5),
  requiredSkills: z.array(z.string()).min(1).max(12),
  preferredSkills: z.array(z.string()).max(12),
  roles: z.array(z.string()).min(1).max(8),
  recommendedTeamSize: z.number().int().min(2).max(8),
  experienceRequirements: z.array(z.string()).max(8),
  availabilityRequirement: z.string().optional().default("Flexible"),
});

export type ProjectAnalysisZod = z.infer<typeof projectAnalysisSchema>;

export const teamExplanationSchema = z.object({
  teamSummary: z.string(),
  members: z.array(
    z.object({
      profileId: z.string(),
      role: z.string(),
      reason: z.string(),
      skillsFilled: z.array(z.string()),
      evidence: z.array(z.string()),
    })
  ),
  complementarityExplanation: z.string(),
  remainingGaps: z.array(z.string()),
});

export type TeamExplanationZod = z.infer<typeof teamExplanationSchema>;

export const gapExplanationSchema = z.object({
  gapSummary: z.string(),
  criticalSkill: z.string(),
  recommendationReason: z.string(),
  candidateEvidence: z.array(z.string()),
});

export type GapExplanationZod = z.infer<typeof gapExplanationSchema>;

export const skillNormalizationSchema = z.object({
  normalizedSkills: z.array(
    z.object({
      original: z.string(),
      canonical: z.string().nullable(),
      confidence: z.number().min(0).max(1),
    })
  ),
});

export type SkillNormalizationZod = z.infer<typeof skillNormalizationSchema>;
