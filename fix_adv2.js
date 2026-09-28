const fs=require('fs');
let text=fs.readFileSync('invoice.html','utf8');

// Fix 1: CSS - make Total Payable label and value consistent
// The CSS was already updated in previous run (13px/700 and 18px/800)
// Verify:
const hasCssFixed = text.includes('.inv-grand-k { font-size: 13px; font-weight: 700;');
console.log('CSS fixed:', hasCssFixed);

// Fix 2: Insert advance/balance into the preview after Total Payable grand-row
// Exact string from the file (with \r\n):
const OLD = "'<div class=\"inv-grand-row\">' +\r\n              '<span class=\"inv-grand-k\">Total Payable</span>' +\r\n              '<span class=\"inv-grand-v\">Rs. ' + fmtN(t.grand) + '</span>' +\r\n            '</div>' +\r\n          '</div>' +\r\n        '</div>' +\r\n\r\n        /* FOOTER: Terms + Signature */";

const NEW = "'<div class=\"inv-grand-row\">' +\r\n              '<span class=\"inv-grand-k\">Total Payable</span>' +\r\n              '<span class=\"inv-grand-v\">Rs. ' + fmtN(t.grand) + '</span>' +\r\n            '</div>' +\r\n            (t.advancePaid > 0 ?\r\n              '<div class=\"inv-advance-row\">' +\r\n                '<span class=\"inv-adv-k\">Advance Paid</span>' +\r\n                '<span class=\"inv-adv-v\">(\u2212) Rs. ' + fmtN(t.advancePaid) + '</span>' +\r\n              '</div>' +\r\n              '<div class=\"inv-balance-row\">' +\r\n                '<span class=\"inv-bal-k\">Balance Due</span>' +\r\n                '<span class=\"inv-bal-v\">Rs. ' + fmtN(t.balance) + '</span>' +\r\n              '</div>'\r\n            : '') +\r\n          '</div>' +\r\n        '</div>' +\r\n\r\n        /* FOOTER: Terms + Signature */";

if (text.includes(OLD)) {
  text = text.replace(OLD, NEW);
  console.log('Preview advance/balance: INSERTED OK');
} else {
  console.log('Preview OLD string NOT FOUND - trying LF variant');
  const OLD2 = OLD.replace(/\r\n/g, '\n');
  if (text.includes(OLD2)) {
    text = text.replace(OLD2, NEW.replace(/\r\n/g,'\n'));
    console.log('Preview advance/balance (LF): INSERTED OK');
  } else {
    console.log('STILL NOT FOUND');
  }
}

fs.writeFileSync('invoice.html', text, 'utf8');
