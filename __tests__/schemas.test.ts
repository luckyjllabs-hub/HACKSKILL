import { describe, it, expect } from "vitest";
import {
  projectAnalysisSchema,
  teamExplanationSchema,
  gapExplanationSchema,
} from "@/lib/ai/schemas";

describe("Zod AI Schemas", () => {
  describe("projectAnalysisSchema", () => {
    it("should validate a complete valid project analysis object", () => {
      const validData = {
        projectCategory: "AI / Computer Vision",
        domain: ["Smart Cities", "Transportation"],
        requiredSkills: ["Computer Vision", "Machine Learning", "Python"],
        preferredSkills: ["Mobile", "Geospatial Data"],
        roles: ["CV Lead", "Mobile Developer", "Backend Lead"],
        recommendedTeamSize: 4,
        experienceRequirements: ["Python proficiency"],
        availabilityRequirement: "Flexible",
      };

      const result = projectAnalysisSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject when requiredSkills is missing or not an array", () => {
      const invalidData = {
        projectCategory: "AI",
        domain: ["Smart Cities"],
        roles: ["Developer"],
      };

      const result = projectAnalysisSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should coerce numerical team size correctly", () => {
      const dataWithNumber = {
        projectCategory: "Sustainability",
        domain: ["Clean Energy"],
        requiredSkills: ["Solar Tech"],
        preferredSkills: [],
        roles: ["Engineer"],
        recommendedTeamSize: 3,
        experienceRequirements: ["Basic"],
        availabilityRequirement: "Weekends",
      };

      const result = projectAnalysisSchema.safeParse(dataWithNumber);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.recommendedTeamSize).toBe(3);
      }
    });
  });

  describe("teamExplanationSchema", () => {
    it("should validate a well-formed grounded team explanation", () => {
      const validExplanation = {
        teamSummary: "A multidisciplinary team with strong CV and domain coverage.",
        members: [
          {
            profileId: "student-001",
            role: "CV Lead",
            reason: "Experienced in object detection.",
            skillsFilled: ["Computer Vision"],
            evidence: ["Built smart traffic detector"],
          },
        ],
        complementarityExplanation: "Balanced skill distribution with zero overlap.",
        remainingGaps: [],
      };

      const result = teamExplanationSchema.safeParse(validExplanation);
      expect(result.success).toBe(true);
    });

    it("should reject when member object is missing profileId", () => {
      const invalidExplanation = {
        teamSummary: "Summary",
        members: [
          {
            role: "CV Lead",
            reason: "Reason",
          },
        ],
        complementarityExplanation: "Complementary",
        remainingGaps: [],
      };

      const result = teamExplanationSchema.safeParse(invalidExplanation);
      expect(result.success).toBe(false);
    });
  });

  describe("gapExplanationSchema", () => {
    it("should validate a gap resolution rationale object", () => {
      const validGap = {
        gapSummary: "Current team lacks high-confidence coverage for Sustainability.",
        criticalSkill: "Sustainability",
        recommendationReason: "Direct domain expertise in carbon auditing.",
        candidateEvidence: ["Delivered cafeteria carbon tracker"],
      };

      const result = gapExplanationSchema.safeParse(validGap);
      expect(result.success).toBe(true);
    });

    it("should reject when recommendationReason is missing", () => {
      const invalidGap = {
        gapSummary: "Gap detected",
        criticalSkill: "IoT",
      };

      const result = gapExplanationSchema.safeParse(invalidGap);
      expect(result.success).toBe(false);
    });
  });
});
