# Vercel Environment Setup Guide

Your app requires the `GEMINI_API_KEY` environment variable to work on Vercel.

## 1. Get your API Key
You can get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## 2. Set Environment Variable in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your project (**Prelook-Studio**).
3. Go to **Settings** > **Environment Variables**.
4. Add a new variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `Your_Google_AI_Studio_Key_Here` (Start with `AIza...`)
5. Click **Save**.

## 3. Redeploy
For the changes to take effect, you must **Redeploy** your application:
1. Go to the **Deployments** tab.
2. Click the three dots (⋮) next to the latest deployment.
3. Select **Redeploy**.

## Note on "Nano Banana" (Gemini 2.5 Flash)
The model name standardly used is `gemini-1.5-flash` or `gemini-2.0-flash-exp`.
If `gemini-2.5-flash-image` (Nano Banana) is not working even after setting the API key, try changing the model name in `services/geminiService.ts` to:
- `gemini-2.0-flash-exp` (Latest experimental)
- `gemini-1.5-flash` (Stable, text-only generation but supports image input)
- `imagen-3.0-generate-001` (For image generation, if supported by your key)
