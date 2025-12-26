# 🚀 Netlify Deployment Guide: Association Voting Pro

Follow these steps to host your app on Netlify. These instructions ensure your **Gemini AI Analysis** works correctly by securely injecting your API Key.

## Step 1: Upload to GitHub
1. Create a new repository on [GitHub](https://github.com).
2. Upload all files, including the new `netlify.toml` and `_redirects`.

## Step 2: Connect to Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** > **Import from an existing project**.
3. Select **GitHub** and pick your `association-voting` repository.

## Step 3: Configure Build Settings
Netlify will automatically detect the `netlify.toml` file, but double-check these settings in the UI:
- **Build Command**: `sed -i "s|process.env.API_KEY|'$API_KEY'|g" services/geminiService.ts`
- **Publish directory**: `.`

*Note: This command "swaps" the code text for your actual key only during deployment, keeping your key safe.*

## Step 4: Add Your API Key (The Secret)
1. In Netlify, go to **Site configuration** > **Environment variables**.
2. Click **Add a variable** > **Create a single variable**.
3. **Key**: `API_KEY`
4. **Value**: Paste your Google Gemini API Key here.
5. Click **Save**.

## Step 5: Deploy
1. Go to the **Deploys** tab.
2. Click **Trigger deploy** > **Clear cache and deploy site**.
3. Once finished, click the generated link to see your live app!

---

### 🛡️ Security Note
Because this app is purely client-side, the API key will be visible in the "Network" tab of the browser to very tech-savvy users. For a production-grade app, you would eventually want to move the Gemini call to a **Netlify Function** (Serverless), but this setup is perfect for sharing with friends and demonstration purposes.