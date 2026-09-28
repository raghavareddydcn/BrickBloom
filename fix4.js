const fs = require('fs');
let lines = fs.readFileSync('invoice.html', 'utf8').split('\n');

lines[1424] = "      showToast('⚠️ Offline — showing last synced invoices', 'err');";
lines[1509] = "        showToast('❌ Save failed — check your connection', 'err');";
lines[1601] = "          showToast('❌ Delete failed — check your connection', 'err');";
lines[1781] = "      if (row && row.name === 'Packing') { showToast('📌 Packing row is pinned — edit price if needed', 'err'); return; }";
lines[2232] = "        '<div class=\"inv-tagline\">🌱 Thank you for your business — BrickBloom: Sustainable Cocopeat Growing Media</div>';";

fs.writeFileSync('invoice.html', lines.join('\n'), 'utf8');
