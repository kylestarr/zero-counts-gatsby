# Post Latest Script

This script automatically finds the most recently modified markdown file in the `/content/posts/` directory and posts updates to Mastodon and Bluesky.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Your site URL
SITE_URL=https://zerocounts.com

# Mastodon Configuration
MASTODON_URL=https://your-mastodon-instance.com
MASTODON_ACCESS_TOKEN=your_access_token_here

# Bluesky Configuration
BLUESKY_IDENTIFIER=your_handle.bsky.social
BLUESKY_PASSWORD=your_app_password_here
```

### 3. Getting API Credentials

#### Mastodon
1. Go to your Mastodon instance
2. Navigate to Settings > Development > New Application
3. Create a new application with appropriate permissions
4. Copy the access token

#### Bluesky
1. Go to https://bsky.app
2. Create an App Password in your account settings
3. Use your handle (e.g., `username.bsky.social`) and the app password

## Usage

### Run the script manually:
```bash
npm run post-latest
```

### Or run directly:
```bash
node scripts/post-latest.js
```

### Test the script (without posting):
```bash
npm run test-post-latest
```

### Manage posted history:
```bash
# View posted history
npm run history show

# Clear all posted history
npm run history clear

# Add a URL to history manually
npm run history add "https://zerocounts.com/my-post/"
```

### Automatic deployment trigger:
The script is designed to be triggered automatically after Netlify deployments. See `DEPLOYMENT_SETUP.md` for configuration details.

## How it works

1. **Scans Posts Directory**: Recursively finds all `.md` files in `/content/posts/`
2. **Checks Posted History**: Loads a JSON file that tracks previously posted URLs
3. **Finds Most Recent Unposted**: Sorts files by modification time and selects the most recent that hasn't been posted yet
4. **Extracts Frontmatter**: Parses the markdown file to extract `title` and `url` from frontmatter
5. **Posts to Social**: Creates posts on both Mastodon and Bluesky with the title and full URL
6. **Updates History**: Adds the posted URL to the history file to prevent re-posting

## Post Format

The script creates posts in this format:
```
New post: [Post Title]

https://zerocounts.com/[post-url]
```

## Error Handling

- If credentials are not configured for a platform, the script will skip that platform
- If no markdown files are found, the script will exit with an error
- If frontmatter is missing required fields (title, url), the script will exit with an error
- If all recent posts have already been posted, the script will exit gracefully

## Duplicate Prevention

The script automatically prevents duplicate posts by:
- Maintaining a `posted-history.json` file in the `scripts/` directory
- Tracking up to 100 previously posted URLs
- Skipping posts that have already been shared
- Allowing manual management of the history file

**Note**: If you edit a post after it's been posted, the script will NOT re-post it since the URL remains the same.

## Requirements

Your markdown files must have frontmatter with:
- `title`: The post title
- `url`: The post URL path (e.g., `/my-post-url/`)

Example:
```yaml
---
title: "My Post Title"
date: 2025-01-01T12:00:00-08:00
url: /my-post-url/
---
``` 