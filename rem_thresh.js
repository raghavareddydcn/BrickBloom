const fs = require('fs');
let text = fs.readFileSync('inventory.html', 'utf8');

// Replace view mode header in renderTable
const oldHeader = "        thead.innerHTML = '<tr>' +\r\n          '<th>#</th>' +\r\n          '<th>Product Name</th>' +\r\n          '<th>Stock Level</th>' +\r\n          '<th>Low Stock Threshold</th>' +\r\n          '<th>Status</th>' +\r\n          '<th>Last Updated</th>' +\r\n        '</tr>';";

const newHeader = "        thead.innerHTML = '<tr>' +\r\n          '<th>#</th>' +\r\n          '<th>Product Name</th>' +\r\n          '<th>Stock Level</th>' +\r\n          '<th>Status</th>' +\r\n          '<th>Last Updated</th>' +\r\n        '</tr>';";

text = text.replace(oldHeader, newHeader);
text = text.replace(oldHeader.replace(/\r\n/g, '\n'), newHeader.replace(/\r\n/g, '\n'));

// Replace view mode row in renderTable
const oldRow = "'<td style=\"color:var(--slate-600);font-size:13px;\">Alert at \\u2264 ' + thresh + ' ' + escH(unit) + '</td>' +";

if (text.includes("Alert at ≤ ' + thresh")) {
  text = text.replace(/<td style="color:var\(--slate-600\);font-size:13px;">Alert at \u2264 ' \+ thresh \+ ' ' \+ escH\(unit\) \+ '<\/td>' \+\s*/g, "");
  text = text.replace(/<td style="color:var\(--slate-600\);font-size:13px;">Alert at ≤ ' \+ thresh \+ ' ' \+ escH\(unit\) \+ '<\/td>' \+\s*/g, "");
}

fs.writeFileSync('inventory.html', text, 'utf8');
console.log('Removed Low Stock Threshold from View Mode.');
