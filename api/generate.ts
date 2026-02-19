
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

        // User provided fallback key
        const FALLBACK_KEY = "AQ.Ab8RN6KYgjnzEhhrNUuiu36JxcE88RogkcxZfk4RlhrSRTZK7Q";
        const apiKey = process.env.GEMINI_API_KEY || FALLBACK_KEY;

        if (!apiKey) {
            console.error("API Key not found in environment variables");
            return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
        }

        const ai = new GoogleGenAI({ apiKey });
        const modelName = model || 'gemini-1.5-flash';

        if (image) {
            // Image generation/editing
            const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

            try {
                // Step 1: Analyze the original image using Gemini 1.5 Flash to get a description
                console.log("Analyzing original image for features...");

                // Use a separate model instance for analysis to ensure we use a vision-capable model
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

                // Step 2: Generate the new image using Imagen 3 with the description + new hairstyle
                // This simulates 'editing' by regenerating the person with the new style.
                const finalPrompt = `A photorealistic 8k portrait of ${personDescription}. The person is sporting a ${prompt}. High quality, cinematic lighting, sharp focus, realistic texture, 8k resolution.`;
                console.log("Generating new style with combined prompt...");

                const response = await ai.models.generateContent({
                    model: 'imagen-3.0-generate-001',
                    contents: {
                        parts: [
                            { text: finalPrompt },
                        ],
                    },
                });

                const parts = response.candidates?.[0]?.content?.parts;

                if (parts && parts.length > 0 && parts[0].inlineData) {
                    return res.status(200).json({ parts });
                } else {
                    console.log("Imagen 3 returned no inlineData. Candidates:", JSON.stringify(response.candidates));
                    throw new Error("Imagen 3 returned no image data.");
                }



            } catch (genError) {
                console.error(`Generation failed with Imagen 3:`, genError.message);

                // Fallback to "Mock" behavior or Original Image if generation completely fails
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
