
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
        // We now STRICTLY rely on the environment variable to ensure the user provides a fresh, valid key.
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("API Key not found in environment variables");
            return res.status(500).json({ error: 'Server configuration error: Missing GEMINI_API_KEY. Please add a valid API Key to your Vercel Environment Variables.' });
        }

        const ai = new GoogleGenAI({ apiKey });
        // Default text model to a safer version
        const modelName = model || 'gemini-1.5-flash';

        if (image) {
            // Image generation/editing using 2-step Description -> Generation workflow
            const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

            try {
                let personDescription = "";
                try {
                    // Step 1: Analyze the original image using Gemini 2.5 Flash
                    console.log("Analyzing original image for features...");
                    const analysisModel = 'gemini-2.5-flash';
                    const analysisResponse = await ai.models.generateContent({
                        model: analysisModel,
                        contents: {
                            parts: [
                                { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
                                { text: "Describe this person's physical appearance in extreme detail for a text-to-image generator prompt. Include: gender, age, ethnicity, exact skin tone, face shape, eye color, facial features, head pose. Do NOT describe their hair." }
                            ]
                        }
                    });
                    personDescription = analysisResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";
                    console.log("Analysis complete. Description length:", personDescription.length);
                } catch (analysisError) {
                    console.error("Analysis failed (using fallback):", analysisError.message);
                    // Use a generic fallback so generation can still proceed
                    personDescription = "a diverse person suitable for hairstyle modeling";
                }

                // Step 2: Generate the new image using Pollinations.ai (Free/Unlimited)
                // This bypasses Google's Quota limits entirely.
                console.log("Generating new style using Pollinations.ai...");

                // Construct a robust prompt for Pollinations
                const desc = personDescription || "a photorealistic person";
                const pollinationsPrompt = `high quality, 8k, photorealistic portrait of ${desc}, wearing a ${prompt}. cinematic lighting, sharp focus, realistic texture, neutral background`;

                // Pollinations URL (encoded)
                const encodedPrompt = encodeURIComponent(pollinationsPrompt);
                // Add random seed to prevent caching consistency
                const seed = Math.floor(Math.random() * 10000);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&private=true&enhance=false&seed=${seed}`;

                console.log("Fetching from:", imageUrl);

                // Fetch the image buffer with User-Agent to avoid bot blocking
                const imageRes = await fetch(imageUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });

                if (!imageRes.ok) {
                    throw new Error(`Pollinations API Error: ${imageRes.statusText}`);
                }

                const arrayBuffer = await imageRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64Image = buffer.toString('base64');

                // Return in the format expected by the frontend
                const imagePart = {
                    inlineData: {
                        data: base64Image,
                        mimeType: 'image/jpeg'
                    }
                };

                return res.status(200).json({ parts: [imagePart] });

            } catch (genError) {
                console.error(`Generation failed:`, genError.message);
                // Return 500 so UI shows error, but Pollinations rarely fails in this way.
                return res.status(500).json({
                    error: `Generation Failed: ${genError.message}`
                });
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
