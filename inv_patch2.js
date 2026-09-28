const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

// 1. Add Advance Paid + Balance Due rows in the invoice preview after Total Payable grand-row
text = text.replace(
  "'<div class=\"inv-grand-row\">' +\n              '<span class=\"inv-grand-k\">Total Payable</span>' +\n              '<span class=\"inv-grand-v\">Rs. ' + fmtN(t.grand) + '</span>' +\n            '</div>' +",
  "'<div class=\"inv-grand-row\">' +\n              '<span class=\"inv-grand-k\">Total Payable</span>' +\n              '<span class=\"inv-grand-v\">Rs. ' + fmtN(t.grand) + '</span>' +\n            '</div>' +\n            (t.advancePaid > 0 ? '<div class=\"inv-advance-row\">' +\n              '<span class=\"inv-adv-k\">Advance Paid</span>' +\n              '<span class=\"inv-adv-v\">Rs. ' + fmtN(t.advancePaid) + '</span>' +\n            '</div>' +\n            '<div class=\"inv-balance-row\">' +\n              '<span class=\"inv-bal-k\">Balance Due</span>' +\n              '<span class=\"inv-bal-v\">Rs. ' + fmtN(t.balance) + '</span>' +\n            '</div>' : '') +"
);

// 2. Add inventory auto-deduct inside saveInvoice — after the Firestore invoicesCol.doc(data.id).set(data) call
// Find the saveInvoice function and add deduction logic
const SAVE_MATCH = "showToast(isUpdate ? '✅ Invoice updated: ' + data.refNo : '✅ Invoice saved: ' + data.refNo);";
const SAVE_REPLACE = "showToast(isUpdate ? '✅ Invoice updated: ' + data.refNo : '✅ Invoice saved: ' + data.refNo);\n      // Auto-deduct inventory for each line item\n      if (data.items && data.items.length > 0) {\n        var invBatch = db.batch();\n        data.items.forEach(function(item) {\n          if (!item.name || item.name === 'Packing') return;\n          var qty = parseFloat(item.qty) || 0;\n          if (qty <= 0) return;\n          var invRef = db.collection('inventory').doc(item.name);\n          invBatch.set(invRef, {\n            name: item.name,\n            stock: firebase.firestore.FieldValue.increment(-qty),\n            lastUpdated: new Date().toISOString()\n          }, { merge: true });\n        });\n        invBatch.commit().catch(function(e) { console.warn('Inventory deduct failed:', e); });\n      }";
text = text.replace(SAVE_MATCH, SAVE_REPLACE);

fs.writeFileSync('invoice.html', text, 'utf8');
console.log('Done!');
