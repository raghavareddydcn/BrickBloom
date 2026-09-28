const fs = require('fs');
let text = fs.readFileSync('inventory.html', 'utf8');

// Replace all db.collection('inventory') with db.collection('products')
text = text.split("db.collection('inventory')").join("db.collection('products')");

// Also fix the loadInventory function - it currently loads products separately then inventory
// Merge into one: load products collection which now has both price data AND stock data
const oldLoad = `    async function loadInventory() {
      try {
        // Load products list
        var prodSnap = await db.collection('products').get();
        productList = [];
        prodSnap.forEach(function(doc) { productList.push(doc.data().name || doc.id); });
        productList.sort();

        // Load inventory
        var invSnap = await db.collection('inventory').get();
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
        // Single collection fetch — products has both catalog & stock fields
        var prodSnap = await db.collection('products').get();
        productList = [];
        inventoryData = {};

        prodSnap.forEach(function(doc) {
          var d = doc.data();
          var name = d.name || doc.id;
          productList.push(name);
          inventoryData[name] = {
            stock:             d.stock !== undefined ? d.stock : 0,
            unit:              d.unit  || 'pcs',
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
          '<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Failed to load. Check your connection.</p></div></td></tr>';
        showToast('❌ Failed to load inventory', 'err');
      }
    }`;

text = text.replace(oldLoad, newLoad);
console.log('loadInventory updated:', !text.includes(oldLoad));

// Fix saveAll: use merge:true so we dont overwrite price/gstRate fields
const oldSet = `batch.set(db.collection('products').doc(name), {
            name:               name,
            stock:              stock,
            unit:               unit,
            lowStockThreshold:  thresh,
            lastUpdated:        now
          });`;
const newSet = `batch.set(db.collection('products').doc(name), {
            stock:              stock,
            unit:               unit,
            lowStockThreshold:  thresh,
            lastUpdated:        now
          }, { merge: true });`;  // merge:true preserves price/gstRate fields

text = text.replace(oldSet, newSet);
console.log('saveAll merge updated:', !text.includes(oldSet));

fs.writeFileSync('inventory.html', text, 'utf8');
console.log('inventory.html done');
