import { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Check, Pencil, Search } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type InventoryItem = { id: string; name?: string; stock?: number; unit?: string; lowStockThreshold?: number; lastUpdated?: string };

const isInventoryItem = (item: InventoryItem) => !/^(packing\b|packing box\b|packing & handling\b|packing and handling\b)/i.test(item.name || item.id);

export default function InventoryWorkspace() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const canEdit = sessionStorage.getItem('bb_admin_role') !== 'viewer';

  useEffect(() => onSnapshot(collection(firestore, 'products'), (snapshot) => {
    setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as InventoryItem)).sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id)));
  }), []);

  const inventoryItems = useMemo(() => items.filter(isInventoryItem), [items]);
  const visibleItems = useMemo(() => inventoryItems.filter((item) => (item.name || item.id).toLowerCase().includes(query.toLowerCase())), [inventoryItems, query]);
  const lowStock = inventoryItems.filter((item) => Number(item.stock || 0) <= Number(item.lowStockThreshold || 0)).length;

  async function save(item: InventoryItem) {
    if (!canEdit) return;
    const stock = Number(draft);
    if (!Number.isFinite(stock) || stock < 0) return;
    await setDoc(doc(firestore, 'products', item.id), { ...item, stock, lastUpdated: new Date().toISOString() }, { merge: true });
    setEditing(null);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-2xl border border-[#e2d5be] bg-white p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Live Inventory</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              {inventoryItems.length} Products
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time warehouse stock tracking with live Firestore synchronization.
          </p>
        </div>
        <div className="rounded-xl border border-amber-300 bg-amber-50/90 px-3.5 py-1.5 text-xs font-bold text-amber-900">
          {lowStock} low-stock {lowStock === 1 ? 'item' : 'items'}
        </div>
      </div>
      <Card><CardContent className="p-4 sm:p-6"><label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100" placeholder="Search inventory" /></label></CardContent></Card>
      <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">Available</th><th className="px-5 py-4">Threshold</th>{canEdit && <th className="px-5 py-4 text-right">Action</th>}</tr></thead><tbody className="divide-y divide-slate-100">{visibleItems.map((item) => { const name = item.name || item.id; const isEditing = editing === item.id; const isLow = Number(item.stock || 0) <= Number(item.lowStockThreshold || 0); return <tr key={item.id}><td className="px-5 py-4 font-semibold text-slate-800">{name}</td><td className="px-5 py-4">{isEditing ? <input autoFocus type="number" min="0" value={draft} onChange={(event) => setDraft(event.target.value)} className="h-9 w-24 rounded-lg border border-brand-400 px-2 outline-none" /> : <span className={isLow ? 'font-bold text-red-600' : 'font-semibold text-slate-700'}>{item.stock ?? 0} {item.unit || 'units'}</span>}</td><td className="px-5 py-4 text-slate-500">{item.lowStockThreshold ?? 0}</td>{canEdit && <td className="px-5 py-4 text-right">{isEditing ? <Button size="sm" onClick={() => save(item)}><Check className="h-3.5 w-3.5" /> Save</Button> : <Button size="sm" variant="outline" onClick={() => { setEditing(item.id); setDraft(String(item.stock ?? 0)); }}><Pencil className="h-3.5 w-3.5" /> Edit</Button>}</td>}</tr>; })}</tbody></table></div>{!visibleItems.length && <p className="p-10 text-center text-sm text-slate-500">No inventory items match your search.</p>}</Card>
    </div>
  );
}
