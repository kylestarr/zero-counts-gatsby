#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Mastodon } = require('masto');
const { BskyAgent } = require('@atproto/api');

// Configuration - you'll need to set these environment variables
const config = {
  siteUrl: process.env.SITE_URL || 'https://zerocounts.com',
  mastodon: {
    url: process.env.MASTODON_URL,
    accessToken: process.env.MASTODON_ACCESS_TOKEN,
  },
  bluesky: {
    identifier: process.env.BLUESKY_IDENTIFIER,
    password: process.env.BLUESKY_PASSWORD,
  }
};

// File to track posted URLs
const POSTED_HISTORY_FILE = path.join(__dirname, 'posted-history.json');

/**
 * Load the history of posted URLs
 */
function loadPostedHistory() {
  try {
    if (fs.existsSync(POSTED_HISTORY_FILE)) {
      const data = fs.readFileSync(POSTED_HISTORY_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('⚠️  Could not load posted history:', error.message);
  }
  return { postedUrls: [], lastPosted: null };
}

/**
 * Save the history of posted URLs
 */
function savePostedHistory(history) {
  try {
    fs.writeFileSync(POSTED_HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.warn('⚠️  Could not save posted history:', error.message);
  }
}

/**
 * Check if a URL has already been posted
 */
function hasBeenPosted(url, history) {
  return history.postedUrls.includes(url);
}

/**
 * Add a URL to the posted history
 */
function addToPostedHistory(url, history) {
  history.postedUrls.push(url);
  history.lastPosted = new Date().toISOString();
  
  // Keep only the last 100 posted URLs to prevent the file from growing too large
  if (history.postedUrls.length > 100) {
    history.postedUrls = history.postedUrls.slice(-100);
  }
  
  savePostedHistory(history);
}

/**
 * Recursively find all markdown files in the posts directory
 */
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

/**
 * Get file creation/modification time
 */
function getFileTime(filePath) {
  const stat = fs.statSync(filePath);
  return stat.mtime.getTime();
}

/**
 * Find the most recently modified markdown file that hasn't been posted yet
 */
function findMostRecentUnpostedPost(postsDir, history) {
  const markdownFiles = findMarkdownFiles(postsDir);
  
  if (markdownFiles.length === 0) {
    throw new Error('No markdown files found in posts directory');
  }
  
  // Sort by modification time (most recent first)
  const sortedFiles = markdownFiles.sort((a, b) => getFileTime(b) - getFileTime(a));
  
  // Find the first file that hasn't been posted yet
  for (const file of sortedFiles) {
    const { url } = extractFrontmatter(file);
    const fullUrl = `${config.siteUrl}${url}`;
    
    if (!hasBeenPosted(fullUrl, history)) {
      return file;
    }
  }
  
  return null; // All recent files have been posted
}

/**
 * Extract frontmatter from markdown file
 */
function extractFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  
  if (!data.title) {
    throw new Error(`No title found in frontmatter for ${filePath}`);
  }
  
  if (!data.url) {
    throw new Error(`No URL found in frontmatter for ${filePath}`);
  }
  
  return {
    title: data.title,
    url: data.url,
    date: data.date
  };
}

/**
 * Post to Mastodon
 */
async function postToMastodon(title, fullUrl) {
  if (!config.mastodon.url || !config.mastodon.accessToken) {
    console.log('Mastodon credentials not configured, skipping...');
    return;
  }
  
  try {
    const masto = new Mastodon({
      url: config.mastodon.url,
      accessToken: config.mastodon.accessToken,
    });
    
    const status = `New post: ${title}\n\n${fullUrl}`;
    
    const response = await masto.statuses.create({
      status,
      visibility: 'public',
    });
    
    console.log('✅ Posted to Mastodon successfully');
    console.log(`   Status ID: ${response.data.id}`);
  } catch (error) {
    console.error('❌ Failed to post to Mastodon:', error.message);
  }
}

/**
 * Post to Bluesky
 */
async function postToBluesky(title, fullUrl) {
  if (!config.bluesky.identifier || !config.bluesky.password) {
    console.log('Bluesky credentials not configured, skipping...');
    return;
  }
  
  try {
    const agent = new BskyAgent({
      service: 'https://bsky.social',
    });
    
    await agent.login({
      identifier: config.bluesky.identifier,
      password: config.bluesky.password,
    });
    
    const text = `New post: ${title}\n\n${fullUrl}`;
    
    const response = await agent.post({
      text,
    });
    
    console.log('✅ Posted to Bluesky successfully');
    console.log(`   Post URI: ${response.uri}`);
  } catch (error) {
    console.error('❌ Failed to post to Bluesky:', error.message);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🔍 Scanning for most recent unposted post...');
    
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    
    if (!fs.existsSync(postsDir)) {
      throw new Error(`Posts directory not found: ${postsDir}`);
    }
    
    // Load posted history
    const history = loadPostedHistory();
    console.log(`📊 Found ${history.postedUrls.length} previously posted URLs`);
    
    // Find the most recent unposted post
    const mostRecentFile = findMostRecentUnpostedPost(postsDir, history);
    
    if (!mostRecentFile) {
      console.log('✅ All recent posts have already been posted to social media!');
      console.log('   No new posts to share.');
      return;
    }
    
    console.log(`📄 Found unposted file: ${path.relative(process.cwd(), mostRecentFile)}`);
    
    // Extract frontmatter
    const { title, url } = extractFrontmatter(mostRecentFile);
    const fullUrl = `${config.siteUrl}${url}`;
    
    console.log(`📝 Title: ${title}`);
    console.log(`🔗 URL: ${fullUrl}`);
    
    // Post to social platforms
    console.log('\n📤 Posting to social platforms...');
    
    await Promise.all([
      postToMastodon(title, fullUrl),
      postToBluesky(title, fullUrl)
    ]);
    
    // Add to posted history
    addToPostedHistory(fullUrl, history);
    console.log(`📝 Added ${fullUrl} to posted history`);
    
    console.log('\n✅ All done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  findMostRecentUnpostedPost,
  extractFrontmatter,
  postToMastodon,
  postToBluesky,
  loadPostedHistory,
  savePostedHistory,
  hasBeenPosted,
  addToPostedHistory
}; 