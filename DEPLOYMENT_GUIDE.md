# 🚀 Netlify Deployment Guide: Association Voting Pro

Follow these steps to deploy your voting system with functional Gemini AI analysis.

## Step 1: Push to GitHub
Upload all project files to a new repository on GitHub. Ensure `netlify.toml` is in the root directory.

## Step 2: Connect to Netlify
1. Go to [Netlify](https://app.netlify.com/).
2. Select **Add new site** > **Import from an existing project**.
3. Choose your GitHub repository.

## Step 3: Set the API Key (Crucial)
1. In your Netlify site dashboard, navigate to **Site configuration** > **Environment variables**.
2. Click **Add a variable** > **Create a single variable**.
3. Set the Key to `API_KEY`.
4. Set the Value to your actual Google Gemini API Key.
5. Click **Save**.

## Step 4: Deploy
1. Go to the **Deploys** tab and trigger a new deploy (Clear cache and deploy site).
2. The `netlify.toml` will automatically inject your `API_KEY` into the code during the build process.

## Step 5: Test
Open your live site, go to the **Monitor Live** tab, and click **Analyze Trends**. The AI should now generate a report using your secure environment variable.
