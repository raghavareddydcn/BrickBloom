const fs = require('fs');
let text = fs.readFileSync('inventory.html', 'utf8');

// Replace slate-100 body bg with the warm cream invoice background
text = text.replace(
  'body {\n      font-family: var(--font-sans);\n      background: var(--slate-100);\n      color: var(--slate-800);\n      min-height: 100vh;\n    }',
  'body {\n      font-family: var(--font-sans);\n      background: #f0e1c2;\n      color: var(--slate-800);\n      min-height: 100vh;\n    }'
);

// Make the page cards match the warm invoice cream feel
// Table card and summary cards get warm white
text = text.replace(
  '.summary-card {\n      background: white;',
  '.summary-card {\n      background: #fdf6ec;'
);
text = text.replace(
  '.table-card {\n      background: white;',
  '.table-card {\n      background: #fdf6ec;'
);
// Table header bg
text = text.replace(
  'background: var(--slate-50);',
  'background: #f5e9d5;'
);
// Table toolbar
text = text.replace(
  '.table-toolbar {\n      padding: 16px 20px;\n      border-bottom: 1px solid var(--slate-100);',
  '.table-toolbar {\n      padding: 16px 20px;\n      border-bottom: 1px solid #e8d5b5;'
);
// Table row hover
text = text.replace(
  ".inv-table tr:hover td { background: var(--slate-50); }",
  ".inv-table tr:hover td { background: #f5e9d5; }"
);
// Table row border
text = text.replace(
  'border-bottom: 1px solid var(--slate-100);',
  'border-bottom: 1px solid #eddfc5;'
);

console.log('inventory.html background updated');
fs.writeFileSync('inventory.html', text, 'utf8');
