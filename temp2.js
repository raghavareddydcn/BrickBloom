
    /* ── Firebase ── */
    var firebaseConfig = {
      apiKey: "AIzaSyCE9R7HACDhgVG-WH7KANSRzyEfhXHg8BQ",
      authDomain: "brickbloom-invoices.firebaseapp.com",
      projectId: "brickbloom-invoices",
      storageBucket: "brickbloom-invoices.firebasestorage.app",
      messagingSenderId: "988743230343",
      appId: "1:988743230343:web:b2d850dd30c668e92ee922"
    };
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();

    /* ── State ── */
    var inventoryData = {};  // { productName: { stock, unit, lowStockThreshold, lastUpdated } }
    var productList   = [];  // ordered list of product names from 'products' collection
    var pendingChanges = {}; // tracks which rows have unsaved edits
    var currentFilterTab = 'all';
    var currentSearchText = '';
    var isEditMode = false;  // Default is View-Only mode

    /* ── Helpers ── */
    function showToast(msg, type) {
      var t = document.getElementById('toast');
      t.textContent = msg;
      t.className = 'toast show ' + (type || 'ok');
      clearTimeout(t._timer);
      t._timer = setTimeout(function() { t.className = 'toast'; }, 3500);
    }

    function fmtDate(iso) {
      if (!iso) return '-';
      var d = new Date(iso);
      return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit', hour:'2-digit', minute:'2-digit' });
    }

    function getBadge(stock, threshold) {
      stock = parseInt(stock) || 0;
      threshold = parseInt(threshold) || 10;
      if (stock <= 0)            return '<span class="status-badge badge-outstock">🔴 Out of Stock</span>';
      if (stock <= threshold)    return '<span class="status-badge badge-low">🟡 Low Stock</span>';
      return                            '<span class="status-badge badge-instock">🟢 In Stock</span>';
    }

    function updateSummaryCards() {
      var total = productList.length;
      var units = 0, low = 0, out = 0;
      productList.forEach(function(name) {
        var d = inventoryData[name] || {};
        var s = parseInt(d.stock) || 0;
        var t = parseInt(d.lowStockThreshold) || 10;
        units += s;
        if (s <= 0)    out++;
        else if (s <= t) low++;
      });
      document.getElementById('sc-total').textContent = total;
      document.getElementById('sc-units').textContent = units.toLocaleString('en-IN');
      document.getElementById('sc-low').textContent   = low;
      document.getElementById('sc-out').textContent   = out;
    }

    /* ── Toggle Edit Mode ── */
    function toggleEditMode() {
      isEditMode = !isEditMode;
      var toggleBtn = document.getElementById('modeToggleBtn');
      var saveBtn   = document.getElementById('saveAllBtn');
      var badge     = document.getElementById('modeBadge');
      var mBar      = document.getElementById('mobileBottomBar');

      if (isEditMode) {
        toggleBtn.innerHTML = '👁️ Done Editing (View Mode)';
        toggleBtn.style.background = '#334155';
        saveBtn.style.display = 'inline-flex';
        badge.className = 'mode-badge edit-mode';
        badge.textContent = '✏️ Edit Mode';
        if (window.innerWidth <= 768) mBar.style.display = 'flex';
      } else {
        toggleBtn.innerHTML = '✏️ Edit Inventory';
        toggleBtn.style.background = 'var(--slate-900)';
        saveBtn.style.display = 'none';
        badge.className = 'mode-badge view-mode';
        badge.textContent = '👁️ View Mode';
        mBar.style.display = 'none';
      }
      renderTable();
    }

    /* ── Filter Tabs & Search ── */
    function setFilterTab(tab) {
      currentFilterTab = tab;
      document.querySelectorAll('.filter-tab').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.tab === tab);
      });
      renderTable();
    }

    function handleSearch(val) {
      currentSearchText = val || '';
      renderTable();
    }

    /* ── Render Table (View vs Edit Mode) ── */
    function renderTable() {
      var thead = document.getElementById('invTableHeader');
      var tbody = document.getElementById('invTableBody');
      var rows  = '';

      // Set headers based on mode
      if (isEditMode) {
        thead.innerHTML = '<tr>' +
          '<th>#</th>' +
          '<th>Product Name</th>' +
          '<th>Unit</th>' +
          '<th>Stock on Hand</th>' +
          '<th>Quick Adjust</th>' +
          '<th>Low Stock Alert</th>' +
          '<th>Status</th>' +
          '<th>Last Updated</th>' +
        '</tr>';
      } else {
        thead.innerHTML = '<tr>' +
          '<th>#</th>' +
          '<th>Product Name</th>' +
          '<th>Stock Level</th>' +
          '<th>Status</th>' +
          '<th>Last Updated</th>' +
        '</tr>';
      }

      var filtered = productList.filter(function(name) {
        var d      = inventoryData[name] || {};
        var stock  = parseInt(d.stock) || 0;
        var thresh = parseInt(d.lowStockThreshold) || 10;

        var matchesSearch = !currentSearchText || name.toLowerCase().includes(currentSearchText.toLowerCase());
        if (!matchesSearch) return false;

        if (currentFilterTab === 'instock') return stock > thresh;
        if (currentFilterTab === 'low')     return stock > 0 && stock <= thresh;
        if (currentFilterTab === 'out')     return stock <= 0;

        return true;
      });

      if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">🔍</div><p>No matching products found</p></div></td></tr>';
        return;
      }

      filtered.forEach(function(name, idx) {
        var d      = inventoryData[name] || { stock: 0, unit: 'pcs', lowStockThreshold: 10, lastUpdated: null };
        var stock  = parseInt(d.stock) || 0;
        var unit   = d.unit || 'pcs';
        var thresh = parseInt(d.lowStockThreshold) || 10;

        if (isEditMode) {
          // ✏️ EDIT MODE ROW
          rows += '<tr data-name="' + escAttr(name) + '">' +
            '<td><span class="item-num">#' + (idx + 1) + '</span></td>' +
            '<td>' +
              '<span class="prod-name">' + escH(name) + '</span>' +
              '<div class="m-badge-wrap">' + getBadge(stock, thresh) + '</div>' +
            '</td>' +
            '<td>' +
              '<select class="unit-select" data-name="' + escAttr(name) + '" onchange="markChanged(this)">' +
                ['pcs','bags','kgs','boxes','sets','rolls'].map(function(u) {
                  return '<option value="' + u + '"' + (unit === u ? ' selected' : '') + '>' + u + '</option>';
                }).join('') +
              '</select>' +
            '</td>' +
            '<td>' +
              '<input class="stock-input" type="number" inputmode="numeric" min="0" value="' + stock + '" ' +
                'data-name="' + escAttr(name) + '" ' +
                'oninput="markChanged(this); updateRowBadge(this)" />' +
            '</td>' +
            '<td>' +
              '<div class="adj-btns">' +
                '<button class="adj-btn plus"  onclick="adjustStock(\'' + escAttr(name) + '\', +1)">+1</button>' +
                '<button class="adj-btn plus"  onclick="adjustStock(\'' + escAttr(name) + '\', +5)">+5</button>' +
                '<button class="adj-btn plus"  onclick="adjustStock(\'' + escAttr(name) + '\', +10)">+10</button>' +
                '<button class="adj-btn minus" onclick="adjustStock(\'' + escAttr(name) + '\', -1)">−1</button>' +
                '<button class="adj-btn minus" onclick="adjustStock(\'' + escAttr(name) + '\', -5)">−5</button>' +
              '</div>' +
            '</td>' +
            '<td>' +
              '<input class="threshold-input" type="number" inputmode="numeric" min="0" value="' + thresh + '" ' +
                'data-name="' + escAttr(name) + '" ' +
                'oninput="markChanged(this); updateRowBadge(this)" />' +
            '</td>' +
            '<td class="badge-cell-' + cssId(name) + '">' + getBadge(stock, thresh) + '</td>' +
            '<td class="last-updated">' + fmtDate(d.lastUpdated) + '</td>' +
          '</tr>';
        } else {
          // 👁️ VIEW MODE ROW (Clean & Read-only)
          rows += '<tr data-name="' + escAttr(name) + '">' +
            '<td><span class="item-num">#' + (idx + 1) + '</span></td>' +
            '<td>' +
              '<span class="prod-name">' + escH(name) + '</span>' +
              '<div class="m-badge-wrap">' + getBadge(stock, thresh) + '</div>' +
            '</td>' +
            '<td>' +
              '<span class="view-stock-val">' + stock.toLocaleString('en-IN') + '</span>' +
              '<span class="view-unit-val">' + escH(unit) + '</span>' +
            '</td>' +
            '<td class="badge-cell-' + cssId(name) + '">' + getBadge(stock, thresh) + '</td>' +
            '<td class="last-updated">' + fmtDate(d.lastUpdated) + '</td>' +
          '</tr>';
        }
      });

      tbody.innerHTML = rows;
    }

    function cssId(name) { return name.replace(/[^a-z0-9]/gi, '_'); }
    function escH(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function escAttr(s) { return String(s).replace(/'/g,'&#39;').replace(/"/g,'&quot;'); }

    function markChanged(el) {
      el.classList.add('changed');
      pendingChanges[el.dataset.name] = true;
      var count = Object.keys(pendingChanges).length;
      var text = '💾 Save All Changes (' + count + ')';
      document.getElementById('saveAllBtn').textContent = text;
      document.getElementById('mSaveBtn').textContent = text;
      document.getElementById('mChangesText').textContent = count + ' item' + (count > 1 ? 's' : '') + ' modified';
    }

    function updateRowBadge(el) {
      var name = el.dataset.name;
      var row = document.querySelector('[data-name="' + name + '"]');
      if (!row) return;
      var stockInput = row.querySelector('.stock-input');
      var threshInput = row.querySelector('.threshold-input');
      var badgeCell   = row.querySelector('td:nth-child(7)');
      var mBadgeCell  = row.querySelector('.m-badge-wrap');

      var badgeHtml = getBadge(
        parseInt(stockInput ? stockInput.value : 0),
        parseInt(threshInput ? threshInput.value : 10)
      );

      if (badgeCell) badgeCell.innerHTML = badgeHtml;
      if (mBadgeCell) mBadgeCell.innerHTML = badgeHtml;

      updateSummaryCards();
    }

    function adjustStock(name, delta) {
      var rows = document.querySelectorAll('[data-name="' + name + '"]');
      rows.forEach(function(row) {
        var input = row.querySelector('.stock-input');
        if (input) {
          var newVal = Math.max(0, parseInt(input.value || 0) + delta);
          input.value = newVal;
          markChanged(input);
          updateRowBadge(input);
        }
      });
    }

    /* ── Load Data ── */
    async function loadInventory() {
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
          '<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Failed to load inventory.</p></div></td></tr>';
        showToast('❌ Failed to load inventory', 'err');
      }
    }

    /* ── Save All Changes ── */
    async function saveAll() {
      var rows = document.querySelectorAll('#invTableBody tr[data-name]');
      var batch = db.batch();
      var count = 0;

      document.getElementById('spinnerOverlay').classList.add('show');

      try {
        rows.forEach(function(row) {
          var name        = row.getAttribute('data-name');
          var stockInput  = row.querySelector('.stock-input');
          var unitSelect  = row.querySelector('.unit-select');
          var threshInput = row.querySelector('.threshold-input');
          if (!name || !stockInput) return;

          var stock  = Math.max(0, parseInt(stockInput.value) || 0);
          var unit   = unitSelect ? unitSelect.value : 'pcs';
          var thresh = Math.max(0, parseInt(threshInput ? threshInput.value : 10) || 10);
          var now    = new Date().toISOString();

          batch.set(db.collection('products').doc(name), {
            stock:              stock,
            unit:               unit,
            lowStockThreshold:  thresh,
            lastUpdated:        now
          }, { merge: true });

          inventoryData[name] = { stock, unit, lowStockThreshold: thresh, lastUpdated: now };
          count++;
        });

        await batch.commit();
        pendingChanges = {};
        var text = '💾 Save All Changes';
        document.getElementById('saveAllBtn').textContent = text;
        document.getElementById('mSaveBtn').textContent = text;
        document.getElementById('mChangesText').textContent = 'No changes';
        
        // Switch back to view mode after saving
        isEditMode = false;
        document.getElementById('modeToggleBtn').innerHTML = '✏️ Edit Inventory';
        document.getElementById('modeToggleBtn').style.background = 'var(--slate-900)';
        document.getElementById('saveAllBtn').style.display = 'none';
        document.getElementById('modeBadge').className = 'mode-badge view-mode';
        document.getElementById('modeBadge').textContent = '👁️ View Mode';
        document.getElementById('mobileBottomBar').style.display = 'none';

        renderTable();
        updateSummaryCards();
        showToast('✅ Inventory saved — ' + count + ' products updated', 'ok');
      } catch(e) {
        console.error(e);
        showToast('❌ Save failed — ' + e.message, 'err');
      } finally {
        document.getElementById('spinnerOverlay').classList.remove('show');
      }
    }

    /* ── Logout ── */
    function logout() {
      sessionStorage.removeItem('bb_admin');
      window.location.href = '/admin';
    }

    /* ── Init ── */
    loadInventory();

    window.addEventListener('beforeunload', function(e) {
      if (Object.keys(pendingChanges).length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  