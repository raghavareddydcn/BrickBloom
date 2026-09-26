const fs = require('fs');
let html = fs.readFileSync('inventory.html', 'utf8');

html = html.replace(//g, ''); // Remove any lingering replacement chars just to be safe.

fs.writeFileSync('inventory.html', html, 'utf8');
