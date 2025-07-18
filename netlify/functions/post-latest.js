const https = require('https');

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

    // For now, just return success without actually posting
    // This will help us verify the function is working
    console.log('✅ Function is working correctly');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Function is working - ready to post to social media',
        deploy_url: body.deploy_url,
        site_name: body.site_name,
        note: 'Add actual posting logic once function is confirmed working'
      })
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