const https = require('https');

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

exports.handler = async (event, context) => {
  console.log('🔔 Webhook proxy received:', event.httpMethod, event.path);
  
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
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
      console.error('❌ Missing GitHub environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Missing GitHub configuration',
          required: ['GITHUB_TOKEN', 'GITHUB_REPO']
        })
      };
    }

    // Trigger GitHub Actions workflow
    console.log('📤 Triggering GitHub Actions workflow...');
    
    const [owner, repo] = process.env.GITHUB_REPO.split('/');
    const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
    
    const response = await makeRequest(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Netlify-Webhook-Proxy'
      },
      body: JSON.stringify({
        event_type: 'netlify_deploy_succeeded',
        client_payload: {
          deploy_url: body.deploy_url,
          site_name: body.site_name,
          deploy_id: body.id,
          deploy_time: body.created_at
        }
      })
    });
    
    if (response.statusCode === 204) {
      console.log('✅ Successfully triggered GitHub Actions workflow');
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Successfully triggered GitHub Actions workflow',
          deploy_url: body.deploy_url,
          site_name: body.site_name
        })
      };
    } else {
      console.error('❌ Failed to trigger GitHub Actions workflow:', response.statusCode, response.data);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to trigger GitHub Actions workflow',
          status: response.statusCode,
          details: response.data
        })
      };
    }

  } catch (error) {
    console.error('❌ Error in webhook proxy:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
}; 