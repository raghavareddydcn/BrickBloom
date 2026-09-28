const fs=require('fs');
const t=fs.readFileSync('invoice.html','utf8');
const idx=t.indexOf('inv-grand-row\">');
const chunk=t.slice(idx,idx+600);
console.log(JSON.stringify(chunk));
