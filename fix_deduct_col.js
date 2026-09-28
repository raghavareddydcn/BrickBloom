const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

// Update the auto-deduct to use products collection instead of inventory
text = text.split("db.collection('inventory').doc(item.name)").join("db.collection('products').doc(item.name)");

fs.writeFileSync('invoice.html', text, 'utf8');
console.log('invoice.html auto-deduct updated to products collection');
