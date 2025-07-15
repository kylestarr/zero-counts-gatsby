# Deployment Setup Guide

This guide shows you how to automatically trigger the post-latest script after your Netlify deployment completes.

## Option 1: Netlify Webhook (Recommended)

**Why this is better than GitHub Actions:**
- ✅ **Real-time feedback** - Netlify tells us exactly when deployment succeeds
- ✅ **No guessing** - No arbitrary delays or assumptions
- ✅ **More reliable** - Only triggers on actual successful deployments
- ✅ **Faster** - Posts immediately when deployment completes
- ✅ **Better error handling** - Can check deployment status and details

### Setup Steps:

1. **Deploy the webhook function**
   
   The `netlify/functions/post-latest.js` file is already created. When you deploy to Netlify, this function will be available at:
   ```
   https://your-site.netlify.app/.netlify/functions/post-latest
   ```

2. **Set Netlify environment variables**
   
   In your Netlify dashboard → Site settings → Environment variables, add:
   
   ```
   SITE_URL=https://zerocounts.com
   MASTODON_URL=https://your-mastodon-instance.com
   MASTODON_ACCESS_TOKEN=your_access_token_here
   BLUESKY_IDENTIFIER=your_handle.bsky.social
   BLUESKY_PASSWORD=your_app_password_here
   ```

3. **Configure the webhook**
   
   In your Netlify dashboard → Site settings → Webhooks:
   - Click "Add webhook"
   - Event: "Deploy succeeded"
   - URL: `https://your-site.netlify.app/.netlify/functions/post-latest`
   - Click "Save webhook"

### How it works:
- Netlify sends a webhook when deployment succeeds
- The function validates it's a deployment success event
- Checks that all required environment variables are set
- Runs the post-latest script with proper error handling
- Returns detailed success/error response

### Testing the webhook:
You can test the webhook manually by sending a POST request:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/post-latest \
  -H "Content-Type: application/json" \
  -d '{"event_type":"deploy_succeeded","site_name":"your-site","deploy_url":"https://your-site.netlify.app"}'
```

## Option 2: GitHub Actions (Alternative)

**Note:** This approach uses a fixed delay and doesn't actually wait for Netlify deployment confirmation.

### Setup Steps:

1. **Add GitHub Secrets**
   
   Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:
   
   ```
   SITE_URL=https://zerocounts.com
   MASTODON_URL=https://your-mastodon-instance.com
   MASTODON_ACCESS_TOKEN=your_access_token_here
   BLUESKY_IDENTIFIER=your_handle.bsky.social
   BLUESKY_PASSWORD=your_app_password_here
   ```

2. **Push the workflow file**
   
   The `.github/workflows/post-latest.yml` file is already created. Just commit and push it to your repository.

3. **Test the workflow**
   
   - Go to your GitHub repository → Actions tab
   - You should see "Post Latest to Social Media" workflow
   - You can manually trigger it by clicking "Run workflow"

### How it works:
- Triggers on every push to the `main` branch
- Waits 60 seconds (arbitrary delay) for Netlify deployment to complete
- Runs the post-latest script with your environment variables
- Uploads the posted history as an artifact

## Option 3: Manual Trigger (For Testing)

You can also trigger the script manually:

```bash
# Set environment variables
export SITE_URL=https://zerocounts.com
export MASTODON_URL=https://your-mastodon-instance.com
export MASTODON_ACCESS_TOKEN=your_access_token_here
export BLUESKY_IDENTIFIER=your_handle.bsky.social
export BLUESKY_PASSWORD=your_app_password_here

# Run the script
npm run post-latest
```

## Troubleshooting

### Netlify Webhook Issues:
- Check Netlify function logs in the dashboard (Site settings → Functions)
- Ensure environment variables are set correctly
- Test the webhook URL manually with curl
- Check that the webhook is configured for "Deploy succeeded" events only

### GitHub Actions Issues:
- Check the Actions tab in your GitHub repository for logs
- Ensure all secrets are properly set
- The workflow waits 60 seconds - you may need to adjust this
- Consider that this doesn't actually wait for Netlify deployment

### General Issues:
- Run `npm run test-post-latest` to test locally
- Check `scripts/posted-history.json` for posted URLs
- Use `npm run history show` to view posted history

## Security Notes

- Never commit your API tokens to the repository
- Use Netlify environment variables or GitHub Secrets
- The posted history file contains URLs but no sensitive data
- Consider using app-specific passwords for Bluesky

## Customization

You can modify the timing, conditions, or add more platforms by editing:
- `netlify/functions/post-latest.js` for the webhook handler
- `scripts/post-latest.js` for the core functionality
- `.github/workflows/post-latest.yml` for GitHub Actions (if using that approach) 