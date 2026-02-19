
const { GoogleGenAI } = require("@google/genai");

const apiKey = "AIzaSyCLNKIDW1AutzDmUJlVsR9NwjIau5syS-g";
const ai = new GoogleGenAI({ apiKey });

async function testCandidates() {
    // Models to test for IMAGE generation capability
    const candidates = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-3-pro-image-preview",
        "imagen-3.0-generate-001",
        "gemini-2.0-flash-exp" // Retrying just in case
    ];

    console.log("Testing image generation capabilities...");

    for (const model of candidates) {
        console.log(`\nTesting ${model}...`);
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: { parts: [{ text: "Generate a simple image of a red circle." }] }
            });

            // Check if it returned an image
            if (response.candidates && response.candidates.length > 0) {
                const part = response.candidates[0].content?.parts?.[0];
                if (part?.inlineData) {
                    console.log(`✅ ${model}: SUCCESS! Image returned (Mime: ${part.inlineData.mimeType})`);
                } else if (part?.text) {
                    console.log(`⚠️ ${model}: Returned TEXT ("${part.text.substring(0, 30)}...")`);
                } else {
                    console.log(`❌ ${model}: Empty content.`);
                }
            }
        } catch (e) {
            console.log(`❌ ${model}: Failed (${e.message.substring(0, 100)}...)`);
            if (e.message.includes("404")) console.log("   -> Model not found.");
            if (e.message.includes("429")) console.log("   -> Quota exceeded / Not available.");
        }
    }
}

testCandidates();
