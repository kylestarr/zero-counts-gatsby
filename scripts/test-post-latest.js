#!/usr/bin/env node

const { findMostRecentUnpostedPost, extractFrontmatter, loadPostedHistory } = require('./post-latest');
const path = require('path');

/**
 * Test function to demonstrate the script functionality
 */
async function testScript() {
  try {
    console.log('🧪 Testing post-latest script functionality...\n');
    
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    
    if (!require('fs').existsSync(postsDir)) {
      throw new Error(`Posts directory not found: ${postsDir}`);
    }
    
    // Load posted history
    console.log('1. Loading posted history...');
    const history = loadPostedHistory();
    console.log(`   ✅ Found ${history.postedUrls.length} previously posted URLs`);
    if (history.lastPosted) {
      console.log(`   📅 Last posted: ${new Date(history.lastPosted).toLocaleString()}`);
    }
    
    // Find the most recent unposted post
    console.log('\n2. Finding most recent unposted post...');
    const mostRecentFile = findMostRecentUnpostedPost(postsDir, history);
    
    if (!mostRecentFile) {
      console.log('   ✅ All recent posts have already been posted!');
      console.log('   📝 No new posts to share.');
      return;
    }
    
    console.log(`   ✅ Found unposted file: ${path.relative(process.cwd(), mostRecentFile)}`);
    
    // Extract frontmatter
    console.log('\n3. Extracting frontmatter...');
    const { title, url, date } = extractFrontmatter(mostRecentFile);
    console.log(`   ✅ Title: ${title}`);
    console.log(`   ✅ URL: ${url}`);
    console.log(`   ✅ Date: ${date}`);
    
    // Show what the post would look like
    console.log('\n4. Sample post content:');
    const sampleUrl = `https://zerocounts.com${url}`;
    console.log('   📝 Mastodon/Bluesky post would be:');
    console.log('   ┌─────────────────────────────────────┐');
    console.log(`   │ New post: ${title}`);
    console.log('   │');
    console.log(`   │ ${sampleUrl}`);
    console.log('   └─────────────────────────────────────┘');
    
    console.log('\n✅ Test completed successfully!');
    console.log('   The script is working correctly.');
    console.log('   To actually post to social media, run: npm run post-latest');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testScript();
} 