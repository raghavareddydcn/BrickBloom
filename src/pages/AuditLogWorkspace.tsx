import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { History, Search } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';

type Audit = { id: string; timestamp?: string; action?: string; performedBy?: string; entityId?: string; summary?: string };

export default function AuditLogWorkspace() {
  const [entries, setEntries] = useState<Audit[]>([]); const [search, setSearch] = useState('');
  useEffect(() => onSnapshot(collection(firestore, 'audit_logs'), (snapshot) => setEntries(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as Audit)).sort((a, b) => String(b.timestamp || '').localeCompare(String(a.timestamp || ''))))), []);
  const visible = useMemo(() => entries.filter((entry) => `${entry.action} ${entry.performedBy} ${entry.entityId} ${entry.summary}`.toLowerCase().includes(search.toLowerCase())), [entries, search]);
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-2xl border border-[#e2d5be] bg-white p-5 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Audit Trail</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              {entries.length} Events
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            A live chronological timeline of invoice, inventory, and account activity.
          </p>
        </div>
        <div className="rounded-xl border border-[#e8d7ba] bg-white p-2.5 text-emerald-800 shadow-sm">
          <History className="h-5 w-5" />
        </div>
      </div>
      <Card><CardContent className="p-5"><label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-brand-600" placeholder="Search actions, people, or records" /></label><div className="mt-5 overflow-x-auto"><table className="min-w-[680px] w-full text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-3">When</th><th>Action</th><th>By</th><th>Record</th><th>Summary</th></tr></thead><tbody>{visible.map((entry) => <tr key={entry.id} className="border-b border-slate-100"><td className="py-3 text-slate-500">{entry.timestamp ? new Date(entry.timestamp).toLocaleString('en-IN') : '—'}</td><td><span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-800">{entry.action || 'EVENT'}</span></td><td className="font-semibold text-slate-700">{entry.performedBy || 'System'}</td><td>{entry.entityId || '—'}</td><td className="text-slate-500">{entry.summary || '—'}</td></tr>)}</tbody></table></div>{!visible.length && <p className="py-10 text-center text-sm text-slate-500">No matching audit records.</p>}</CardContent></Card>
    </div>
  );
}
