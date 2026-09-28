const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

// Also fix adv (advance) value spacing for consistency
text = text.replace("'<span class=\"inv-adv-v\">(−) Rs. ' + fmtN(t.advancePaid) + '</span>'",
                    "'<span class=\"inv-adv-v\">(−) Rs.\u00a0' + fmtN(t.advancePaid) + '</span>'");

// Fix the Total Payable Rs. spacing in preview too
text = text.replace("'<span class=\"inv-grand-v\">Rs. ' + fmtN(t.grand) + '</span>'",
                    "'<span class=\"inv-grand-v\">Rs.\u00a0' + fmtN(t.grand) + '</span>'");

// Fix all other Rs. in preview string concatenations to have non-breaking space
// sum rows
text = text.replace(/'>Rs\. ' \+ fmtN/g, "'>Rs.\u00a0' + fmtN");

// Verify title one more time
const ti = text.indexOf('<title>');
console.log('Title:', text.slice(ti, ti+55));

fs.writeFileSync('invoice.html', text, 'utf8');
console.log('Done');
