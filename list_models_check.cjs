
const { GoogleGenAI } = require("@google/genai");

const apiKey = "AIzaSyCLNKIDW1AutzDmUJlVsR9NwjIau5syS-g";
const ai = new GoogleGenAI({ apiKey });

async function list() {
    console.log("Listing models...");
    try {
        const response = await ai.models.list();
        // Note: The SDK might return an async iterator or array depending on version.
        // Let's try to iterate or JSON stringify.

        console.log("Models found:");
        for await (const model of response) {
            console.log(`- ${model.name} (${model.version}) [Supported generation methods: ${model.supportedGenerationMethods}]`);
        }

    } catch (e) {
        console.error("List failed:", e.message);
        // Fallback to checking basic permissions
        if (e.message.includes("403")) console.log("Key might be invalid or permission denied.");
    }
}

list();
