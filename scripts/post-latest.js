#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { login } = require('masto');
const { BskyAgent } = require('@atproto/api');

// Load posted history
function loadPostedHistory() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'posted-history.json'), 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { postedUrls: [], lastPosted: null };
  }
}

// Save posted history
function savePostedHistory(history) {
  fs.writeFileSync(path.join(__dirname, 'posted-history.json'), JSON.stringify(history, null, 2));
}

// Recursively find all markdown files in the posts directory
function findMarkdownFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract frontmatter from markdown file
function extractFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  if (!data.title || !data.date) {
    throw new Error(`Missing title or date in frontmatter for ${filePath}`);
  }
  return {
    title: data.title,
    date: new Date(data.date)
  };
}

// Convert file path to URL path (always use file path, not frontmatter)
function filePathToUrlPath(filePath) {
  console.log(`🔍 Processing file path: ${filePath}`);
  
  // Normalize path separators
  let normalizedPath = filePath.replace(/\\/g, '/');
  console.log(`📝 Normalized path: ${normalizedPath}`);
  
  // Find the content/posts/ part and extract everything after it
  const contentPostsIndex = normalizedPath.indexOf('content/posts/');
  console.log(`📍 content/posts/ index: ${contentPostsIndex}`);
  
  if (contentPostsIndex !== -1) {
    normalizedPath = normalizedPath.substring(contentPostsIndex + 'content/posts/'.length);
    console.log(`✂️ After content/posts/ removal: ${normalizedPath}`);
  } else {
    console.log(`⚠️ content/posts/ not found in path: ${filePath}`);
    return '/ERROR-INVALID-FILE-PATH/';
  }
  
  // Remove .md extension
  const relativePath = normalizedPath.replace(/\.md$/, '');
  console.log(`📄 After .md removal: ${relativePath}`);
  
  // Split by directory separators and filter out empty parts
  const pathParts = relativePath.split('/').filter(part => part.length > 0);
  console.log(`🔢 Path parts: [${pathParts.join(', ')}] (length: ${pathParts.length})`);
  
  // Format as YYYY/MM/DD/slug
  if (pathParts.length >= 4) {
    const year = pathParts[0];
    const month = pathParts[1];
    const day = pathParts[2];
    const slug = pathParts[3];
    
    // Validate that year, month, day look like numbers
    if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(day)) {
      console.log(`⚠️ Invalid date format: ${year}/${month}/${day}`);
      return '/ERROR-INVALID-DATE-FORMAT/';
    }
    
    const urlPath = `/${year}/${month}/${day}/${slug}/`;
    console.log(`✅ Generated URL path: ${urlPath}`);
    return urlPath;
  }
  
  // Fallback: return error URL
  console.log(`⚠️ Insufficient path parts (need at least 4): [${pathParts.join(', ')}]`);
  return '/ERROR-INSUFFICIENT-PATH-PARTS/';
}

// Find the most recent unposted post by date (using file path URL for history check)
function findMostRecentUnpostedPost(postsDir, history) {
  const markdownFiles = findMarkdownFiles(postsDir);
  if (markdownFiles.length === 0) {
    throw new Error('No markdown files found in posts directory');
  }
  let mostRecent = null;
  let mostRecentData = null;
  for (const file of markdownFiles) {
    try {
      const data = extractFrontmatter(file);
      const urlPath = filePathToUrlPath(file);
      // Only consider posts not in posted-history.json (by file path URL)
      if (!history.postedUrls.includes(urlPath)) {
        if (!mostRecent || (data.date > mostRecentData.date)) {
          mostRecent = file;
          mostRecentData = { ...data, urlPath };
        }
      }
    } catch (e) {
      continue;
    }
  }
  if (!mostRecent) {
    return null;
  }
  return { file: mostRecent, ...mostRecentData };
}

// Post to Mastodon
async function postToMastodon(title, fullUrl) {
  console.log('🐘 Attempting Mastodon posting...');
  console.log('🔑 MASTODON_URL configured:', !!process.env.MASTODON_URL);
  console.log('🔑 MASTODON_ACCESS_TOKEN configured:', !!process.env.MASTODON_ACCESS_TOKEN);
  
  if (!process.env.MASTODON_URL || !process.env.MASTODON_ACCESS_TOKEN) {
    console.log('❌ Mastodon credentials not configured, skipping...');
    return { success: false, reason: 'Missing credentials' };
  }
  
  try {
    console.log('🔗 Connecting to Mastodon...');
    const masto = await login({
      url: process.env.MASTODON_URL,
      accessToken: process.env.MASTODON_ACCESS_TOKEN,
    });
    
    const status = `New post: ${title}\n\n${fullUrl}`;
    console.log('📝 Posting status:', status);
    await masto.v1.statuses.create({ status, visibility: 'public' });
    console.log('✅ Posted to Mastodon successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to post to Mastodon:', error.message);
    console.error('❌ Full error:', error);
    return { success: false, reason: error.message };
  }
}

// Post to Bluesky
async function postToBluesky(title, fullUrl) {
  if (!process.env.BLUESKY_IDENTIFIER || !process.env.BLUESKY_PASSWORD) {
    console.log('Bluesky credentials not configured, skipping...');
    return { success: false, reason: 'Missing credentials' };
  }
  try {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({
      identifier: process.env.BLUESKY_IDENTIFIER,
      password: process.env.BLUESKY_PASSWORD,
    });
    const text = `New post: ${title}\n\n${fullUrl}`;
    const response = await agent.post({ text });
    console.log('✅ Posted to Bluesky successfully');
    console.log(`   Post URI: ${response.uri}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to post to Bluesky:', error.message);
    return { success: false, reason: error.message };
  }
}

// Main function
async function main() {
  try {
    console.log('🔍 Scanning for most recent unposted post...');
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const history = loadPostedHistory();
    console.log(`📊 Found ${history.postedUrls.length} previously posted URLs`);
    const mostRecent = findMostRecentUnpostedPost(postsDir, history);
    if (!mostRecent) {
      console.log('✅ All recent posts have already been posted to social media!');
      console.log('   No new posts to share.');
      return;
    }
    const { file, title, date, urlPath } = mostRecent;
    const fullUrl = `https://zerocounts.net${urlPath}`;
    console.log(`📄 Found unposted file: ${file}`);
    console.log(`📝 Title: ${title}`);
    console.log(`📅 Date: ${date}`);
    console.log(`🔗 URL: ${fullUrl}`);
    // Post to social platforms
    console.log('\n📤 Posting to social platforms...');
    await Promise.all([
      postToMastodon(title, fullUrl),
      postToBluesky(title, fullUrl)
    ]);
    // Add to posted history
    history.postedUrls.push(urlPath);
    history.lastPosted = new Date().toISOString();
    savePostedHistory(history);
    console.log(`📝 Added ${urlPath} to posted history`);
    console.log('\n✅ All done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 