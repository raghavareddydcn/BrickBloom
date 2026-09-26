const fs = require('fs');
let content = fs.readFileSync('invoice.html', 'utf8');

const newImage = \    async function saveAsImage() {
      var ok = await saveInvoice();
      if (!ok) return;
      var el  = document.getElementById('invoiceDoc');
      var ref = (v('refNo') || 'invoice').replace(/[\\\\/\\\\:]/g, '-');
      var cName = (v('custName') || 'customer').replace(/[^a-zA-Z0-9_\\\\-\\\\s]/g, '').trim().replace(/\\\\s+/g, '_');
      var filename = ref + '_' + cName + '.png';

      var col = document.querySelector('.preview-col');
      var oldMaxHeight = col.style.maxHeight;
      var oldOverflow = col.style.overflow;
      var oldPosition = col.style.position;
      col.style.maxHeight = 'none';
      col.style.overflow = 'visible';
      col.style.position = 'static';

      showToast('Generating high-res image...');
      
      setTimeout(function() {
        html2canvas(el, { scale: 2.5, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, windowHeight: el.scrollHeight + 100 })
          .then(function(canvas) {
            col.style.maxHeight = oldMaxHeight;
            col.style.overflow = oldOverflow;
            col.style.position = oldPosition;
            var a = document.createElement('a');
            a.download = filename;
            a.href = canvas.toDataURL('image/png');
            a.click();
            showToast('Image saved: ' + a.download);
          })
          .catch(function(err) { 
            console.error(err);
            col.style.maxHeight = oldMaxHeight;
            col.style.overflow = oldOverflow;
            col.style.position = oldPosition;
            showToast('Image export failed', 'err'); 
          });
      }, 150);
    }\;

content = content.replace(/async function saveAsImage\(\) \{[\s\S]*?\}(?=\s*\/\*.*PDF)/, newImage);

const newPdf = \sync function saveAsPdf() {
      var ok = await saveInvoice();
      if (!ok) return;
      var originalTitle = document.title;
      var ref = (v('refNo') || 'invoice').replace(/[\\\\/\\\\:]/g, '-');
      var cName = (v('custName') || 'customer').replace(/[^a-zA-Z0-9_\\\\-\\\\s]/g, '').trim().replace(/\\\\s+/g, '_');
      document.title = ref + '_' + cName;
      window.print();
      document.title = originalTitle;
    }\;

content = content.replace(/async function saveAsPdf\(\) \{[\s\S]*?\}(?=\s*\/\*.*Clear form)/, newPdf);

fs.writeFileSync('invoice.html', content, 'utf8');
