const fs = require('fs');
const path = require('path');

// Check all HTML files for garbled characters
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(function(file) {
  const text = fs.readFileSync(file, 'utf8');
  // Find garbled chars: replacement char U+FFFD or other odd chars around Karnataka
  const lines = text.split('\n');
  lines.forEach(function(line, i) {
    if (line.includes('Karnataka') || line.includes('560049') || line.includes('\uFFFD') || line.includes('\u00E2\u0080\u0093')) {
      console.log(file + ':' + (i+1) + ': ' + line.trim().slice(0,120));
    }
  });
});
