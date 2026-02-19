
const { GoogleGenAI } = require("@google/genai");

// The key provided by the user
const apiKey = "AIzaSyCLNKIDW1AutzDmUJlVsR9NwjIau5syS-g";
const ai = new GoogleGenAI({ apiKey });

async function verifyModels() {
    console.log("---------------------------------------------------");
    console.log("VERIFYING API KEY & MODELS for 'Nano Banana' logic");
    console.log("Key being tested ends with: ..." + apiKey.slice(-6));
    // Wait for quota to reset
    console.log("Waiting 20 seconds for quota reset...");
    await new Promise(resolve => setTimeout(resolve, 20000));

    const modelsToTest = [
        "nano-banana-pro-preview",
        "gemini-2.5-flash",
    ];

    for (const model of modelsToTest) {
        console.log(`\nTesting Model: ${model}`);
        try {
            // Attempt to generate an image
            // Note: For Gemini models, we ask for image generation via text prompt
            // For Imagen, it's native.

            console.log(`Sending request to ${model}...`);
            const response = await ai.models.generateContent({
                model: model,
                contents: {
                    parts: [
                        { text: "Generate a photorealistic image of a futuristic banana. High quality." }
                    ]
                }
            });

            console.log(`Response received from ${model}. Processing...`);

            const candidates = response.candidates;
            if (!candidates || candidates.length === 0) {
                console.log(`[${model}] NO CANDIDATES returned.`);
                continue;
            }

            const parts = candidates[0].content.parts;
            const imagePart = parts.find(p => p.inlineData);
            const textPart = parts.find(p => p.text);

            if (imagePart) {
                console.log(`✅ [${model}] SUCCESS! Returned an IMAGE (Mime: ${imagePart.inlineData.mimeType}).`);
                console.log(`   This model CAN be used for image generation.`);
            } else if (textPart) {
                console.log(`⚠️ [${model}] Returned TEXT instead of Image.`);
                console.log(`   Text snippet: "${textPart.text.substring(0, 100)}..."`);
                console.log(`   This model might be text-only or require specific config.`);
            } else {
                console.log(`❓ [${model}] Returned unknown content.`);
            }

        } catch (error) {
            console.error(`❌ [${model}] FAILED.`);
            console.error(`   Error Message: ${error.message}`);
            // Check for common errors
            if (error.message.includes("404")) console.log("   -> Model not found or not available.");
            if (error.message.includes("403")) console.log("   -> API Key permission denied or location restricted.");
            if (error.message.includes("429")) console.log("   -> Quota exceeded.");
        }
    }
}

verifyModels();
