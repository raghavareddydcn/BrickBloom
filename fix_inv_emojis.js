const fs = require('fs');
let text = fs.readFileSync('inventory.html', 'utf8');

// Fix garbled emojis and title in inventory.html
text = text.replace(/<title>BrickBloom .{1,3} Inventory<\/title>/, "<title>BrickBloom - Inventory</title>");
text = text.replace(/<div class="page-title">.*? Stock Inventory<\/div>/, '<div class="page-title">📦 Stock Inventory</div>');
text = text.replace(/<div class="page-subtitle">.*?Auto-deducted/g, '<div class="page-subtitle">Live stock levels for all products · Auto-deducted');
text = text.replace(/<a href="\/invoice" class="tbtn tbtn-invoice">.*? Invoice Portal<\/a>/, '<a href="/invoice" class="tbtn tbtn-invoice">📄 Invoice Portal</a>');
text = text.replace(/<button class="tbtn tbtn-logout" onclick="logout\(\)">.*? Logout<\/button>/, '<button class="tbtn tbtn-logout" onclick="logout()">🚪 Logout</button>');
text = text.replace(/<div class="empty-state-icon">.*?<\/div>/g, '<div class="empty-state-icon">ℹ️</div>'); // generic info icon
text = text.replace(/>.{1,3} Save All Changes/g, '>💾 Save All Changes');

fs.writeFileSync('inventory.html', text, 'utf8');
console.log('Fixed garbled emojis in inventory.html');
