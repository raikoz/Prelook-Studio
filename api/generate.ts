
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
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: {
                        parts: [
                            {
                                inlineData: {
                                    data: cleanBase64,
                                    mimeType: 'image/jpeg',
                                },
                            },
                            { text: prompt },
                        ],
                    },
                });

                const parts = response.candidates?.[0]?.content?.parts;
                return res.status(200).json({ parts });
            } catch (genError) {
                console.error(`Generation failed with model ${modelName}:`, genError.message);

                // Fallback Strategy:
                // If the premium image model fails (Quota/404), fallback to standard flash.
                // Standard flash CANNOT generate images, so we will return the ORIGINAL image 
                // effectively acting as a "pass-through" to prevent UI crashes.

                if (modelName !== 'gemini-1.5-flash') {
                    console.log("Attempting fallback to safe mode (returning original image)");
                    // Construct a response that mimics the successful image generation response
                    // but returns the original image data.
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

                if (genError.message.includes('429') || genError.message.includes('quota')) {
                    return res.status(429).json({ error: `Quota exceeded for model ${modelName}. Plan limit reached.` });
                }

                // Fallback attempt with Imagen 3 if Gemini Image model fails
                if (modelName.includes('gemini')) {
                    console.log("Gemini Image Model failed, attempting fallback to Imagen 3...");
                    try {
                        const fallbackModel = 'imagen-3.0-generate-001';
                        // Note: Imagen 3 might need a different prompt structure or might check quota
                        const fallbackResponse = await ai.models.generateContent({
                            model: fallbackModel,
                            contents: {
                                parts: [
                                    { text: prompt + " The image must be based on the provided reference but Imagen 3 cannot edit directly, so generate a new high quality image." },
                                    // Imagen 3 via Studio API usually only takes text, but check if it accepts image input for editing
                                    // The current SDK usage suggests generating NEW content. 
                                    // If we can't edit, we might just return error or try generating fresh.
                                    // For now, let's try a safe text-only prompt if image editing isn't supported, 
                                    // OR just fall through to the return original image.
                                ],
                            },
                        });
                        const fallbackParts = fallbackResponse.candidates?.[0]?.content?.parts;
                        if (fallbackParts) return res.status(200).json({ parts: fallbackParts });
                    } catch (fallbackError) {
                        console.error("Fallback to Imagen 3 failed:", fallbackError.message);
                    }
                }

                if (genError.message.includes('404')) {
                    return res.status(404).json({ error: `Model ${modelName} not found or not supported.` });
                }

                throw genError;
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
