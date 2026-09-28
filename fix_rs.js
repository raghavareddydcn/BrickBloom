const fs = require('fs');
let text = fs.readFileSync('invoice.html', 'utf8');

// The user says "rupee symbol is not clear", so we change to "Rs. " which is universally clear and standard.
text = text.replace(/Price \?/g, 'Price (Rs.)');
text = text.replace(/Rate \(\?\)/g, 'Rate (Rs.)');
text = text.replace(/Total \(\?\)/g, 'Total (Rs.)');
text = text.replace(/Transport \/ Delivery \(\?\)/g, 'Transport / Delivery (Rs.)');

// Replace >? 0.00< with >Rs. 0.00<
text = text.replace(/>\? 0\.00</g, '>Rs. 0.00<');
text = text.replace(/>₹ 0\.00</g, '>Rs. 0.00<');

// Replace all '? ' in string concats
text = text.replace(/'>\? '/g, "'>Rs. '");
text = text.replace(/'\? '/g, "'Rs. '");
text = text.replace(/'₹ '/g, "'Rs. '");

// Fix the specific lines that failed previously due to bad regex escaping
text = text.replace(/<span class="inv-sum-v">\? '/g, '<span class="inv-sum-v">Rs. \'');
text = text.replace(/<span class="inv-meta-v">\? '/g, '<span class="inv-meta-v">Rs. \'');
text = text.replace(/<span class="inv-grand-v">\? '/g, '<span class="inv-grand-v">Rs. \'');
text = text.replace(/<div class="isc-total">\? '/g, '<div class="isc-total">Rs. \'');

// Also catch the ones I already fixed to ₹ and change to Rs.
text = text.replace(/<span class="inv-sum-v">₹ '/g, '<span class="inv-sum-v">Rs. \'');
text = text.replace(/<span class="inv-meta-v">₹ '/g, '<span class="inv-meta-v">Rs. \'');
text = text.replace(/<span class="inv-grand-v">₹ '/g, '<span class="inv-grand-v">Rs. \'');
text = text.replace(/<div class="isc-total">₹ '/g, '<div class="isc-total">Rs. \'');

// And the table headers
text = text.replace(/Price ₹/g, 'Price (Rs.)');
text = text.replace(/Rate \(₹\)/g, 'Rate (Rs.)');
text = text.replace(/Total \(₹\)/g, 'Total (Rs.)');
text = text.replace(/Transport \/ Delivery \(₹\)/g, 'Transport / Delivery (Rs.)');

fs.writeFileSync('invoice.html', text, 'utf8');
