const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

const reps = [
    ['<div class="drawer-head-title">?? Saved Invoices</div>', '<div class="drawer-head-title">📂 Saved Invoices</div>'],
    ['<button class="tbtn tbtn-img" onclick="saveAsImage()">?? Image</button>', '<button class="tbtn tbtn-img" onclick="saveAsImage()">🖼️ Image</button>'],
    ['<button class="tbtn tbtn-pdf" onclick="saveAsPdf()">?? PDF</button>', '<button class="tbtn tbtn-pdf" onclick="saveAsPdf()">📄 PDF</button>'],
    ['<button class="tbtn tbtn-reset" onclick="clearForm()">?? Reset</button>', '<button class="tbtn tbtn-reset" onclick="clearForm()">🔄 Reset</button>'],
    ['<a href="/whatsapp" class="tbtn" style="background:#16a34a; color:#fff; text-decoration:none;">?? WhatsApp Bulk Sender</a>', '<a href="/whatsapp" class="tbtn" style="background:#16a34a; color:#fff; text-decoration:none;">💬 WhatsApp Bulk Sender</a>'],
    ['<button class="tbtn tbtn-auto" onclick="autoFillInvoiceNumber();toggleMobileMenu()">? Auto Invoice #</button>', '<button class="tbtn tbtn-auto" onclick="autoFillInvoiceNumber();toggleMobileMenu()">✨ Auto Invoice #</button>'],
    ['<button class="tbtn tbtn-save" onclick="saveInvoice();toggleMobileMenu()">?? Save Invoice</button>', '<button class="tbtn tbtn-save" onclick="saveInvoice();toggleMobileMenu()">💾 Save Invoice</button>'],
    ['<button class="tbtn tbtn-list" onclick="openDrawer();toggleMobileMenu()">?? Saved Invoices (<span id="savedCountMobile">0</span>)</button>', '<button class="tbtn tbtn-list" onclick="openDrawer();toggleMobileMenu()">📂 Saved Invoices (<span id="savedCountMobile">0</span>)</button>'],
    ['<button class="tbtn tbtn-img" onclick="saveAsImage();toggleMobileMenu()">?? Save as Image</button>', '<button class="tbtn tbtn-img" onclick="saveAsImage();toggleMobileMenu()">🖼️ Save as Image</button>'],
    ['<button class="tbtn tbtn-pdf" onclick="saveAsPdf();toggleMobileMenu()">?? Print / PDF</button>', '<button class="tbtn tbtn-pdf" onclick="saveAsPdf();toggleMobileMenu()">🖨️ Print / PDF</button>'],
    ['<button class="tbtn tbtn-reset" onclick="clearForm();toggleMobileMenu()">?? Reset Form</button>', '<button class="tbtn tbtn-reset" onclick="clearForm();toggleMobileMenu()">🔄 Reset Form</button>'],
    ['<span>?? Editing: <strong id="editingRef"></strong></span>', '<span>✏️ Editing: <strong id="editingRef"></strong></span>'],
    ['<button class="eb-btn eb-new" onclick="duplicateCurrentAsNew()">?? Save as New</button>', '<button class="eb-btn eb-new" onclick="duplicateCurrentAsNew()">📋 Save as New</button>'],
    ['<button class="eb-btn eb-blank" onclick="clearForm()">? Blank</button>', '<button class="eb-btn eb-blank" onclick="clearForm()">➕ Blank</button>'],
    ['<div class="panel-head">?? Invoice Details</div>', '<div class="panel-head">📝 Invoice Details</div>'],
    ['<div class="panel-head">?? Bill To (Customer)</div>', '<div class="panel-head">👤 Bill To (Customer)</div>'],
    ['<div class="panel-head">?? Line Items</div>', '<div class="panel-head">📦 Line Items</div>'],
    ['<th style="width:68px;text-align:right">Price ?</th>', '<th style="width:68px;text-align:right">Price ₹</th>'],
    ['<div class="panel-head">?? Charges &amp; GST</div>', '<div class="panel-head">💰 Charges &amp; GST</div>'],
    ['<label>Transport / Delivery (?)</label>', '<label>Transport / Delivery (₹)</label>'],
    ["showToast('?? Offline  showing last synced invoices', 'err');", "showToast('⚠️ Offline — showing last synced invoices', 'err');"],
    ["showToast('? Migrated ' + local.length + ' saved invoice(s) to the cloud');", "showToast('✅ Migrated ' + local.length + ' saved invoice(s) to the cloud');"],
    ["if (!data.refNo) { showToast('? Enter a Ref No first', 'err'); return false; }", "if (!data.refNo) { showToast('⚠️ Enter a Ref No first', 'err'); return false; }"],
    ["showToast(isUpdate ? '? Invoice updated: ' + data.refNo : '? Invoice saved: ' + data.refNo);", "showToast(isUpdate ? '✅ Invoice updated: ' + data.refNo : '✅ Invoice saved: ' + data.refNo);"],
    ["showToast('? Save failed  check your connection', 'err');", "showToast('❌ Save failed — check your connection', 'err');"],
    ["showToast('? Loaded ' + inv.refNo + ' for editing');", "showToast('✅ Loaded ' + inv.refNo + ' for editing');"],
    ["showToast('? Pre-filled from ' + inv.refNo + ' as new invoice');", "showToast('✅ Pre-filled from ' + inv.refNo + ' as new invoice');"],
    ["showToast('? Ready as new invoice: ' + v('refNo'));", "showToast('✅ Ready as new invoice: ' + v('refNo'));"],
    ["showToast('? Invoice deleted');", "showToast('🗑️ Invoice deleted');"],
    ["showToast('? Delete failed  check your connection', 'err');", "showToast('❌ Delete failed — check your connection', 'err');"],
    ['<div class="drawer-empty-icon">??</div>', '<div class="drawer-empty-icon">📭</div>'],
    ['\'<div class="isc-cust">?? \' + escH(inv.custName || \'(no name)\') + \'</div>\' +', '\'<div class="isc-cust">👤 \' + escH(inv.custName || \'(no name)\') + \'</div>\' +'],
    ['\'<button class="isc-btn isc-edit" data-id="\' + inv.id + \'">?? Edit</button>\' +', '\'<button class="isc-btn isc-edit" data-id="\' + inv.id + \'">✏️ Edit</button>\' +'],
    ['\'<button class="isc-btn isc-clone" data-id="\' + inv.id + \'">?? New from this</button>\' +', '\'<button class="isc-btn isc-clone" data-id="\' + inv.id + \'">📋 New from this</button>\' +'],
    ['\'<button class="isc-btn isc-del" data-id="\' + inv.id + \'">?? Delete</button>\' +', '\'<button class="isc-btn isc-del" data-id="\' + inv.id + \'">🗑️ Delete</button>\' +'],
    ["showToast('?? Packing row is pinned  edit price if needed', 'err');", "showToast('📌 Packing row is pinned — edit price if needed', 'err');"],
    ["optCustom.textContent = '? Add New Custom Product...';", "optCustom.textContent = '➕ Add New Custom Product...';"],
    ["showToast('? Saved \"' + cleanName + '\" to product catalog!');", "showToast('✅ Saved \"' + cleanName + '\" to product catalog!');"],
    ["btnEdit.textContent = '??';", "btnEdit.textContent = '✏️';"],
    ["showToast('? Product updated in catalog!');", "showToast('✅ Product updated in catalog!');"],
    ["bd.textContent = '?';", "bd.textContent = '❌';"],
    ["'? 0.00'", "'₹ 0.00'"],
    ["'? ' +", "'₹ ' +"],
    [">? 0.00<", ">₹ 0.00<"],
    ["<th>Rate (?)</th>", "<th>Rate (₹)</th>"],
    ["<th>Total (?)</th>", "<th>Total (₹)</th>"],
    ['<span>?? <a href="tel:+918951744898">+91 8951744898</a></span>', '<span>📞 <a href="tel:+918951744898">+91 8951744898</a></span>'],
    ['<span>? <a href="mailto:info@brickbloom.co.in">info@brickbloom.co.in</a></span>', '<span>✉ <a href="mailto:info@brickbloom.co.in">info@brickbloom.co.in</a></span>'],
    ['<span>?? <a href="https://www.brickbloom.co.in">brickbloom.co.in</a></span>', '<span>🌐 <a href="https://www.brickbloom.co.in">brickbloom.co.in</a></span>'],
    ['?? Thank you for your business  BrickBloom', '🌱 Thank you for your business — BrickBloom']
];

for (const [bad, good] of reps) {
    text = text.split(bad).join(good);
}

fs.writeFileSync('invoice.html', text, 'utf8');
