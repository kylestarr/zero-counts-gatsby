#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
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

// Post to Mastodon using direct REST API
async function postToMastodon(title, fullUrl) {
  console.log('🐘 Attempting Mastodon posting...');
  console.log('🔑 MASTODON_URL configured:', !!process.env.MASTODON_URL);
  console.log('🔑 MASTODON_ACCESS_TOKEN configured:', !!process.env.MASTODON_ACCESS_TOKEN);
  
  // Debug: show partial values (first 10 chars) to verify they're actually set
  if (process.env.MASTODON_URL) {
    console.log('🔑 MASTODON_URL starts with:', process.env.MASTODON_URL.substring(0, 20) + '...');
  }
  if (process.env.MASTODON_ACCESS_TOKEN) {
    console.log('🔑 MASTODON_ACCESS_TOKEN starts with:', process.env.MASTODON_ACCESS_TOKEN.substring(0, 10) + '...');
  }
  
  if (!process.env.MASTODON_URL || !process.env.MASTODON_ACCESS_TOKEN) {
    console.log('❌ Mastodon credentials not configured, skipping...');
    return { success: false, reason: 'Missing credentials' };
  }
  
  try {
    console.log('🌐 Using direct REST API instead of masto package...');
    const https = require('https');
    const { URL } = require('url');
    
    const mastodonUrl = process.env.MASTODON_URL.endsWith('/') 
      ? process.env.MASTODON_URL.slice(0, -1) 
      : process.env.MASTODON_URL;
    
    const apiUrl = `${mastodonUrl}/api/v1/statuses`;
    console.log('📡 API URL:', apiUrl);
    
    const status = `${title}\n\n${fullUrl}`;
    const postData = JSON.stringify({
      status: status,
      visibility: 'public'
    });
    
    console.log('📝 Posting status:', status);
    console.log('📝 Status length:', status.length, 'characters');
    
    const parsedUrl = new URL(apiUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MASTODON_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    console.log('🔗 Making request to:', parsedUrl.hostname + parsedUrl.pathname);
    
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            data: data
          });
        });
      });
      
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
    
    console.log('📡 Response status:', response.statusCode, response.statusMessage);
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      const result = JSON.parse(response.data);
      console.log('✅ Posted to Mastodon successfully');
      console.log('📊 Post result:', {
        id: result.id,
        url: result.url,
        created_at: result.created_at
      });
      return { success: true };
    } else {
      console.error('❌ Mastodon API error:', response.statusCode, response.statusMessage);
      console.error('❌ Response body:', response.data);
      
      // Provide specific guidance based on status code
      if (response.statusCode === 401) {
        console.error('🔑 AUTHENTICATION ERROR: Your Mastodon access token is invalid or expired');
      } else if (response.statusCode === 403) {
        console.error('🚫 PERMISSION ERROR: Your token doesn\'t have posting permissions');
      } else if (response.statusCode === 422) {
        console.error('📝 CONTENT ERROR: The post content was rejected');
      }
      
      return { success: false, reason: `HTTP ${response.statusCode}: ${response.statusMessage}` };
    }
    
  } catch (error) {
    console.error('❌ Failed to post to Mastodon:', error.message);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error code:', error.code);
    
    if (error.code === 'ENOTFOUND') {
      console.error('🌐 URL ERROR: Cannot find the Mastodon server');
      console.error('   → Check MASTODON_URL is correct (e.g., https://mastodon.social)');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 CONNECTION ERROR: Server refused connection');
      console.error('   → Server may be down or URL incorrect');
    }
    
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
    
    // Create text with proper link embedding
    const text = `${title}\n\n${fullUrl}`;
    
    // Calculate byte positions for the URL (needed for facets)
    const textEncoder = new TextEncoder();
    const textBytes = textEncoder.encode(text);
    const urlStart = textEncoder.encode(`${title}\n\n`).length;
    const urlEnd = textBytes.length;
    
    // Create the post with embedded link facet
    const postData = {
      text: text,
      facets: [
        {
          index: {
            byteStart: urlStart,
            byteEnd: urlEnd
          },
          features: [
            {
              $type: 'app.bsky.richtext.facet#link',
              uri: fullUrl
            }
          ]
        }
      ]
    };
    
    console.log('📝 Posting to Bluesky with embedded link...');
    console.log('   Text:', text);
    console.log('   Link facet:', { start: urlStart, end: urlEnd, uri: fullUrl });
    
    const response = await agent.post(postData);
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
  // Create initial debug file in case of early failures
  const initialDebug = {
    timestamp: new Date().toISOString(),
    phase: 'startup',
    environment: {
      mastodonUrl: !!process.env.MASTODON_URL,
      mastodonToken: !!process.env.MASTODON_ACCESS_TOKEN,
      blueskyId: !!process.env.BLUESKY_IDENTIFIER,
      blueskyPass: !!process.env.BLUESKY_PASSWORD
    }
  };
  require('fs').writeFileSync('debug-log.json', JSON.stringify(initialDebug, null, 2));
  
  try {
    console.log('🚀 Starting social media posting script...');
    console.log('🌍 Environment check:');
    console.log('   - MASTODON_URL:', !!process.env.MASTODON_URL);
    console.log('   - MASTODON_ACCESS_TOKEN:', !!process.env.MASTODON_ACCESS_TOKEN);
    console.log('   - BLUESKY_IDENTIFIER:', !!process.env.BLUESKY_IDENTIFIER);
    console.log('   - BLUESKY_PASSWORD:', !!process.env.BLUESKY_PASSWORD);
    
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
    const [mastodonResult, blueskyResult] = await Promise.all([
      postToMastodon(title, fullUrl),
      postToBluesky(title, fullUrl)
    ]);
    
    // Log results for debugging
    console.log('\n📊 Posting results:');
    console.log('   Mastodon:', mastodonResult);
    console.log('   Bluesky:', blueskyResult);
    
    // Write debug info to file for GitHub Actions artifact
    const debugInfo = {
      timestamp: new Date().toISOString(),
      post: { title, fullUrl, file },
      environment: {
        mastodonUrl: !!process.env.MASTODON_URL,
        mastodonToken: !!process.env.MASTODON_ACCESS_TOKEN,
        blueskyId: !!process.env.BLUESKY_IDENTIFIER,
        blueskyPass: !!process.env.BLUESKY_PASSWORD
      },
      results: {
        mastodon: mastodonResult,
        bluesky: blueskyResult
      }
    };
    
    require('fs').writeFileSync('debug-log.json', JSON.stringify(debugInfo, null, 2));
    console.log('📝 Debug info written to debug-log.json');
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