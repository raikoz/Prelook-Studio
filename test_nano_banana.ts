
import { GoogleGenAI } from "@google/genai";

const apiKey = "AQ.Ab8RN6KYgjnzEhhrNUuiu36JxcE88RogkcxZfk4RlhrSRTZK7Q";
const ai = new GoogleGenAI({ apiKey });

async function test() {
    console.log("Starting Nano Banana Model Test...");

    // List of potential "Nano Banana" candidates users refer to
    const models = [
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "imagen-3.0-generate-001"
    ];

    for (const model of models) {
        console.log(`\n--- Testing ${model} ---`);
        try {
            // Test 1: Simple Generation
            const result = await ai.models.generateContent({
                model: model,
                contents: {
                    parts: [{ text: "Generate a cute cartoon banana image. Return ONLY the image." }]
                }
            });

            console.log(`[${model}] Success!`);
            const candidates = result.candidates;
            if (candidates && candidates.length > 0) {
                const parts = candidates[0].content.parts;
                const imagePart = parts.find(p => p.inlineData);
                const textPart = parts.find(p => p.text);

                if (imagePart) {
                    console.log(`[${model}] returned IMAGE data! (Mime: ${imagePart.inlineData.mimeType})`);
                }
                if (textPart) {
                    console.log(`[${model}] returned TEXT: ${textPart.text.substring(0, 50)}...`);
                }
            }
        } catch (e: any) {
            console.error(`[${model}] Failed: ${e.message}`);
        }
    }
}

test();
