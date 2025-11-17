// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import type { Chunk } from "../types";

// Read API key
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string;

if (!apiKey || apiKey === "undefined") {
  console.error("❌ Missing VITE_GOOGLE_API_KEY in .env file");
}

const genAI = new GoogleGenAI({ apiKey });

export const getAnswerFromContext = async (
  query: string,
  contextChunks: Chunk[]
): Promise<string> => {
  // Build context for RAG
  const context = contextChunks
    .map(
      (chunk, i) =>
        `[Source ${i + 1} - ${chunk.documentName}]:\n${chunk.content}`
    )
    .join("\n\n---\n\n");

  const prompt = `
You are Zen, an intelligent AI knowledge assistant.

Use ONLY the context from user's documents to answer.
If the answer is not present, say:
"I don't have that information in your documents."

Context:
${context}

User Question:
${query}

Your Answer:
`;

  try {
    // ✅ Correct new syntax — ONLY these fields allowed
    const result = await genAI.models.generateContent({
      model: "models/gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // ✅ Extract generated text properly for v1 SDK:
    const text =
      result?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("") || "";

    return text;
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);

    if (error.status === 404) {
      return "⚠️ Model not found — use model: gemini-1.5-flash";
    }

    if (error.message?.includes("API key")) {
      return "⚠️ API key error — check your .env file.";
    }

    if (error.message?.includes("quota")) {
      return "⚠️ API quota exceeded. Try again later.";
    }

    return "⚠️ Something went wrong. Please try again.";
  }
};
