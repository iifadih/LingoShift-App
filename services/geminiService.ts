
import { GoogleGenAI } from "@google/genai";
import { TranslationMode, TranslationResponse, GroundingLink } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const translateText = async (
  text: string,
  targetLanguage: string,
  mode: TranslationMode
): Promise<TranslationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    Target Language: ${targetLanguage}
    Translation Mode: ${mode}
    Text to translate:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
      },
    });

    const output = response.text || "";
    const [translatedPart, notesPart] = output.split("---");

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingLinks: GroundingLink[] = [];

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingLinks.push({
            uri: chunk.web.uri,
            title: chunk.web.title || "Reference Source"
          });
        }
      });
    }

    return {
      translatedText: translatedPart.trim(),
      notes: notesPart?.trim(),
      groundingLinks: groundingLinks.length > 0 ? groundingLinks : undefined
    };
  } catch (error) {
    console.error("Translation Error:", error);
    throw new Error("Failed to translate text. Please try again.");
  }
};
