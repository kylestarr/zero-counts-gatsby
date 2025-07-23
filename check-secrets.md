# Mastodon Troubleshooting Guide

Since Bluesky is working but Mastodon isn't, here are the most likely issues:

## 1. Check GitHub Secrets
Go to your repository → Settings → Secrets and variables → Actions

Verify these secrets exist:
- `MASTODON_URL` - Should be like `https://mastodon.social` or your instance URL
- `MASTODON_ACCESS_TOKEN` - Should be a long string starting with letters/numbers

## 2. Check the Debug Artifacts
1. Go to GitHub → Actions → Click the latest run
2. Download the "social-media-debug" artifact  
3. Look at `debug-log.json` for:
   ```json
   {
     "environment": {
       "mastodonUrl": true,    // Should be true
       "mastodonToken": true   // Should be true
     },
     "results": {
       "mastodon": {
         "success": false,
         "reason": "..."       // This will tell us the exact error
       }
     }
   }
   ```

## 3. Common Issues & Solutions

**If `mastodonUrl: false` or `mastodonToken: false`:**
- The GitHub Secrets aren't set properly
- Add them in Repository Settings → Secrets and variables → Actions

**If both are `true` but posting fails:**
- Check the `reason` field in the debug log
- Common errors:
  - `401 Unauthorized`: Invalid access token
  - `403 Forbidden`: Token doesn't have posting permissions  
  - `ENOTFOUND`: Invalid Mastodon URL
  - `Network error`: Connection issues

**If you see authentication errors:**
- Your Mastodon access token may be expired
- Generate a new token in your Mastodon settings → Development → Applications

## 4. Quick Test
You can also test the credentials locally with:
```bash
MASTODON_URL=https://your.instance MASTODON_ACCESS_TOKEN=your_token node -e "
const { login } = require('masto');
login({ url: process.env.MASTODON_URL, accessToken: process.env.MASTODON_ACCESS_TOKEN })
  .then(() => console.log('✅ Credentials work!'))
  .catch(err => console.error('❌ Error:', err.message));
"
```