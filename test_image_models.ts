
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyBYf2S5FRXs5pIPrIxOtlPqNIQbykgYcl8";
const ai = new GoogleGenAI({ apiKey });

async function test() {
    const candidates = [
        "gemini-2.0-flash-exp-image-generation",
        "gemini-2.5-flash-image",
        "imagen-4.0-fast-generate-001"
    ];

    for (const modelName of candidates) {
        try {
            console.log(`\nTesting model: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: "Generate a cute cat image",
            });
            console.log(`Success with ${modelName}`);
            // Log part of response to see if it has images
            console.log(JSON.stringify(response, null, 2).substring(0, 200));
            return; // Stop on first success
        } catch (e) {
            console.error(`Error with ${modelName}:`, e.message);
        }
    }
}

test();
