const fs = require('fs');
let html = fs.readFileSync('inventory.html', 'utf8');
let js2 = html.split('<script>')[2].split('</script>')[0];
fs.writeFileSync('temp2.js', js2);
