
const { GoogleGenAI } = require("@google/genai");

// User's key
const apiKey = "AIzaSyCLNKIDW1AutzDmUJlVsR9NwjIau5syS-g";
const ai = new GoogleGenAI({ apiKey });

async function findWorkingModel() {
    console.log("-----------------------------------------");
    console.log("    FINDING A WORKING IMAGE MODEL        ");
    console.log("-----------------------------------------");

    // List of models to try
    const candidates = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-pro-vision",
        "imagen-3.0-generate-001"
    ];

    for (const model of candidates) {
        console.log(`\nTesting ${model}...`);
        try {
            await ai.models.generateContent({
                model: model,
                contents: { parts: [{ text: "Describe this image: [pretend image]" }] }
            });
            console.log(`✅ ${model}: AVAILABLE (at least for text/multimodal)`);
        } catch (e) {
            if (e.message.includes("404")) console.log(`❌ ${model}: Not Found (404)`);
            else if (e.message.includes("429")) console.log(`❌ ${model}: Quota Exceeded (429)`);
            else console.log(`❌ ${model}: Error ${e.status}`);
        }
    }
}

findWorkingModel();
