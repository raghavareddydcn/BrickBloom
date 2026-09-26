const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

// ISSUE 1: Fix the inv-grand-row so label and value are same visual weight
// Change: tiny all-caps label vs big mono value → make both proportional
const cssOld = "    .inv-grand-k { font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; opacity: 0.9; }\r\n    .inv-grand-v { font-size: 20px; font-weight: 800; font-family: var(--font-mono); }";
const cssNew = "    .inv-grand-k { font-size: 13px; font-weight: 700; letter-spacing: 0.3px; opacity: 0.9; }\r\n    .inv-grand-v { font-size: 18px; font-weight: 800; font-family: var(--font-mono); letter-spacing: 0.5px; }";
text = text.replace(cssOld, cssNew);

// ISSUE 2: Fix the advance/balance rows in the PREVIEW (they got placed outside the fin-right div)
// The correct place is: right after </div> of inv-grand-row, BEFORE the closing </div> of inv-fin-right
const previewOld = "'<div class=\"inv-grand-row\">' +\n              '<span class=\"inv-grand-k\">Total Payable</span>' +\n              '<span class=\"inv-grand-v\">Rs. ' + fmtN(t.grand) + '</span>' +\n            '</div>' +\n          '</div>' +\n        '</div>' +\n\n        /* FOOTER";
const previewNew = "'<div class=\"inv-grand-row\">' +\n              '<span class=\"inv-grand-k\">Total Payable</span>' +\n              '<span class=\"inv-grand-v\">Rs. ' + fmtN(t.grand) + '</span>' +\n            '</div>' +\n            (t.advancePaid > 0 ?\n              '<div class=\"inv-advance-row\">' +\n                '<span class=\"inv-adv-k\">Advance Paid</span>' +\n                '<span class=\"inv-adv-v\">Rs. ' + fmtN(t.advancePaid) + '</span>' +\n              '</div>' +\n              '<div class=\"inv-balance-row\">' +\n                '<span class=\"inv-bal-k\">Balance Due</span>' +\n                '<span class=\"inv-bal-v\">Rs. ' + fmtN(t.balance) + '</span>' +\n              '</div>'\n            : '') +\n          '</div>' +\n        '</div>' +\n\n        /* FOOTER";

if (text.includes(previewOld)) {
  text = text.replace(previewOld, previewNew);
  console.log('Preview advance/balance: OK');
} else {
  console.log('Preview section NOT FOUND');
}

if (text.includes(cssOld.replace(/\r\n/g,'\n'))) {
  console.log('CSS fix also needed with LF variant');
}

fs.writeFileSync('invoice.html', text, 'utf8');
console.log('Done.');
