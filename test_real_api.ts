
import { GoogleGenAI } from "@google/genai";

const apiKey = "AQ.Ab8RN6KYgjnzEhhrNUuiu36JxcE88RogkcxZfk4RlhrSRTZK7Q";
const ai = new GoogleGenAI({ apiKey });

async function test() {
    console.log("Starting test...");
    const candidates = [
        "gemini-2.0-flash-exp",
        "imagen-3.0-generate-001"
    ];

    for (const modelName of candidates) {
        try {
            console.log(`\nTesting model: ${modelName}`);

            // Try standard generation first
            const response = await ai.models.generateContent({
                model: modelName,
                contents: {
                    parts: [
                        { text: "Generate a photorealistic image of a woman with a bob haircut." }
                    ]
                }
            });

            console.log(`Response received from ${modelName}`);
            // Check for image data
            const part = response.candidates?.[0]?.content?.parts?.[0];
            if (part?.inlineData) {
                console.log(`SUCCESS: Image data found in ${modelName}!`);
                console.log(`MimeType: ${part.inlineData.mimeType}`);
                console.log(`Data length: ${part.inlineData.data?.length}`);
            } else if (part?.text) {
                console.log(`Fail: Text only response: ${part.text.substring(0, 50)}...`);
            } else {
                console.log("Fail: No recognized content.");
            }
        } catch (e: any) {
            console.error(`Error with ${modelName}:`, e.message);
        }
    }
}

test();
