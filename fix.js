const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

const replacements = {
    '?? Image': '🖼️ Image',
    '?? PDF': '📄 PDF',
    '?? Reset': '🔄 Reset',
    '?? WhatsApp Bulk Sender': '💬 WhatsApp Bulk Sender',
    '? Auto Invoice #': '✨ Auto Invoice #',
    '?? Save Invoice': '💾 Save Invoice',
    '?? Saved Invoices': '📂 Saved Invoices',
    '?? Save as Image': '🖼️ Save as Image',
    '?? Print / PDF': '🖨️ Print / PDF',
    '?? Reset Form': '🔄 Reset Form',
    '?? Editing:': '✏️ Editing:',
    '?? Save as New': '📋 Save as New',
    '? Blank': '➕ Blank',
    '?? Invoice Details': '📝 Invoice Details',
    '?? Bill To (Customer)': '👤 Bill To (Customer)',
    '?? Line Items': '📦 Line Items',
    'Price ?': 'Price ₹',
    '?? Charges &amp; GST': '💰 Charges &amp; GST',
    'Transport / Delivery (?)': 'Transport / Delivery (₹)',
    '?? Offline  showing last synced invoices': '⚠️ Offline — showing last synced invoices',
    '? Migrated': '✅ Migrated',
    '? Enter a Ref No first': '⚠️ Enter a Ref No first',
    '? Invoice updated:': '✅ Invoice updated:',
    '? Invoice saved:': '✅ Invoice saved:',
    '? Save failed  check your connection': '❌ Save failed — check your connection',
    '? Loaded ': '✅ Loaded ',
    '? Pre-filled': '✅ Pre-filled',
    '? Ready as new invoice': '✅ Ready as new invoice',
    '? Invoice deleted': '🗑️ Invoice deleted',
    '? Delete failed  check your connection': '❌ Delete failed — check your connection',
    '<div class="drawer-empty-icon">??</div>': '<div class="drawer-empty-icon">📭</div>',
    '?? Edit': '✏️ Edit',
    '?? New from this': '📋 New from this',
    '?? Delete': '🗑️ Delete',
    '?? Packing row is pinned': '📌 Packing row is pinned',
    '? Add New Custom Product...': '➕ Add New Custom Product...',
    '? Saved "': '✅ Saved "',
    "btnEdit.textContent = '??';": "btnEdit.textContent = '✏️';",
    '? Product updated': '✅ Product updated',
    "bd.textContent = '?';": "bd.textContent = '❌';",
    '?? <a href="tel:+918951744898">': '📞 <a href="tel:+918951744898">',
    '? <a href="mailto:info@brickbloom.co.in">': '✉ <a href="mailto:info@brickbloom.co.in">',
    '?? <a href="https://www.brickbloom.co.in">': '🌐 <a href="https://www.brickbloom.co.in">',
    '?? Thank you for your business  BrickBloom': '🌱 Thank you for your business — BrickBloom',
    'Bangalore, Karnataka  560049': 'Bangalore, Karnataka — 560049',
    "? '<tr><td colspan=\"7\"": "  '<tr><td colspan=\"7\"",
    "isNaN(n) ? '? 0.00' : '? '": "isNaN(n) ? '₹ 0.00' : '₹ '",
    "? '<td>' + fmtN(taxAmt) + ' (' + gstRate + '%)</td>'": "  '<td>' + fmtN(taxAmt) + ' (' + gstRate + '%)</td>'",
    "Rate (?)": "Rate (₹)",
    "Total (?)": "Total (₹)"
};

for (const [bad, good] of Object.entries(replacements)) {
    text = text.split(bad).join(good);
}

// Handle ₹ symbol in string concats like: '? ' + fmtN
text = text.replace(/>\? 0\.00</g, '>₹ 0.00<');
text = text.replace(/>\? '/g, '>₹ \'');
text = text.replace(/'\? '/g, "'₹ '");
text = text.replace(/">?? /g, "\">👤 "); // For isc-cust where it was ?? ' + escH
text = text.replace(/isc-cust">👤 /g, 'isc-cust">👤 ');

fs.writeFileSync('invoice.html', text, 'utf8');
console.log('Fixed encoding issues via Node.js!');
