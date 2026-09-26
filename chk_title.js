const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

// Find title and nearby content
const idx = text.indexOf('<title>');
console.log('Title:', text.slice(idx, idx+80));

// Find inv-bal-v in preview
const bi = text.indexOf('inv-bal-v');
console.log('Balance:', text.slice(bi, bi+120));
