const { exec } = require('child_process');
const path = require('path');

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
    console.log('   Branch:', body.branch);
    
    // Set environment variables
    const env = {
      SITE_URL: process.env.SITE_URL || 'https://zerocounts.com',
      MASTODON_URL: process.env.MASTODON_URL,
      MASTODON_ACCESS_TOKEN: process.env.MASTODON_ACCESS_TOKEN,
      BLUESKY_IDENTIFIER: process.env.BLUESKY_IDENTIFIER,
      BLUESKY_PASSWORD: process.env.BLUESKY_PASSWORD,
      NODE_ENV: 'production'
    };

    // Check if required environment variables are set
    const missingVars = [];
    if (!env.MASTODON_URL || !env.MASTODON_ACCESS_TOKEN) {
      missingVars.push('Mastodon credentials');
    }
    if (!env.BLUESKY_IDENTIFIER || !env.BLUESKY_PASSWORD) {
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

    // Execute the post-latest script
    const scriptPath = path.join(__dirname, '../../scripts/post-latest.js');
    console.log('📝 Running post-latest script...');
    
    return new Promise((resolve, reject) => {
      exec(`node ${scriptPath}`, { 
        env: { ...process.env, ...env },
        cwd: path.join(__dirname, '../..'),
        timeout: 30000 // 30 second timeout
      }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Error running post-latest script:', error);
          resolve({
            statusCode: 500,
            body: JSON.stringify({ 
              error: 'Failed to post to social media',
              details: error.message,
              stdout: stdout,
              stderr: stderr
            })
          });
        } else {
          console.log('✅ Successfully posted to social media');
          console.log('📤 Script output:', stdout);
          if (stderr) console.log('⚠️  Script stderr:', stderr);
          
          resolve({
            statusCode: 200,
            body: JSON.stringify({ 
              message: 'Successfully posted to social media',
              output: stdout,
              deploy_url: body.deploy_url,
              site_name: body.site_name
            })
          });
        }
      });
    });

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