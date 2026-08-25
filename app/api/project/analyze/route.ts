import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeProject } from "@/lib/ai/project-analyzer";
import { getStudentProfiles } from "@/lib/db/students";
import { rankCandidates } from "@/lib/matching/candidate-scorer";
import { optimizeTeam } from "@/lib/matching/team-optimizer";
import { analyzeTeamHealth } from "@/lib/matching/team-health";
import { explainTeam } from "@/lib/ai/team-explainer";

const requestSchema = z.object({
  description: z.string().min(3, "Project description must be at least 3 characters"),
  desiredTeamSize: z.number().int().min(2).max(8).default(4),
  category: z.string().optional(),
  availability: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.format() },
        { status: 400 }
      );
    }

    const input = validation.data;

    // 1. Semantic Project Analysis via Gemini
    const projectAnalysis = await analyzeProject(input);

    // 2. Fetch Student Profiles
    const allStudents = await getStudentProfiles();

    // 3. Deterministic Candidate Scoring & Ranking
    const rankedCandidates = rankCandidates(allStudents, projectAnalysis);

    // 4. Combinatorial Complementary Team Optimization
    const { team, teamScore, breakdown } = optimizeTeam(
      rankedCandidates,
      projectAnalysis,
      projectAnalysis.recommendedTeamSize
    );

    // 5. Team Health Analysis & Skill Gap Detection
    const teamHealth = analyzeTeamHealth(team, projectAnalysis);

    // 6. Grounded AI Explanation of Composed Team
    const explanation = await explainTeam(team, projectAnalysis);

    // 7. Automatically Persist Project Record & Team to Database
    let savedProjectId: string | null = null;
    try {
      const { saveProjectRecord } = await import("@/lib/db/store");
      const saveRes = await saveProjectRecord({
        project: projectAnalysis,
        team,
        teamScore,
        breakdown,
        teamHealth,
        explanation,
        createdAt: new Date().toISOString(),
      });
      savedProjectId = saveRes.id;
    } catch (dbErr) {
      console.warn("[Database Auto-Save Warning]:", dbErr);
    }

    return NextResponse.json({
      project: projectAnalysis,
      team,
      teamScore,
      breakdown,
      teamHealth,
      explanation,
      rankedCandidates,
      savedProjectId,
    });
  } catch (error: any) {
    console.error("[API /api/project/analyze Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze project and compose team" },
      { status: 500 }
    );
  }
}
