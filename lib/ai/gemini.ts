import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini SDK client server-side only
const apiKey = process.env.GEMINI_API_KEY || "";

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Selected Gemini Model identifier
 */
export const GEMINI_MODEL = "gemini-1.5-flash";

/**
 * Returns whether Gemini is configured with a valid API key
 */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}

/**
 * Safe helper to execute structured Gemini prompts with timeout and error fallback
 */
export async function callGeminiStructured<T>(
  systemInstruction: string,
  userPrompt: string,
  timeoutMs: number = 8000
): Promise<{ rawText: string; data: T | null; error: string | null }> {
  if (!genAI || !isGeminiConfigured()) {
    return {
      rawText: "",
      data: null,
      error: "GEMINI_API_KEY is not configured.",
    };
  }

  try {
    const model = genAI.getGenerativeModel({
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
        // Try extracting json block if enclosed in markdown
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]) as T;
        }
      }
      return { rawText: text, data: parsed, error: null };
    })();

    return await Promise.race([apiPromise, timeoutPromise]);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown Gemini API error";
    console.warn("[Gemini AI Service Error]:", errorMsg);
    return { rawText: "", data: null, error: errorMsg };
  }
}
