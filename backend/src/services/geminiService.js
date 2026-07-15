import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

let genAI = null;

try {
  genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;
} catch (error) {
  console.warn("Gemini client could not be initialized:", error.message);
  genAI = null;
}

/**
 * Generate a concise 1-2 sentence emergency summary using Gemini.
 * Falls back to a deterministic template if no API key is configured,
 * so the app remains usable in local/demo environments.
 */
export async function generateEmergencySummary({ category, location, description }) {
  const prompt = `You are an emergency dispatch assistant. Summarize the following
disaster report in exactly 1-2 concise, factual sentences for a first responder
skimming a live feed. Do not add speculation or advice, only summarize what is known.

Category: ${category}
Location: ${location}
Description: ${description || "No additional description provided."}

Summary:`;

  if (!genAI) {
    return `[Demo mode] ${category} reported at ${location}${
      description ? `: ${description}` : "."
    }`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text;
  } catch (err) {
    console.error("Gemini summary generation failed:", err.message);
    throw new Error("Failed to generate AI summary");
  }
}
