import { NextRequest, NextResponse } from "next/server";
import { explainTeam } from "@/lib/ai/team-explainer";
import { ProjectAnalysisResult } from "@/types/project";
import { CandidateMatch } from "@/types/matching";

export async function POST(req: NextRequest) {
  try {
    const { team, project } = (await req.json()) as {
      team: CandidateMatch[];
      project: ProjectAnalysisResult;
    };

    if (!team || !project) {
      return NextResponse.json(
        { error: "Missing team or project data in request" },
        { status: 400 }
      );
    }

    const explanation = await explainTeam(team, project);
    return NextResponse.json({ explanation });
  } catch (error: any) {
    console.error("[API /api/team/explain Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate team explanation" },
      { status: 500 }
    );
  }
}
