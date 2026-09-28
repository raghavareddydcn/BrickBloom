const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

text = text.replace('?? WhatsApp</a>', '💬 WhatsApp</a>');
text = text.replace('? Auto #</button>', '✨ Auto #</button>');
text = text.replace('?? Save</button>', '💾 Save</button>');
text = text.replace('?? Saved (<span', '📂 Saved (<span');

text = text.replace('?? Offline  showing', '⚠️ Offline — showing');
text = text.replace('? Save failed  check', '❌ Save failed — check');
text = text.replace('? Delete failed  check', '❌ Delete failed — check');
text = text.replace('?? Packing row is pinned  edit', '📌 Packing row is pinned — edit');
text = text.replace('?? Thank you for your business  BrickBloom', '🌱 Thank you for your business — BrickBloom');

text = text.replace(/>\? '/g, '>₹ \'');
text = text.replace(/'<td><strong>\? '/g, "'<td><strong>₹ '");

text = text.replace(/<span class="inv-sum-v">\? '/g, '<span class="inv-sum-v">₹ \'');
text = text.replace(/<span class="inv-meta-v">\? '/g, '<span class="inv-meta-v">₹ \'');
text = text.replace(/<span class="inv-grand-v">\? '/g, '<span class="inv-grand-v">₹ \'');
text = text.replace(/<div class="isc-total">\? '/g, '<div class="isc-total">₹ \'');

fs.writeFileSync('invoice.html', text, 'utf8');
