#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');
const OUTPUT_FILE = path.join(__dirname, '..', 'blogging-activity.html');

function findMarkdownFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findMarkdownFiles(full));
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) results.push(full);
  }
  return results;
}

function countOriginalWords(markdown) {
  // Remove code blocks (``` ... ```)
  let text = markdown.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`[^`]*`/g, '');
  // Remove blockquote lines
  text = text.split('\n').filter(line => !/^\s*>/.test(line)).join('\n');
  // Remove markdown image/link syntax but keep text
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Remove markdown heading markers, bullets, etc.
  text = text.replace(/^#+\s/gm, '');
  text = text.replace(/^[-*+]\s/gm, '');
  // Count words
  return (text.match(/\b\w+\b/g) || []).length;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function yearKey(date) {
  return `${date.getFullYear()}`;
}

const files = findMarkdownFiles(POSTS_DIR);
const byMonth = {};
const byYear = {};

for (const file of files) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  if (data.draft === true) continue;
  if (!data.date) continue;

  const date = new Date(data.date);
  if (isNaN(date)) continue;

  const mk = monthKey(date);
  const yk = yearKey(date);
  const words = countOriginalWords(content);

  if (!byMonth[mk]) byMonth[mk] = { posts: 0, words: 0 };
  byMonth[mk].posts++;
  byMonth[mk].words += words;

  if (!byYear[yk]) byYear[yk] = { posts: 0, words: 0 };
  byYear[yk].posts++;
  byYear[yk].words += words;
}

// Sort keys
const months = Object.keys(byMonth).sort();
const years = Object.keys(byYear).sort();

// Fill gaps in months
const allMonths = [];
{
  const [sy, sm] = months[0].split('-').map(Number);
  const [ey, em] = months[months.length - 1].split('-').map(Number);
  let y = sy, m = sm;
  while (y < ey || (y === ey && m <= em)) {
    const key = `${y}-${String(m).padStart(2, '0')}`;
    allMonths.push(key);
    m++;
    if (m > 12) { m = 1; y++; }
  }
}

const monthLabels = allMonths.map(k => {
  const [y, m] = k.split('-');
  return new Date(+y, +m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
});
const monthPosts = allMonths.map(k => byMonth[k]?.posts || 0);
const monthWords = allMonths.map(k => byMonth[k]?.words || 0);

const yearLabels = years;
const yearPosts = years.map(k => byYear[k].posts);
const yearWords = years.map(k => byYear[k].words);

// Totals
const totalPosts = yearPosts.reduce((a, b) => a + b, 0);
const totalWords = yearWords.reduce((a, b) => a + b, 0);
const avgWordsPerPost = Math.round(totalWords / totalPosts);
const mostActiveYear = years[yearPosts.indexOf(Math.max(...yearPosts))];
const mostActiveMonth = allMonths[monthPosts.indexOf(Math.max(...monthPosts))];

// Cumulative post line for monthly chart
let cum = 0;
const cumulativePosts = monthPosts.map(v => (cum += v));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Zero Counts — Blogging Activity</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0f0f13;
    color: #e0e0e8;
    padding: 32px 24px 64px;
  }
  h1 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }
  .subtitle {
    color: #888;
    margin-bottom: 36px;
    font-size: 0.9rem;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 48px;
  }
  .stat-card {
    background: #1a1a24;
    border: 1px solid #2a2a38;
    border-radius: 10px;
    padding: 20px 18px;
  }
  .stat-card .label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666;
    margin-bottom: 6px;
  }
  .stat-card .value {
    font-size: 1.9rem;
    font-weight: 700;
    color: #c8b4ff;
    line-height: 1;
  }
  .stat-card .sub {
    font-size: 0.78rem;
    color: #555;
    margin-top: 4px;
  }
  .charts {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    max-width: 1200px;
  }
  .chart-card {
    background: #1a1a24;
    border: 1px solid #2a2a38;
    border-radius: 10px;
    padding: 24px;
  }
  .chart-card h2 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #888;
    margin-bottom: 20px;
  }
  .chart-wrap {
    position: relative;
    height: 280px;
  }
  .chart-wrap.tall {
    height: 340px;
  }
</style>
</head>
<body>
<h1>Blogging Activity</h1>
<p class="subtitle">zero-counts.com · All published posts · Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

<div class="stats-grid">
  <div class="stat-card">
    <div class="label">Total Posts</div>
    <div class="value">${totalPosts.toLocaleString()}</div>
    <div class="sub">${years[0]}–${years[years.length - 1]}</div>
  </div>
  <div class="stat-card">
    <div class="label">Original Words</div>
    <div class="value">${totalWords.toLocaleString()}</div>
    <div class="sub">excl. blockquotes</div>
  </div>
  <div class="stat-card">
    <div class="label">Avg Words / Post</div>
    <div class="value">${avgWordsPerPost.toLocaleString()}</div>
  </div>
  <div class="stat-card">
    <div class="label">Most Active Year</div>
    <div class="value">${mostActiveYear}</div>
    <div class="sub">${byYear[mostActiveYear].posts} posts · ${byYear[mostActiveYear].words.toLocaleString()} words</div>
  </div>
  <div class="stat-card">
    <div class="label">Most Active Month</div>
    <div class="value">${new Date(mostActiveMonth + '-15').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
    <div class="sub">${byMonth[mostActiveMonth].posts} posts</div>
  </div>
</div>

<div class="charts">
  <div class="chart-card">
    <h2>Posts per Year</h2>
    <div class="chart-wrap">
      <canvas id="yearPosts"></canvas>
    </div>
  </div>
  <div class="chart-card">
    <h2>Original Words per Year (excl. blockquotes)</h2>
    <div class="chart-wrap">
      <canvas id="yearWords"></canvas>
    </div>
  </div>
  <div class="chart-card">
    <h2>Posts per Month</h2>
    <div class="chart-wrap tall">
      <canvas id="monthPosts"></canvas>
    </div>
  </div>
  <div class="chart-card">
    <h2>Original Words per Month (excl. blockquotes)</h2>
    <div class="chart-wrap tall">
      <canvas id="monthWords"></canvas>
    </div>
  </div>
  <div class="chart-card">
    <h2>Cumulative Posts Over Time</h2>
    <div class="chart-wrap tall">
      <canvas id="cumulative"></canvas>
    </div>
  </div>
</div>

<script>
const GRID = { color: 'rgba(255,255,255,0.05)' };
const TICK = { color: '#555', font: { size: 11 } };
const purple = 'rgba(168,139,250,0.85)';
const purpleFill = 'rgba(168,139,250,0.15)';
const teal = 'rgba(52,211,153,0.85)';
const tealFill = 'rgba(52,211,153,0.12)';

function barChart(id, labels, data, color, label) {
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label, data, backgroundColor: color, borderRadius: 4, borderSkipped: false }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: GRID, ticks: TICK },
        y: { grid: GRID, ticks: TICK, beginAtZero: true }
      }
    }
  });
}

function lineChart(id, labels, data, color, fill, label) {
  new Chart(document.getElementById(id), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label, data,
        borderColor: color,
        backgroundColor: fill,
        borderWidth: 1.5,
        pointRadius: 0,
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: GRID, ticks: { ...TICK, maxTicksLimit: 20, maxRotation: 45 } },
        y: { grid: GRID, ticks: TICK, beginAtZero: true }
      }
    }
  });
}

barChart('yearPosts',  ${JSON.stringify(yearLabels)},  ${JSON.stringify(yearPosts)},  purple, 'Posts');
barChart('yearWords',  ${JSON.stringify(yearLabels)},  ${JSON.stringify(yearWords)},  teal,   'Words');
lineChart('monthPosts', ${JSON.stringify(monthLabels)}, ${JSON.stringify(monthPosts)}, purple, purpleFill, 'Posts');
lineChart('monthWords', ${JSON.stringify(monthLabels)}, ${JSON.stringify(monthWords)}, teal,   tealFill,   'Words');
lineChart('cumulative', ${JSON.stringify(monthLabels)}, ${JSON.stringify(cumulativePosts)}, purple, purpleFill, 'Cumulative Posts');
</script>
</body>
</html>`;

fs.writeFileSync(OUTPUT_FILE, html);
console.log(`Written to: ${OUTPUT_FILE}`);

// Print summary to terminal
console.log('\n--- Summary ---');
console.log(`Total posts:       ${totalPosts}`);
console.log(`Total orig. words: ${totalWords.toLocaleString()}`);
console.log(`Avg words/post:    ${avgWordsPerPost}`);
console.log(`Most active year:  ${mostActiveYear} (${byYear[mostActiveYear].posts} posts, ${byYear[mostActiveYear].words.toLocaleString()} words)`);
console.log(`Most active month: ${mostActiveMonth} (${byMonth[mostActiveMonth].posts} posts)`);
console.log('\nPosts by year:');
for (const y of years) {
  const bar = '█'.repeat(Math.round(byYear[y].posts / 2));
  console.log(`  ${y}  ${String(byYear[y].posts).padStart(3)}  ${bar}`);
}
