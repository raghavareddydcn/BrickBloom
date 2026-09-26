const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const faviconTags = `<link rel="icon" type="image/jpeg" href="/images/OurProducts/Logo_new.jpeg" />\n  <link rel="apple-touch-icon" href="/images/OurProducts/Logo_new.jpeg" />`;

let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace existing svg favicon link if present
  if (content.includes('rel="icon"')) {
    content = content.replace(/<link rel="icon"[^>]*>/gi, faviconTags);
    changed = true;
  } else if (content.includes('<head>')) {
    content = content.replace('<head>', '<head>\n  ' + faviconTags);
    changed = true;
  }

  // Ensure apple-touch-icon exists if not already added above
  if (!content.includes('apple-touch-icon')) {
    content = content.replace('</head>', '  <link rel="apple-touch-icon" href="/images/OurProducts/Logo_new.jpeg" />\n</head>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log('Updated favicon in:', file);
  }
});

console.log('Total files updated:', updatedCount);
