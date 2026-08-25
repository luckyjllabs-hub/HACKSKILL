import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Candidate Gemini Model identifiers in order of priority
 */
export const GEMINI_CANDIDATE_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
];

export const GEMINI_MODEL = GEMINI_CANDIDATE_MODELS[0];

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
 * Safe helper to execute structured Gemini prompts with multi-model fallback and strict timeout
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

  let lastError: string = "Unknown Gemini API error";

  // Try candidate models sequentially
  for (const modelName of GEMINI_CANDIDATE_MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
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
      lastError = err instanceof Error ? err.message : "Model invocation error";
      // If 404 or unsupported on this model, continue to try next candidate model
      if (lastError.includes("404") || lastError.includes("not found") || lastError.includes("not supported")) {
        continue;
      }
      break;
    }
  }

  console.warn("[Gemini AI Service]:", lastError);
  return { rawText: "", data: null, error: lastError, latencyMs: Date.now() - startTime };
}
