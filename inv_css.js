const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

const cssOld = ".inv-grand-k { font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; opacity: 0.9; }\r\n    .inv-grand-v { font-size: 20px; font-weight: 800; font-family: var(--font-mono); }";
const cssNew = ".inv-grand-k { font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; opacity: 0.9; }\r\n    .inv-grand-v { font-size: 20px; font-weight: 800; font-family: var(--font-mono); }\r\n    .inv-advance-row {\r\n      display: flex; justify-content: space-between; align-items: center;\r\n      padding: 6px 14px; background: rgba(245,158,11,0.1);\r\n      border: 1px dashed rgba(245,158,11,0.5); border-radius: 8px; margin-top: 6px;\r\n    }\r\n    .inv-adv-k { font-size: 11px; font-weight: 700; color: #92400e; letter-spacing: 0.5px; }\r\n    .inv-adv-v { font-size: 15px; font-weight: 700; color: #92400e; font-family: var(--font-mono); }\r\n    .inv-balance-row {\r\n      display: flex; justify-content: space-between; align-items: center;\r\n      padding: 8px 14px; background: linear-gradient(135deg, #1e3a5f, #1d4ed8);\r\n      border-radius: 8px; margin-top: 4px;\r\n    }\r\n    .inv-bal-k { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.85); letter-spacing: 1px; text-transform: uppercase; }\r\n    .inv-bal-v { font-size: 20px; font-weight: 800; color: #93c5fd; font-family: var(--font-mono); }";

if (text.includes(cssOld)) {
  text = text.replace(cssOld, cssNew);
  fs.writeFileSync('invoice.html', text, 'utf8');
  console.log('CSS added OK');
} else {
  console.log('NOT FOUND — searching...');
  const idx = text.indexOf('.inv-grand-k');
  console.log('Found at index:', idx, '— context:', text.slice(idx, idx+120).replace(/\r\n/g,'|'));
}
