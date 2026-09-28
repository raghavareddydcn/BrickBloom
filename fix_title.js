const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

// Fix 1: Remove garbled char from title - replace with clean dash
text = text.replace('<title>BrickBloom \uFFFD Tax Invoice</title>', '<title>BrickBloom – Tax Invoice</title>');
// Also try other variants
text = text.replace('<title>BrickBloom ? Tax Invoice</title>', '<title>BrickBloom – Tax Invoice</title>');
// Regex fallback - replace anything between BrickBloom and Tax Invoice in title
text = text.replace(/<title>BrickBloom .{1,5} Tax Invoice<\/title>/, '<title>BrickBloom – Tax Invoice</title>');

// Fix 2: Add space between Balance Due label and Rs. in the preview
// Current: '<span class="inv-bal-v">Rs. ' 
// Should be fine already, but let me check the form sidebar balance label too
text = text.replace('id="st_balance" style="color:#86efac;font-weight:800;">Rs. 0.00</span>', 
                    'id="st_balance" style="color:#86efac;font-weight:800;letter-spacing:0.5px;">Rs. 0.00</span>');

// Fix 3: Ensure the Balance Due preview value has proper spacing
text = text.replace("'<span class=\"inv-bal-v\">Rs. ' + fmtN(t.balance) + '</span>'",
                    "'<span class=\"inv-bal-v\">Rs.\u00a0' + fmtN(t.balance) + '</span>'");

const titleIdx = text.indexOf('<title>');
console.log('Title now:', text.slice(titleIdx, titleIdx+60));

fs.writeFileSync('invoice.html', text, 'utf8');
console.log('Done');
