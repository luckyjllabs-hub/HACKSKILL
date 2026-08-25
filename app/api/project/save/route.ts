import { NextRequest, NextResponse } from "next/server";
import { saveProjectRecord } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project, team, teamScore, breakdown, teamHealth } = body;

    const result = await saveProjectRecord({
      project,
      team,
      teamScore,
      breakdown,
      teamHealth,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: result.savedToFirebase
        ? "Project team successfully saved to Firebase Firestore."
        : "Project team saved to persistent database.",
      id: result.id,
      savedToFirebase: result.savedToFirebase,
    });
  } catch (error: any) {
    console.error("[Save Project Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save project record" },
      { status: 500 }
    );
  }
}
