
const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
const path = require('path');

// Use the user's valid API KEY
const apiKey = "AIzaSyCLNKIDW1AutzDmUJlVsR9NwjIau5syS-g";
const ai = new GoogleGenAI({ apiKey });

async function runIntegrationTest() {
    console.log("==========================================");
    console.log("     TESTING PRELOOK STUDIO INTEGRATION   ");
    console.log("==========================================");

    try {
        // --- Step 1: Mimic Analysis ---
        console.log("\n[Step 1] Testing Image Analysis (Gemini 2.5 Flash)...");
        // We'll just ask it to describe a hypothetical person to verify model access, 
        // since we don't have a real image base64 handy easily without reading a file.
        // But we can check if the model accepts text-only input for now, or just trust previous list check.
        // Actually, let's try a text-only prompt to the vision model to ensure it responds.

        const analyzeModel = "gemini-2.5-flash";
        console.log(`Sending request to ${analyzeModel}...`);

        const analysisResp = await ai.models.generateContent({
            model: analyzeModel,
            contents: {
                parts: [{ text: "Describe a person with curly hair." }]
            }
        });

        console.log("Analysis Response received!");
        console.log(`Text snippet: ${analysisResp.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 50)}...`);


        // --- Step 2: Mimic Generation ---
        console.log("\n[Step 2] Testing Image Generation (Nano Banana Pro Preview)...");
        const genModel = "nano-banana-pro-preview";
        console.log(`Sending request to ${genModel}...`);

        const prompt = "A photorealistic 8k portrait of a woman with red curly hair. High quality, cinematic lighting.";

        const genResp = await ai.models.generateContent({
            model: genModel,
            contents: {
                parts: [{ text: prompt }]
            }
        });

        console.log("Generation Response received!");
        const parts = genResp.candidates?.[0]?.content?.parts;
        const imagePart = parts?.find(p => p.inlineData);

        if (imagePart) {
            console.log("✅ SUCCESS: Image Data Returned!");
            console.log(`   MimeType: ${imagePart.inlineData.mimeType}`);
            console.log(`   Data Length: ${imagePart.inlineData.data.length}`);
        } else {
            console.log("❌ FAILURE: No Image Data.");
            if (parts?.[0]?.text) console.log(`   Text returned: ${parts[0].text}`);
        }

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message);
    }
}

runIntegrationTest();
