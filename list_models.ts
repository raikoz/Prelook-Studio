
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyBYf2S5FRXs5pIPrIxOtlPqNIQbykgYcl8";
const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        const models = await ai.models.list();
        console.log("Available Models:");
        for await (const model of models) {
            console.log(`- ${model.name} (${model.displayName})`);
            console.log(`  Supported methods: ${model.supportedGenerationMethods}`);
        }
    } catch (e) {
        console.error("Error listing models:", e.message);
    }
}

listModels();
