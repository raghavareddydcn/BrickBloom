const fs = require('fs');
let text = fs.readFileSync('inventory.html', 'utf8');

const oldLoad = `    async function loadInventory() {
      try {
        // Load products list
        var prodSnap = await db.collection('products').get();
        productList = [];
        prodSnap.forEach(function(doc) { productList.push(doc.data().name || doc.id); });
        productList.sort();

        // Load inventory
        var invSnap = await db.collection('products').get();
        inventoryData = {};
        invSnap.forEach(function(doc) {
          inventoryData[doc.id] = doc.data();
        });

        // Init any missing products with stock = 0
        productList.forEach(function(name) {
          if (!inventoryData[name]) {
            inventoryData[name] = { stock: 0, unit: 'pcs', lowStockThreshold: 10, lastUpdated: null };
          }
        });

        renderTable();
        updateSummaryCards();
      } catch(e) {
        console.error(e);
        document.getElementById('invTableBody').innerHTML =
          '<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Failed to load. Check your connection.</p></div></td></tr>';
        showToast('❌ Failed to load inventory', 'err');
      }
    }`;

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

// Normalize line endings for replacement
const normalize = str => str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
let found = false;
if (text.includes(oldLoad)) {
    text = text.replace(oldLoad, newLoad);
    found = true;
} else if (normalize(text).includes(normalize(oldLoad))) {
    // Regex replace using a more flexible pattern
    const regex = /async function loadInventory\(\) \{[\s\S]*?showToast\('❌ Failed to load inventory', 'err'\);\s*\}/;
    text = text.replace(regex, newLoad);
    found = true;
}

// Remove garbled comment characters ("?"?)
text = text.replace(/"\?"\?/g, '');
text = text.replace(//g, '');

fs.writeFileSync('inventory.html', text, 'utf8');
console.log('loadInventory fixed:', found);
