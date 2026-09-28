const fs = require('fs');
const text = fs.readFileSync('inventory.html', 'utf8');
const match = text.match(/async function loadInventory\(\) \{[\s\S]*?\}\s*<\/script>/);
console.log(match ? match[0].substring(0, 500) + '...' : 'Not found');
