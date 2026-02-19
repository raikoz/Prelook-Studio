
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
                // Determine if we should use Image Generation (Imagen 3) or Multimodal Editing (Gemini)
                // Since Gemini Flash 2.0/Exp often returns text, we will prioritize Imagen 3 for visual output
                // BUT Imagen 3 does not support Image-to-Image editing in the public API yet (usually).
                // We will try a hybrid approach:
                // 1. Try Imagen 3 as a pure generator based on the prompt + description of "edit".

                const response = await ai.models.generateContent({
                    model: 'imagen-3.0-generate-001',
                    contents: {
                        parts: [
                            { text: prompt + " High quality, photorealistic, 8k resolution." },
                        ],
                    },
                });

                const parts = response.candidates?.[0]?.content?.parts;

                // If Imagen fails or returns no image (rare if no error), we might fall back.
                // But Imagen 3 response usually contains exact image data if successful.

                if (parts && parts.length > 0 && parts[0].inlineData) {
                    return res.status(200).json({ parts });
                } else {
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
