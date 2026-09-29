# BrickBloom legacy invoice contract

Source of truth: `public/invoice.html`. This reference describes the observable business rules that the React workspace must retain.

## Data and catalog

Invoices are stored as Firestore documents in `invoices/{id}`. Their shape is `id`, `refNo`, `issueDate`, `payTerms`, `placeOfSupply`, `custName`, `custAddr`, `custPhone`, `custState`, `custGstin`, `items`, `transport`, `advancePaid`, `taxRate`, and `savedAt`. Existing records may omit per-item `gstRate`; use the invoice tax rate when positive, otherwise 5.

Use Firestore `products` as the catalog. If it is empty, seed these defaults (price tiers are 1, 50, and 100 units):

| Product | 1 | 50 | 100 | GST |
| --- | ---: | ---: | ---: | ---: |
| 2 Inch Pot | 25 | 22 | 20 | 5 |
| 3 inch Pot | 40 | 30 | 25 | 5 |
| 4 inch Pot | 50 | 35 | 30 | 5 |
| 6 inch Pot Std | 60 | 50 | 45 | 5 |
| 6 inch Pot Heavy | 70 | 50 | 45 | 5 |
| 8 Inch Pot | 80 | 60 | 50 | 5 |
| Hangeer for 8 inch | 150 | 140 | 120 | 5 |
| 50 mm Disc | 15 | 12 | 10 | 5 |
| 100 mm Disc | 0 | 0 | 0 | 5 |
| 650 Gm Bric | 99 | 89 | 79 | 5 |
| 5Kg Block | 300 | 269 | 249 | 5 |
| Pole 1 Feet | 0 | 0 | 0 | 5 |
| Ready Pot | 149 | 135 | 129 | 5 |
| Starter Kit | 159 | 145 | 139 | 5 |
| Medium Kit | 249 | 235 | 229 | 5 |
| Premium Kit | 699 | 659 | 649 | 5 |
| Ready pot With Out Plant | 130 | 119 | 99 | 5 |
| Packing Box | 100 | 100 | 100 | 0 |

Synchronize `Packing Box` as an available catalog record. The tier price is price100 when quantity is at least 100 and nonzero; otherwise price50 when quantity is at least 50 and nonzero; otherwise price1 when nonzero. Missing/zero selected prices must not overwrite a manually entered price.

## Item, tax, and validation rules

Start each invoice with one blank product row and a pinned `Packing Box` row. Insert added product rows before packing. Packing cannot be removed. When all normal rows are removed, restore one blank normal row plus packing. Product change applies its tier price and default GST; custom products are saved to the catalog.

Supported GST rates are 0, 5, 12, and 18. Each line taxable value is `qty * price`; line tax is taxable value times GST divided by 100. Grand total is subtotal plus tax plus transport. Advance paid is shown separately and balance is never negative.

Saving requires an invoice reference and should reject malformed numeric inputs. Customer and delivery fields, payment terms, issue date, and place of supply must be preserved when editing or duplicating. A duplicate gets a new ID, today’s issue date, and a newly suggested reference.

Classify a line as non-inventory when its normalized name is empty; begins with `packing`; matches packing, handling, transportation, shipping, delivery, freight, or courier charges; or contains common compound packing-and-handling variants. Non-inventory lines never change product stock.

## Numbering and stock

Invoice references use `BB/YY-YY/NNN`, where the financial year starts on 1 April. A visible suggested number does not reserve it. On first save, use a Firestore transaction on `counters/{financialYear}` to claim the next number, considering both the counter and existing invoice references. User-supplied references outside this pattern remain untouched.

For a new invoice decrement each inventory product stock by its line quantity. For an edit, calculate `new quantity - old quantity` per inventory product and decrement stock by that delta. Deleting restores stock by each inventory line quantity. Apply invoice and product writes together with a Firestore batch after number claiming.

## Audit, access, export, and migration

Write audit events for invoice create, update, delete, and stock-affecting operations to Firestore `audit_logs` and `POST /api/audit-log`. Include timestamp, action, performedBy/session user, entity ID, summary, details, and user agent. Keep invoice/inventory access aligned with the admin role model: viewers are read-only; authorized users can create and edit.

Firestore is canonical. On first use, migrate legacy local-storage records from `bb_invoices` with the `bb_migrated_v1` marker and synchronize counters without overwriting newer cloud records.

The printable React invoice must retain the legacy document identity, not merely its fields: the green-to-gold top stripe, `Konaseema Coco Products LLP` seller address (No 12, Ground Floor, AVP Complex, Sy No 97, Dommasandra Village, Virgo Nagar Post, Bangalore, Karnataka - 560049), GSTIN `29ABGFK2654K1ZX`, contact information, BrickBloom logo at `/images/OurProducts/Logo_new.jpeg`, original-for-recipient tax-invoice label, item and GST summary table, amount in words, payment/dispatch information, terms, company seal at `/images/konaseema_seal.jpg`, and authorised-signatory block. Use print CSS with A4 portrait, a narrow page margin, exact colour adjustment, and only the invoice document visible so browser Save as PDF includes every page for long invoices.

Image export saves the invoice before rendering a high-resolution PNG with `html2canvas`; it must include the logo and seal. PDF export saves first and opens the browser print flow using a useful invoice-based document title. Test both exports using an existing saved invoice and verify the resulting image/PDF contains the full invoice document rather than the admin page.
