const fs=require('fs');
const t=fs.readFileSync('invoice.html','utf8');
const idx=t.indexOf('inv-grand-row\">');
console.log(t.slice(idx,idx+800));
