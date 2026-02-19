
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyBYf2S5FRXs5pIPrIxOtlPqNIQbykgYcl8";
const ai = new GoogleGenAI({ apiKey });

async function test() {
    try {
        console.log("Testing model: gemini-2.5-flash-image");
        const model = "gemini-2.5-flash-image";
        // Test with text first to check model existence
        const response = await ai.models.generateContent({
            model: model,
            contents: "Hello",
        });
        console.log("Success:", response.text);
    } catch (e) {
        console.error("Error with gemini-2.5-flash-image:", e.message);

        try {
            console.log("Testing model: gemini-1.5-flash"); // Fallback check
            const response2 = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: "Hello"
            });
            console.log("Success with 1.5-flash:", response2.text);
        } catch (e2) {
            console.error("Error with 1.5-flash:", e2.message);
        }
    }
}

test();
