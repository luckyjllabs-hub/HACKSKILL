import { describe, it, expect, vi } from "vitest";
import { GET as getAiStatus } from "@/app/api/ai/status/route";
import { GET as getStudentsSeed } from "@/app/api/db/seed/route";
import { POST as saveProjectRoute } from "@/app/api/project/save/route";
import { NextRequest } from "next/server";

describe("API Endpoints & Controllers", () => {
  it("GET /api/ai/status should return JSON status response", async () => {
    const response = await getAiStatus();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("configured");
    expect(json).toHaveProperty("model");
    expect(json).toHaveProperty("status");
  });

  it("GET /api/db/seed should return student count and status", async () => {
    const response = await getStudentsSeed();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.count).toBeGreaterThanOrEqual(35);
  });

  it("POST /api/project/save should accept and persist valid payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/project/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: {
          projectCategory: "AI / Sustainability",
          domain: ["Sustainability"],
          requiredSkills: ["Machine Learning"],
          preferredSkills: [],
          roles: ["ML Engineer"],
          recommendedTeamSize: 4,
          experienceRequirements: [],
          availabilityRequirement: "Flexible",
        },
        team: [],
        teamScore: 88,
      }),
    });

    const response = await saveProjectRoute(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
  });
});
