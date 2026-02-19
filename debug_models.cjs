
const { GoogleGenAI } = require("@google/genai");

const apiKey = "AIzaSyCLNKIDW1AutzDmUJlVsR9NwjIau5syS-g";
const ai = new GoogleGenAI({ apiKey });

async function debugModels() {
    console.log("----------------------------------------------------------------");
    console.log("DEBUGGING MODEL ACCESS");
    console.log("----------------------------------------------------------------");

    // 1. Test Analysis (Gemini 2.5)
    console.log("\n[1] Testing Analysis with 'gemini-2.5-flash'...");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: "Hello, who are you?" }] }
        });
        console.log("✅ Analysis Model Works!");
    } catch (e) {
        console.error("❌ Analysis Model Failed:", e.message);
        console.error("   Full Error:", JSON.stringify(e, null, 2));
    }

    // 2. Test Generation (Nano Banana)
    console.log("\n[2] Testing Generation with 'nano-banana-pro-preview'...");
    try {
        const response = await ai.models.generateContent({
            model: 'nano-banana-pro-preview',
            contents: { parts: [{ text: "A banana with sunglasses" }] }
        });

        console.log("✅ Generation Request Sent. Checking response...");

        if (response.candidates && response.candidates.length > 0) {
            const part = response.candidates[0].content?.parts?.[0];
            if (part?.inlineData) {
                console.log("🎉 SUCCESS: Image Returned!");
                console.log("Mime:", part.inlineData.mimeType);
            } else if (part?.text) {
                console.log("⚠️ WARNING: Text Returned instead of Image:", part.text);
            } else {
                console.log("❌ ERROR: Empty Content Returned.");
                console.log("Response:", JSON.stringify(response, null, 2));
            }
        } else {
            console.log("❌ ERROR: No Candidates.");
            console.log("Response:", JSON.stringify(response, null, 2));
        }

    } catch (e) {
        console.error("❌ Generation Model Failed:", e.message);
        console.error("   Full Error:", JSON.stringify(e, null, 2));
    }
}

debugModels();
