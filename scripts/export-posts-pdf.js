#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const puppeteer = require('puppeteer-core');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_FILE = path.join(__dirname, '..', 'posts-export.pdf');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function findMarkdownFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseDate(dateStr) {
  if (!dateStr) return new Date(0);
  return new Date(dateStr);
}

async function main() {
  console.log('Finding markdown files...');
  const files = findMarkdownFiles(CONTENT_DIR);
  console.log(`Found ${files.length} files`);

  const posts = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    if (data.draft === true) continue;
    posts.push({
      title: data.title || path.basename(file, '.md'),
      date: parseDate(data.date),
      dateStr: data.date ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
      categories: data.categories || [],
      content,
      file,
    });
  }

  // Sort by date ascending
  posts.sort((a, b) => a.date - b.date);
  console.log(`Generating PDF for ${posts.length} posts...`);

  const tocItems = posts.map((p, i) =>
    `<li><a href="#post-${i}">${escapeHtml(p.title)}${p.dateStr ? ` <span class="toc-date">(${p.dateStr})</span>` : ''}</a></li>`
  ).join('\n');

  const postHtml = posts.map((p, i) => {
    const bodyHtml = marked.parse(p.content || '');
    const cats = p.categories.length ? `<div class="categories">Categories: ${p.categories.map(escapeHtml).join(', ')}</div>` : '';
    return `
      <article id="post-${i}" class="post">
        <h1>${escapeHtml(p.title)}</h1>
        ${p.dateStr ? `<div class="date">${p.dateStr}</div>` : ''}
        ${cats}
        <div class="body">${bodyHtml}</div>
      </article>
      <div class="page-break"></div>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Zero Counts — Posts Export</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #222;
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
  }
  h1.site-title {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 28pt;
    margin-bottom: 0;
    text-align: center;
  }
  .site-subtitle {
    text-align: center;
    color: #555;
    margin-bottom: 40px;
  }
  h2.toc-heading {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 16pt;
    border-bottom: 1px solid #ccc;
    padding-bottom: 6px;
  }
  .toc ol {
    column-count: 2;
    column-gap: 30px;
  }
  .toc li {
    margin-bottom: 4px;
    font-size: 8pt;
    break-inside: avoid;
  }
  .toc a {
    color: #333;
    text-decoration: none;
  }
  .toc-date {
    color: #777;
    font-size: 7pt;
  }
  .page-break {
    page-break-after: always;
  }
  article.post {
    margin-bottom: 20px;
  }
  article.post h1 {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 20pt;
    margin-bottom: 4px;
    line-height: 1.2;
  }
  .date {
    color: #777;
    font-size: 9pt;
    margin-bottom: 4px;
  }
  .categories {
    color: #888;
    font-size: 8pt;
    margin-bottom: 12px;
  }
  .body h1, .body h2, .body h3, .body h4 {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
  }
  .body img {
    max-width: 100%;
    height: auto;
  }
  .body blockquote {
    border-left: 3px solid #ccc;
    margin-left: 0;
    padding-left: 16px;
    color: #555;
    font-style: italic;
  }
  .body pre {
    background: #f5f5f5;
    padding: 10px;
    overflow: auto;
    font-size: 8pt;
  }
  .body a {
    color: #333;
  }
  hr { border: none; border-top: 1px solid #ddd; }
</style>
</head>
<body>
  <h1 class="site-title">Zero Counts</h1>
  <p class="site-subtitle">Posts Export — ${posts.length} posts — Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  <div class="page-break"></div>

  <div class="toc">
    <h2 class="toc-heading">Table of Contents</h2>
    <ol>${tocItems}</ol>
  </div>
  <div class="page-break"></div>

  ${postHtml}
</body>
</html>`;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: OUTPUT_FILE,
    format: 'Letter',
    margin: { top: '0.75in', bottom: '0.75in', left: '0.75in', right: '0.75in' },
    printBackground: true,
  });

  await browser.close();
  console.log(`PDF saved to: ${OUTPUT_FILE}`);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
