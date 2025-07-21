const https = require('https');
const fs = require('fs');
const path = require('path');

// Simple function to make HTTP requests
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
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
  // Simple frontmatter extraction
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    throw new Error(`No frontmatter found in ${filePath}`);
  }
  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/title:\s*["']?([^"\n]+)["']?/);
  const dateMatch = frontmatter.match(/date:\s*([^\n]+)/);
  if (!titleMatch || !dateMatch) {
    throw new Error(`Missing title or date in frontmatter for ${filePath}`);
  }
  return {
    title: titleMatch[1].trim(),
    date: new Date(dateMatch[1].trim())
  };
}

// Convert file path to URL path
function filePathToUrlPath(filePath) {
  // Remove the content/posts/ prefix and .md extension
  const relativePath = filePath.replace(/^content\/posts\//, '').replace(/\.md$/, '');
  // Split by directory separators and join with /
  const pathParts = relativePath.split(path.sep);
  // Format as YYYY/MM/DD/slug
  if (pathParts.length >= 4) {
    const year = pathParts[0];
    const month = pathParts[1];
    const day = pathParts[2];
    const slug = pathParts[3];
    return `/${year}/${month}/${day}/${slug}/`;
  }
  // Fallback: just use the relative path
  return `/${relativePath.replace(/\\/g, '/')}/`;
}

// Find the most recent post by frontmatter date
function findMostRecentPostByDate(postsDir) {
  const markdownFiles = findMarkdownFiles(postsDir);
  if (markdownFiles.length === 0) {
    throw new Error('No markdown files found in posts directory');
  }
  let mostRecent = null;
  let mostRecentData = null;
  for (const file of markdownFiles) {
    try {
      const data = extractFrontmatter(file);
      if (!mostRecent || (data.date > mostRecentData.date)) {
        mostRecent = file;
        mostRecentData = data;
      }
    } catch (e) {
      // Ignore files with invalid frontmatter
      continue;
    }
  }
  if (!mostRecent) {
    throw new Error('No valid markdown files with date found');
  }
  return { file: mostRecent, ...mostRecentData };
}

// Post to Mastodon
async function postToMastodon(title, fullUrl) {
  if (!process.env.MASTODON_URL || !process.env.MASTODON_ACCESS_TOKEN) {
    console.log('Mastodon credentials not configured, skipping...');
    return { success: false, reason: 'Missing credentials' };
  }
  try {
    const status = `New post: ${title}\n\n${fullUrl}`;
    const url = `${process.env.MASTODON_URL}/api/v1/statuses`;
    const response = await makeRequest(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MASTODON_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        visibility: 'public'
      })
    });
    if (response.statusCode === 200) {
      console.log('✅ Posted to Mastodon successfully');
      return { success: true };
    } else {
      console.error('❌ Failed to post to Mastodon:', response.statusCode, response.data);
      return { success: false, reason: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    console.error('❌ Error posting to Mastodon:', error.message);
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
    // First, authenticate with Bluesky
    const authResponse = await makeRequest('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: process.env.BLUESKY_IDENTIFIER,
        password: process.env.BLUESKY_PASSWORD
      })
    });
    if (authResponse.statusCode !== 200) {
      console.error('❌ Failed to authenticate with Bluesky:', authResponse.statusCode);
      return { success: false, reason: 'Authentication failed' };
    }
    const authData = JSON.parse(authResponse.data);
    const accessJwt = authData.accessJwt;
    // Now post to Bluesky
    const text = `New post: ${title}\n\n${fullUrl}`;
    const postResponse = await makeRequest('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessJwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        repo: process.env.BLUESKY_IDENTIFIER,
        collection: 'app.bsky.feed.post',
        record: {
          text,
          createdAt: new Date().toISOString()
        }
      })
    });
    if (postResponse.statusCode === 200) {
      console.log('✅ Posted to Bluesky successfully');
      return { success: true };
    } else {
      console.error('❌ Failed to post to Bluesky:', postResponse.statusCode, postResponse.data);
      return { success: false, reason: `HTTP ${postResponse.statusCode}` };
    }
  } catch (error) {
    console.error('❌ Error posting to Bluesky:', error.message);
    return { success: false, reason: error.message };
  }
}

exports.handler = async (event, context) => {
  console.log('🔔 Webhook received:', event.httpMethod, event.path);
  // Only process POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  try {
    // Parse the webhook payload
    const body = JSON.parse(event.body);
    console.log('📦 Webhook payload event type:', body.event_type);
    // Only process deployment success events
    if (body.event_type !== 'deploy_succeeded') {
      console.log('⏭️  Skipping non-deployment event');
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Not a deployment success event, skipping',
          event_type: body.event_type 
        })
      };
    }
    // Log deployment details
    console.log('🚀 Deployment succeeded!');
    console.log('   Site:', body.site_name);
    console.log('   Deploy URL:', body.deploy_url);
    // Check if required environment variables are set
    const missingVars = [];
    if (!process.env.MASTODON_URL || !process.env.MASTODON_ACCESS_TOKEN) {
      missingVars.push('Mastodon credentials');
    }
    if (!process.env.BLUESKY_IDENTIFIER || !process.env.BLUESKY_PASSWORD) {
      missingVars.push('Bluesky credentials');
    }
    if (missingVars.length > 0) {
      console.warn('⚠️  Missing environment variables:', missingVars.join(', '));
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Skipping social media posts due to missing credentials',
          missing: missingVars 
        })
      };
    }
    // Find the most recent post by date
    console.log('🔍 Scanning for most recent post by date...');
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const { file: mostRecentFile, title, date } = findMostRecentPostByDate(postsDir);
    console.log(`📄 Found most recent file: ${mostRecentFile}`);
    console.log(`📝 Title: ${title}`);
    console.log(`📅 Date: ${date}`);
    // Always construct the URL from the file path
    const urlPath = filePathToUrlPath(mostRecentFile);
    const fullUrl = `https://zerocounts.net${urlPath}`;
    console.log(`🌐 Full URL: ${fullUrl}`);
    console.log('📤 Posting to social media...');
    const mastodonResult = await postToMastodon(title, fullUrl);
    const blueskyResult = await postToBluesky(title, fullUrl);
    const results = {
      mastodon: mastodonResult,
      bluesky: blueskyResult,
      post: {
        title,
        url: fullUrl,
        file: mostRecentFile,
        date: date
      },
      deploy_url: body.deploy_url,
      site_name: body.site_name
    };
    console.log('📊 Posting results:', results);
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('❌ Error in webhook handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
}; 