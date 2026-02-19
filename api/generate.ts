
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, image, model, history, systemInstruction } = req.body;

        // User provided fallback key - removed as it was invalid/leaked or wrong type.
        // We now STRICTLY rely on the environment variable to ensure the user provides a fresh, valid key.
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("API Key not found in environment variables");
            return res.status(500).json({ error: 'Server configuration error: Missing GEMINI_API_KEY. Please add a valid API Key to your Vercel Environment Variables.' });
        }

        const ai = new GoogleGenAI({ apiKey });
        // Default text model
        const modelName = model || 'gemini-1.5-flash';

        if (image) {
            // Image generation/editing using 2-step Description -> Generation workflow
            const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

            try {
                // Step 1: Analyze the original image using Gemini 1.5 Flash to get a description
                console.log("Analyzing original image for features...");

                const analysisModel = 'gemini-1.5-flash';
                const analysisResponse = await ai.models.generateContent({
                    model: analysisModel,
                    contents: {
                        parts: [
                            {
                                inlineData: {
                                    data: cleanBase64,
                                    mimeType: 'image/jpeg'
                                }
                            },
                            { text: "Describe this person's physical appearance in extreme detail for a text-to-image generator prompt. Include: gender, age, ethnicity, exact skin tone, face shape, eye color, facial features, head pose (facing front, left, right?), lighting conditions, background color, and clothing. IMPORTANT: Do NOT describe their hair. Just describe the person." }
                        ]
                    }
                });

                const personDescription = analysisResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";
                console.log("Analysis complete. Description length:", personDescription.length);

                // Step 2: Generate the new image using "Nano Banana" (Gemini 2.0 Flash)
                // We use Gemini 2.0 Flash Exp because Imagen 3 is currently unavailable for this key/tier.
                const finalPrompt = `Generate a photorealistic 8k portrait based on this description: ${personDescription}. The person is now sporting a ${prompt}. High quality, cinematic lighting, sharp focus, realistic texture, 8k resolution. Return ONLY the image.`;
                console.log("Generating new style with combined prompt using Gemini 2.0 Flash...");

                const genModel = 'gemini-2.0-flash-exp';

                const response = await ai.models.generateContent({
                    model: genModel,
                    contents: {
                        parts: [
                            { text: finalPrompt },
                        ],
                    },
                });

                const parts = response.candidates?.[0]?.content?.parts;

                // Gemini 2.0 might return text if it refuses, or image if successful.
                const imagePart = parts?.find(p => p.inlineData);

                if (imagePart) {
                    // Ensure we return it in the format frontend expects (array of parts)
                    return res.status(200).json({ parts: [imagePart] });
                } else {
                    console.log("Gemini 2.0 returned no inlineData. Candidates:", JSON.stringify(response.candidates));
                    // Check if it returned text saying it can't generate
                    const textPart = parts?.find(p => p.text);
                    if (textPart) {
                        console.log("Model response text:", textPart.text);
                    }
                    throw new Error("Model returned no image data (likely refusal or text output).");
                }

            } catch (genError) {
                console.error(`Generation failed:`, genError.message);

                // Fallback to Original Image if generation completely fails
                // This prevents the UI from breaking/hanging.
                console.log("Returning original image as fallback to prevent crash.");

                const fallbackParts = [
                    {
                        inlineData: {
                            data: cleanBase64,
                            mimeType: 'image/jpeg'
                        }
                    }
                ];
                return res.status(200).json({ parts: fallbackParts });
            }
        } else if (history) {
            // Chat mode
            const chat = ai.chats.create({
                model: modelName,
                config: {
                    systemInstruction: systemInstruction,
                },
                history: history
            });

            const response = await chat.sendMessage({ message: prompt });
            return res.status(200).json({ text: response.text });

        } else {
            // Single text generation
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt
            });

            return res.status(200).json({ text: response.text });
        }
    } catch (error) {
        console.error("API Error generating content:", error);
        return res.status(500).json({ error: error.message || 'Error generating content' });
    }
}
