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

    // For now, we'll post a test message
    // In a real implementation, you'd scan the content directory for the latest post
    const testTitle = "Test post from Netlify function";
    const testUrl = "https://zerocounts.net/test-post/";
    
    console.log('📤 Posting to social media...');
    
    const mastodonResult = await postToMastodon(testTitle, testUrl);
    const blueskyResult = await postToBluesky(testTitle, testUrl);
    
    const results = {
      mastodon: mastodonResult,
      bluesky: blueskyResult,
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