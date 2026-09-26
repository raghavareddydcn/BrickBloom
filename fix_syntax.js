const fs = require('fs');
let html = fs.readFileSync('inventory.html', 'utf8');

// The error is an extra brace after loadInventory:
// showToast('... Failed to load inventory', 'err');
//        }
//      }
//      }  <-- This one
html = html.replace(/showToast\('.{1,3} Failed to load inventory', 'err'\);\s*\}\s*\}\s*\}/, "showToast('❌ Failed to load inventory', 'err');\n        }\n      }");

// Let's also restore the emojis because they got garbled as I can see in the log:
// <div class="page-title">dY" Stock Inventory</div> -> 📦 Stock Inventory
html = html.replace(/<div class="page-title">.*? Stock Inventory<\/div>/, '<div class="page-title">📦 Stock Inventory</div>');
html = html.replace(/<a href="\/invoice" class="tbtn tbtn-invoice">.*? Invoice Portal<\/a>/, '<a href="/invoice" class="tbtn tbtn-invoice">📄 Invoice Portal</a>');
html = html.replace(/<button class="tbtn tbtn-logout" onclick="logout\(\)">.*? Logout<\/button>/, '<button class="tbtn tbtn-logout" onclick="logout()">🚪 Logout</button>');
html = html.replace(/<title>BrickBloom .*? Inventory<\/title>/, '<title>BrickBloom – Inventory</title>');
html = html.replace(/<div class="page-subtitle">Live stock levels for all products .*? Auto-deducted/, '<div class="page-subtitle">Live stock levels for all products · Auto-deducted');
html = html.replace(/>.{1,3} Save All Changes/g, '>💾 Save All Changes');
html = html.replace(/showToast\('.{1,3} Inventory saved /, "showToast('✅ Inventory saved ");
html = html.replace(/showToast\('.{1,3} Save failed /, "showToast('❌ Save failed ");

fs.writeFileSync('inventory.html', html, 'utf8');
console.log('Fixed syntax error and emojis');
