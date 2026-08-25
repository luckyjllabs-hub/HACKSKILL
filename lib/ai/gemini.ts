import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Default Gemini Model identifier
 */
export const GEMINI_MODEL = "gemini-1.5-flash";

/**
 * Returns current Gemini API Key from process environment
 */
export function getGeminiApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();
}

/**
 * Returns whether Gemini is configured with a valid API key
 */
export function isGeminiConfigured(): boolean {
  const key = getGeminiApiKey();
  return Boolean(key && key.length > 5);
}

/**
 * Instantiates a fresh GoogleGenerativeAI client
 */
export function getGenAIClient(customKey?: string): GoogleGenerativeAI | null {
  const key = customKey || getGeminiApiKey();
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

/**
 * Safe helper to execute structured Gemini prompts with timeout and error fallback
 */
export async function callGeminiStructured<T>(
  systemInstruction: string,
  userPrompt: string,
  timeoutMs: number = 8500,
  customApiKey?: string
): Promise<{ rawText: string; data: T | null; error: string | null; latencyMs?: number }> {
  const startTime = Date.now();
  const client = getGenAIClient(customApiKey);

  if (!client) {
    return {
      rawText: "",
      data: null,
      error: "GEMINI_API_KEY is not configured.",
    };
  }

  try {
    const model = client.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const timeoutPromise = new Promise<{ rawText: string; data: T | null; error: string }>((_, reject) =>
      setTimeout(() => reject(new Error(`Gemini API request timed out after ${timeoutMs}ms`)), timeoutMs)
    );

    const apiPromise = (async () => {
      const response = await model.generateContent(userPrompt);
      const text = response.response.text();
      let parsed: T | null = null;
      try {
        parsed = JSON.parse(text) as T;
      } catch (err) {
        // Try extracting JSON block if enclosed in markdown
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]) as T;
        }
      }
      return { rawText: text, data: parsed, error: null };
    })();

    const result = await Promise.race([apiPromise, timeoutPromise]);
    const latencyMs = Date.now() - startTime;
    return { ...result, latencyMs };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown Gemini API error";
    console.warn("[Gemini AI Service Error]:", errorMsg);
    return { rawText: "", data: null, error: errorMsg, latencyMs: Date.now() - startTime };
  }
}
