
const fs = require('fs');
const https = require('https');

const prompt = "A photorealistic 8k portrait of a woman with red curly hair";
const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true`;

console.log("Testing Pollinations AI fallback...");

https.get(url, (res) => {
    console.log('StatusCode:', res.statusCode);
    if (res.statusCode === 200) {
        console.log("✅ Success! Pollinations is reachable and returning images.");
    } else {
        console.log("❌ Failed to reach Pollinations.");
    }
}).on('error', (e) => {
    console.error("❌ Error:", e.message);
});
