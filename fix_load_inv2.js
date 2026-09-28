const fs = require('fs');
let text = fs.readFileSync('inventory.html', 'utf8');

const newLoad = `    async function loadInventory() {
      try {
        var prodSnap = await db.collection('products').get();
        productList = [];
        inventoryData = {};

        prodSnap.forEach(function(doc) {
          var d = doc.data();
          var name = d.name || doc.id;
          productList.push(name);
          inventoryData[name] = {
            stock:             d.stock !== undefined ? d.stock : 0,
            unit:              d.unit || 'pcs',
            lowStockThreshold: d.lowStockThreshold !== undefined ? d.lowStockThreshold : 10,
            lastUpdated:       d.lastUpdated || null
          };
        });

        productList.sort();
        renderTable();
        updateSummaryCards();
      } catch(e) {
        console.error(e);
        document.getElementById('invTableBody').innerHTML =
          '<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Failed to load.</p></div></td></tr>';
        showToast('❌ Failed to load inventory', 'err');
      }
    }`;

const regex = /async function loadInventory\(\) \{[\s\S]*?showToast\('❌ Failed to load inventory', 'err'\);\s*\}/;
text = text.replace(regex, newLoad);

// Fix garbled empty date format string U+FFFD or similar
text = text.replace(/if \(!iso\) return '[^']+';/, "if (!iso) return '-';");

fs.writeFileSync('inventory.html', text, 'utf8');
console.log('Fixed loadInventory and date formatter');
