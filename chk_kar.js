const fs = require('fs');

// Get the exact bytes at the Karnataka – 560049 line in invoice.html
const buf = fs.readFileSync('invoice.html');
const text = buf.toString('utf8');
const idx = text.indexOf('Karnataka');
// find the one with 560049
let start = 0;
while (true) {
  const i = text.indexOf('Karnataka', start);
  if (i === -1) break;
  const chunk = text.slice(i, i+30);
  if (chunk.includes('560049')) {
    console.log('Found at', i, ':', JSON.stringify(chunk));
    break;
  }
  start = i + 1;
}
