const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

// 1. Add advancePaid to getFormData
text = text.replace(
  "transport:     parseFloat(v('transport') || 0),",
  "transport:     parseFloat(v('transport') || 0),\n        advancePaid:   parseFloat(v('advancePaid') || 0),"
);

// 2. Add advancePaid to calcTotals return  
text = text.replace(
  "return { subtotal: sub, transport: tr, tax: totalTax, taxBreakdown: taxBreakdown, grand: sub + tr + totalTax };",
  "var grand = sub + tr + totalTax;\n      var adv = parseFloat(document.getElementById('advancePaid') ? document.getElementById('advancePaid').value || 0 : 0);\n      var balance = Math.max(0, grand - adv);\n      return { subtotal: sub, transport: tr, tax: totalTax, taxBreakdown: taxBreakdown, grand: grand, advancePaid: adv, balance: balance };"
);

// 3. Update st_grand and add st_balance in renderPreview (the form totals sidebar)
text = text.replace(
  "document.getElementById('st_grand').textContent    = fmtCur(t.grand);",
  "document.getElementById('st_grand').textContent    = fmtCur(t.grand);\n      if (document.getElementById('st_balance')) document.getElementById('st_balance').textContent = fmtCur(t.balance);"
);

// 4. editInvoice: restore advancePaid
text = text.replace(
  "set('transport',     inv.transport || '');\n      items = inv.items ? JSON.parse(JSON.stringify(inv.items)) : [];\n      var defaultGstForOlder = (inv.taxRate !== undefined && inv.taxRate !== null && parseFloat(inv.taxRate) > 0) ? parseFloat(inv.taxRate) : 5;\n      items.forEach(function(r) {",
  "set('transport',     inv.transport || '');\n      set('advancePaid',   inv.advancePaid || '');\n      items = inv.items ? JSON.parse(JSON.stringify(inv.items)) : [];\n      var defaultGstForOlder = (inv.taxRate !== undefined && inv.taxRate !== null && parseFloat(inv.taxRate) > 0) ? parseFloat(inv.taxRate) : 5;\n      items.forEach(function(r) {"
);

// 5. duplicateInvoice: restore advancePaid (second occurrence of same pattern with items.forEach)
// The duplicate uses the same lines - but it appears twice. Already fixed one above (editInvoice).
// Fix second occurrence:
text = text.replace(
  "set('transport',     inv.transport || '');\n      set('advancePaid',   inv.advancePaid || '');\n      items = inv.items ? JSON.parse(JSON.stringify(inv.items)) : [];\n      var defaultGstForOlder = (inv.taxRate !== undefined && inv.taxRate !== null && parseFloat(inv.taxRate) > 0) ? parseFloat(inv.taxRate) : 5;\n      items.forEach(function(r) {\n        var gst  = r.gstRate !== undefined && r.gstRate !== null ? parseFloat(r.gstRate) : defaultGstForOlder;\n        r.gstRate = gst;\n      });\n      rowCounter = items.length ? Math.max.apply(null, items.map(function(i) { return i.id || 0; })) : 0;\n      rebuildTable();\n      renderPreview();\n      previewCol.scrollTop = 0;\n      showToast(",
  "set('transport',     inv.transport || '');\n      set('advancePaid',   inv.advancePaid !== undefined ? inv.advancePaid : '');\n      items = inv.items ? JSON.parse(JSON.stringify(inv.items)) : [];\n      var defaultGstForOlder = (inv.taxRate !== undefined && inv.taxRate !== null && parseFloat(inv.taxRate) > 0) ? parseFloat(inv.taxRate) : 5;\n      items.forEach(function(r) {\n        var gst  = r.gstRate !== undefined && r.gstRate !== null ? parseFloat(r.gstRate) : defaultGstForOlder;\n        r.gstRate = gst;\n      });\n      rowCounter = items.length ? Math.max.apply(null, items.map(function(i) { return i.id || 0; })) : 0;\n      rebuildTable();\n      renderPreview();\n      previewCol.scrollTop = 0;\n      showToast("
);

// 6. clearForm: clear advancePaid
text = text.replace(
  "['refNo','custName','custAddr','custPhone','custState','custGstin','transport','payTerms','placeOfSupply'].forEach(function(id) { set(id, ''); });",
  "['refNo','custName','custAddr','custPhone','custState','custGstin','transport','advancePaid','payTerms','placeOfSupply'].forEach(function(id) { set(id, ''); });"
);

fs.writeFileSync('invoice.html', text, 'utf8');
console.log('Done!');
