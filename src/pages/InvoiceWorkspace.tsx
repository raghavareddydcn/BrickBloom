import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { FilePlus2, Search, Trash2 } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Invoice = { id: string; invoiceNo?: string; clientName?: string; customer?: { name?: string }; date?: string; total?: number; grandTotal?: number; createdAt?: string };

export default function InvoiceWorkspace() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [queryText, setQueryText] = useState('');
  const [creating, setCreating] = useState(false);
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => onSnapshot(collection(firestore, 'invoices'), (snapshot) => {
    setInvoices(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Invoice)).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))));
  }), []);

  const visibleInvoices = useMemo(() => invoices.filter((invoice) => `${invoice.invoiceNo || ''} ${invoice.clientName || invoice.customer?.name || ''}`.toLowerCase().includes(queryText.toLowerCase())), [invoices, queryText]);

  async function createInvoice(event: React.FormEvent) {
    event.preventDefault();
    const total = Number(amount);
    if (!clientName.trim() || !Number.isFinite(total) || total < 0) return;
    const invoiceNo = `BB-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    await addDoc(collection(firestore, 'invoices'), { invoiceNo, clientName: clientName.trim(), total, grandTotal: total, date: new Date().toISOString().slice(0, 10), createdAt: new Date().toISOString(), status: 'Draft' });
    await addDoc(collection(firestore, 'audit_logs'), { timestamp: new Date().toISOString(), action: 'INVOICE_CREATE', performedBy: sessionStorage.getItem('bb_admin_user') || 'admin', entityId: invoiceNo, summary: `Created invoice ${invoiceNo} for ${clientName.trim()}`, details: { grandTotal: total } });
    setClientName(''); setAmount(''); setCreating(false);
  }

  return <div className="mx-auto max-w-6xl"><p className="eyebrow">Commercial documents</p><div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-4xl text-slate-900">Invoices</h1><p className="mt-2 text-slate-500">Manage live invoice records with a clean, responsive workspace.</p></div><Button size="lg" onClick={() => setCreating(true)}><FilePlus2 className="h-4 w-4" /> New invoice</Button></div>
    {creating && <Card className="mt-8 border-brand-200"><CardContent className="p-6"><form onSubmit={createInvoice} className="grid gap-4 sm:grid-cols-[1fr_180px_auto]"><label className="text-sm font-semibold text-slate-700">Customer<input required value={clientName} onChange={(event) => setClientName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-brand-600" placeholder="Customer or company name" /></label><label className="text-sm font-semibold text-slate-700">Amount (₹)<input required type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-brand-600" placeholder="0.00" /></label><div className="flex items-end gap-2"><Button type="submit">Create</Button><Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button></div></form></CardContent></Card>}
    <Card className="mt-8"><CardContent className="p-4 sm:p-6"><label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={queryText} onChange={(event) => setQueryText(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100" placeholder="Search invoices or customers" /></label></CardContent></Card>
    <Card className="mt-5 overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Invoice</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Total</th><th className="px-5 py-4" /></tr></thead><tbody className="divide-y divide-slate-100">{visibleInvoices.map((invoice) => <tr key={invoice.id}><td className="px-5 py-4 font-semibold text-brand-800">{invoice.invoiceNo || invoice.id}</td><td className="px-5 py-4 text-slate-700">{invoice.clientName || invoice.customer?.name || '—'}</td><td className="px-5 py-4 text-slate-500">{invoice.date || '—'}</td><td className="px-5 py-4 font-bold text-slate-800">₹{Number(invoice.grandTotal ?? invoice.total ?? 0).toLocaleString('en-IN')}</td><td className="px-5 py-4 text-right"><button onClick={async () => { if (!window.confirm(`Delete ${invoice.invoiceNo || 'this invoice'}?`)) return; await deleteDoc(doc(firestore, 'invoices', invoice.id)); await addDoc(collection(firestore, 'audit_logs'), { timestamp: new Date().toISOString(), action: 'INVOICE_DELETE', performedBy: sessionStorage.getItem('bb_admin_user') || 'admin', entityId: invoice.invoiceNo || invoice.id, summary: `Deleted invoice ${invoice.invoiceNo || invoice.id}` }); }} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${invoice.invoiceNo || 'invoice'}`}><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>{!visibleInvoices.length && <p className="p-10 text-center text-sm text-slate-500">No invoices found.</p>}</Card></div>;
}
