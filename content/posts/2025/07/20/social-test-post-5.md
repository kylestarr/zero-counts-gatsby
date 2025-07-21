---
title: "Test Social Posting 5"
date: 2025-07-20T21:00:00-08:00
url: /social-post-test-5/
categories:
tags:
---

I'm testing automatic social posting to Mastodon and Bluesky in production. I'll delete this post in a bit. You might even see a few more of these if this fails. If you're an avid reader of Zero Counts, I'm sorry. Also, thank you. If you have my number, shoot me a text and say hi. Or hit me up on Mastodon or Bluesky. It can be lonely out there. I love when folks say hi. I'll say hello back.

---

## 1. **Why an Old Post Is Being Selected**

- The script is picking `content/posts/2025/02/25/nyt-metroidvanias-the-video-games-you-can-get-lost-in.md` as the “most recent unposted post.”
- This means:
  - All newer posts (by date) are already in `posted-history.json`.
  - This post is the next most recent by date that is **not** in the history file.

**If you want only truly new posts to be posted, you need to keep `posted-history.json` up to date with all previously published posts.**  
If you add a new post, make sure its date is the most recent, and that all older posts’ URLs are in the history file.

---

## 2. **URL Construction**

- The constructed URL is:  
  `***/nyt-metroidvanias-the-video-games-you-can-get-lost-in/`
- This is **missing the full path** (`/2025/02/25/nyt-metroidvanias-the-video-games-you-can-get-lost-in/`).

**This means the URL construction logic in your script is not including the year/month/day directories.**  
It’s likely using the `url` field from frontmatter or not using the file path correctly.

---

## 3. **Mastodon Error**

- `❌ Failed to post to Mastodon: Mastodon is not a constructor`
- This is a code bug: you are using the `masto` package incorrectly.  
  The correct usage is to use `masto.login()` (not `new Mastodon()`).

---

## **How to Fix**

### **A. Fix URL Construction**

Update your script to always construct the URL from the file path, not the frontmatter `url` field.  
It should look like:  
`/2025/02/25/nyt-metroidvanias-the-video-games-you-can-get-lost-in/`

**If you want, I can provide a code snippet to fix this.**

---

### **B. Fix Mastodon Posting**

Update your Mastodon posting logic to use the correct `masto` package usage.  
Example:
```js
const { login } = require('masto');

const masto = await login({
  url: process.env.MASTODON_URL,
  accessToken: process.env.MASTODON_ACCESS_TOKEN,
});
await masto.v1.statuses.create({ status, visibility: 'public' });
```
**Do not use `new Mastodon()`!**

---

### **C. Keep posted-history.json Up to Date**

- Make sure all old post URLs (in `/YYYY/MM/DD/slug/` format) are in the file.
- Only new posts (with new dates and not in the history) will be posted.

---

## **Summary Table**

| Issue                | Solution                                                                 |
|----------------------|--------------------------------------------------------------------------|
| Old post selected    | Add all old post URLs to `posted-history.json`                           |
| URL missing path     | Always construct URL from file path, not frontmatter                     |
| Mastodon error       | Use `masto.login()` instead of `new Mastodon()`                          |

---

## **Next Steps**

- Would you like me to provide the exact code changes for the URL construction and Mastodon fix?
- If so, let me know if you want the fix for the Netlify function, the local script, or both!

Let me know and I’ll provide the code update!