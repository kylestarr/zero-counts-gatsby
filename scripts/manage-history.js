#!/usr/bin/env node

const { loadPostedHistory, savePostedHistory } = require('./post-latest');
const fs = require('fs');
const path = require('path');

const POSTED_HISTORY_FILE = path.join(__dirname, 'posted-history.json');

/**
 * Display the posted history
 */
function showHistory() {
  const history = loadPostedHistory();
  
  console.log('📊 Posted History:');
  console.log(`   Total URLs: ${history.postedUrls.length}`);
  console.log(`   Last posted: ${history.lastPosted ? new Date(history.lastPosted).toLocaleString() : 'Never'}`);
  
  if (history.postedUrls.length > 0) {
    console.log('\n   Recently posted URLs:');
    history.postedUrls.slice(-10).forEach((url, index) => {
      console.log(`   ${history.postedUrls.length - 9 + index}. ${url}`);
    });
    
    if (history.postedUrls.length > 10) {
      console.log(`   ... and ${history.postedUrls.length - 10} more`);
    }
  }
}

/**
 * Clear the posted history
 */
function clearHistory() {
  if (fs.existsSync(POSTED_HISTORY_FILE)) {
    fs.unlinkSync(POSTED_HISTORY_FILE);
    console.log('🗑️  Posted history cleared!');
  } else {
    console.log('ℹ️  No posted history file found.');
  }
}

/**
 * Add a URL to the history manually
 */
function addUrl(url) {
  if (!url) {
    console.error('❌ Please provide a URL to add');
    return;
  }
  
  const history = loadPostedHistory();
  
  if (history.postedUrls.includes(url)) {
    console.log('ℹ️  URL already exists in history');
    return;
  }
  
  history.postedUrls.push(url);
  history.lastPosted = new Date().toISOString();
  
  // Keep only the last 100 posted URLs
  if (history.postedUrls.length > 100) {
    history.postedUrls = history.postedUrls.slice(-100);
  }
  
  savePostedHistory(history);
  console.log(`✅ Added ${url} to posted history`);
}

/**
 * Show help information
 */
function showHelp() {
  console.log('📋 Post History Management Tool');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/manage-history.js [command] [options]');
  console.log('');
  console.log('Commands:');
  console.log('  show                    Show the current posted history');
  console.log('  clear                   Clear all posted history');
  console.log('  add <url>              Add a URL to the posted history');
  console.log('  help                    Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/manage-history.js show');
  console.log('  node scripts/manage-history.js clear');
  console.log('  node scripts/manage-history.js add "https://zerocounts.com/my-post/"');
}

/**
 * Main function
 */
function main() {
  const command = process.argv[2];
  const url = process.argv[3];
  
  switch (command) {
    case 'show':
      showHistory();
      break;
    case 'clear':
      clearHistory();
      break;
    case 'add':
      addUrl(url);
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.log('❌ Unknown command. Use "help" to see available commands.');
      process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
} 