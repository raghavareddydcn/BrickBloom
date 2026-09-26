const fs = require('fs');
let text = fs.readFileSync('inventory.html', 'utf8');

text = text.replace("''<td class=\"badge-cell-", "'<td class=\"badge-cell-");

// Also clean up garbled icons in JS strings
text = text.replace(/dY`\?,\? View Mode/g, "👁️ View Mode");
text = text.replace(/dY`\?,\? Done Editing \(View Mode\)/g, "👁️ Done Editing (View Mode)");
text = text.replace(/o\?,\? Edit Mode/g, "✏️ Edit Mode");
text = text.replace(/o\?,\? Edit Inventory/g, "✏️ Edit Inventory");
text = text.replace(/dY'_ Save All Changes/g, "💾 Save All Changes");
text = text.replace(/o\. Inventory saved/g, "✅ Inventory saved");
text = text.replace(/\?O Save failed/g, "❌ Save failed");
text = text.replace(/dY"\?/g, "🔍");
text = text.replace(/\?3/g, "⏳");

fs.writeFileSync('inventory.html', text, 'utf8');
console.log('Cleaned up quotes and emojis.');
