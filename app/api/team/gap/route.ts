import { NextRequest, NextResponse } from "next/server";
import { findMissingTeammate } from "@/lib/matching/missing-teammate";
import { getStudentProfiles } from "@/lib/db/students";
import { explainGap } from "@/lib/ai/gap-explainer";
import { ProjectAnalysisResult } from "@/types/project";
import { CandidateMatch } from "@/types/matching";

export async function POST(req: NextRequest) {
  try {
    const { currentTeam, project, targetSkill } = (await req.json()) as {
      currentTeam: CandidateMatch[];
      project: ProjectAnalysisResult;
      targetSkill?: string;
    };

    if (!currentTeam || !project) {
      return NextResponse.json(
        { error: "Missing currentTeam or project data in request" },
        { status: 400 }
      );
    }

    const allStudents = await getStudentProfiles();
    const recommendation = findMissingTeammate(
      currentTeam,
      allStudents,
      project,
      targetSkill
    );

    if (!recommendation) {
      return NextResponse.json(
        { error: "No available candidates found to resolve the gap" },
        { status: 404 }
      );
    }

    // Generate grounded explanation with Gemini
    const aiExplanation = await explainGap(
      recommendation.criticalSkill,
      recommendation.candidate,
      project
    );

    return NextResponse.json({
      recommendation: {
        ...recommendation,
        gapSummary: aiExplanation.gapSummary,
        recommendationReason: aiExplanation.recommendationReason,
        candidateEvidence: aiExplanation.candidateEvidence,
      },
    });
  } catch (error: any) {
    console.error("[API /api/team/gap Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to find missing teammate" },
      { status: 500 }
    );
  }
}
