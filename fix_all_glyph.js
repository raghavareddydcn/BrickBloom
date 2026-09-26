const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

// Fix ALL garbled chars (U+FFFD replacement character) in visible text
// Replace the garbled dash in the address
text = text.replace('Karnataka \uFFFD 560049', 'Karnataka - 560049');

// Fix garbled chars used as fallback/placeholder values
text = text.replace("inv.refNo || '\uFFFD'", "inv.refNo || '-'");
text = text.replace("r.name || '\uFFFD'", "r.name || '-'");
text = text.replace("'BB/26-27/\uFFFD'", "'BB/26-27/-'");
text = text.replace("issueDate || '\uFFFD'", "issueDate || '-'");
text = text.replace("custAddr || '\uFFFD'", "custAddr || '-'");

// Fix garbled chars in comments (cosmetic, non-breaking)
text = text.replace("don't compress \uFFFD let preview-col scroll", "don't compress — let preview-col scroll");
text = text.replace("sum to 100%) \uFFFD renders reliably", "sum to 100%) — renders reliably");
text = text.replace("cloud \uFFFD same list on every device", "cloud — same list on every device");
text = text.replace("to the top \uFFFD preview-col is its own", "to the top — preview-col is its own");
text = text.replace("to the top \uFFFD same rationale as", "to the top — same rationale as");

// Fix the close button showing garbled char
text = text.replace('onclick="closeDrawer()">&#65533;</button>', 'onclick="closeDrawer()">✕</button>');
text = text.replace('onclick="closeDrawer()">\uFFFD</button>', 'onclick="closeDrawer()">✕</button>');

// Remove remaining U+FFFD from comment lines silently
text = text.replace(/\uFFFD/g, '—');

const count = (text.match(/\uFFFD/g) || []).length;
console.log('Remaining garbled chars:', count);

fs.writeFileSync('invoice.html', text, 'utf8');
console.log('invoice.html fixed');
