
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1w567IJmIOBuw_O9ASVvs4u5kWlVe5Jxk

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env](.env) to your Gemini API key (ensure no `VITE_` prefix for security on server side).
3. Run the app with Vercel CLI to enable serverless functions locally:
   `npx vercel dev`
   
   Or run standard Vite dev server (API routes will require manual proxy setup or won't work locally):
   `npm run dev`

## Deployment

Deploy to Vercel for seamless API integration:
`npx vercel`
