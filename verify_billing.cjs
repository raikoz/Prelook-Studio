
const { GoogleGenAI } = require("@google/genai");

// User's key
const apiKey = "AIzaSyCLNKIDW1AutzDmUJlVsR9NwjIau5syS-g";
const ai = new GoogleGenAI({ apiKey });

async function verifyBillingModel() {
    console.log("-----------------------------------------");
    console.log("    VERIFYING BILLING & MODEL ACCESS     ");
    console.log("-----------------------------------------");
    console.log("User Claims: Billing is Enabled.");
    console.log("Goal: Verify 'nano-banana-pro-preview' works properly.");

    try {
        const generationModel = "nano-banana-pro-preview";
        console.log(`\nSending request to: ${generationModel}`);

        const prompt = "A photorealistic 8k portrait of a woman with red curly hair. High quality, cinematic lighting.";

        const response = await ai.models.generateContent({
            model: generationModel,
            contents: {
                parts: [{ text: prompt }]
            }
        });

        console.log("\nResponse Received!");

        // Full candidates logging
        if (response.candidates && response.candidates.length > 0) {
            const part = response.candidates[0].content?.parts?.[0];

            if (part?.inlineData) {
                console.log("✅ SUCCESS: Image Data Returned.");
                console.log(`   MimeType: ${part.inlineData.mimeType}`);
                console.log(`   Data Length: ${part.inlineData.data.length} bytes`);
            } else if (part?.text) {
                console.log("⚠️ WARNING: Text Returned instead of Image.");
                console.log(`   Text: "${part.text.substring(0, 50)}..."`);
            } else {
                console.log("❌ ERROR: Candidate has no inlineData or text.");
                console.log("   Candidate JSON:", JSON.stringify(response.candidates[0], null, 2));
            }
        } else {
            console.log("❌ ERROR: No candidates returned.");
            // Check usage metadata if available
            if (response.usageMetadata) {
                console.log("   Usage Metadata:", JSON.stringify(response.usageMetadata, null, 2));
            }
        }

    } catch (error) {
        console.log("\n❌ EXCEPTION THROWN:");
        console.log(`   Message: ${error.message}`);
        if (error.status) console.log(`   Status: ${error.status}`);
        if (error.errorDetails) console.log(`   Details: ${JSON.stringify(error.errorDetails, null, 2)}`);
    }
}

verifyBillingModel();
