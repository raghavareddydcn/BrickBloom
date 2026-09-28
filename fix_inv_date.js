const fs = require('fs');
let text = fs.readFileSync('inventory.html', 'utf8');

// Fix garbled chars in inventory.html
text = text.replace(/if \(\!iso\) return '.{1,3}';/, "if (!iso) return '-';");

// Make sure loadInventory correctly parses lastUpdated
if (text.includes("var d = doc.data();")) {
    console.log("loadInventory parses doc.data()");
}

fs.writeFileSync('inventory.html', text, 'utf8');
console.log('Fixed garbled chars in inventory.html');
