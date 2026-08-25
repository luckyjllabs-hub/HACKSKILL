import { NextRequest, NextResponse } from "next/server";
import { isGeminiConfigured, callGeminiStructured, GEMINI_MODEL, getGeminiApiKey } from "@/lib/ai/gemini";

export async function GET() {
  const configured = isGeminiConfigured();
  if (!configured) {
    return NextResponse.json({
      configured: false,
      model: GEMINI_MODEL,
      status: "Demo Mode (Heuristic Semantic Parser Active)",
      message: "Add GEMINI_API_KEY to .env.local to activate live Google Gemini 3.7/1.5 Flash calls.",
    });
  }

  // Run a lightweight live diagnostic ping
  const { data, error, latencyMs } = await callGeminiStructured<{ status: string }>(
    "You are a system health check engine. Respond with {\"status\": \"ok\"}",
    "Ping check",
    4000
  );

  if (error || !data) {
    return NextResponse.json({
      configured: true,
      model: GEMINI_MODEL,
      status: "API Key Detected (Connection Error)",
      error: error,
      message: "Check API key permissions or quota on Google AI Studio.",
    });
  }

  return NextResponse.json({
    configured: true,
    model: GEMINI_MODEL,
    status: "Live & Connected",
    latencyMs,
    message: `Gemini ${GEMINI_MODEL} is active and processing requests.`,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();
    if (!apiKey) {
      return NextResponse.json({ error: "Missing apiKey in body" }, { status: 400 });
    }

    const { data, error, latencyMs } = await callGeminiStructured<{ status: string }>(
      "You are a system health check engine. Respond with {\"status\": \"ok\"}",
      "Ping check",
      5000,
      apiKey
    );

    if (error || !data) {
      return NextResponse.json({
        success: false,
        error: error || "Failed to validate API key with Gemini",
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      latencyMs,
      message: "API key successfully verified with Google Gemini.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
