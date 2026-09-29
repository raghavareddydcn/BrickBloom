import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ShieldCheck, UserCog } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';

type User = { id: string; username?: string; phone?: string; role?: 'admin' | 'editor' | 'viewer'; status?: 'active' | 'disabled'; lastLogin?: string };

export default function UsersWorkspace() {
  const [users, setUsers] = useState<User[]>([]); const isAdmin = sessionStorage.getItem('bb_admin_role') === 'admin';
  useEffect(() => onSnapshot(collection(firestore, 'admin_users'), (snapshot) => setUsers(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as User)).sort((a, b) => (a.username || a.id).localeCompare(b.username || b.id)))), []);
  const updateUser = async (user: User, patch: Partial<User>) => { if (!isAdmin) return; await updateDoc(doc(firestore, 'admin_users', user.id), patch); };
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-2xl border border-[#e2d5be] bg-white p-5 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">User Profiles</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              {users.length} Users
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage operator credentials, role-based access, and account status.
          </p>
        </div>
        <div className="rounded-xl border border-[#e8d7ba] bg-white p-2.5 text-emerald-800 shadow-sm">
          <UserCog className="h-5 w-5" />
        </div>
      </div>
      {!isAdmin && <p className="rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">Only administrators can change account roles or status.</p>}
      <Card><CardContent className="overflow-x-auto p-5"><table className="min-w-[680px] w-full text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-3">User</th><th>Phone</th><th>Role</th><th>Status</th><th>Last sign-in</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-slate-100"><td className="py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 font-bold text-brand-800">{(user.username || user.id).slice(0, 1).toUpperCase()}</span><span className="font-bold text-slate-800">{user.username || user.id}</span></div></td><td className="text-slate-500">{user.phone || '—'}</td><td>{isAdmin ? <select value={user.role || 'viewer'} onChange={(event) => void updateUser(user, { role: event.target.value as User['role'] })} className="rounded-lg border border-slate-200 px-2 py-1.5 font-semibold capitalize outline-none focus:border-brand-600"><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select> : <span className="capitalize">{user.role || 'viewer'}</span>}</td><td>{isAdmin ? <select value={user.status || 'active'} onChange={(event) => void updateUser(user, { status: event.target.value as User['status'] })} className="rounded-lg border border-slate-200 px-2 py-1.5 font-semibold capitalize outline-none focus:border-brand-600"><option value="active">Active</option><option value="disabled">Disabled</option></select> : <span className="capitalize">{user.status || 'active'}</span>}</td><td className="text-slate-500">{user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'Never'}</td></tr>)}</tbody></table>{!users.length && <div className="py-12 text-center text-slate-500"><ShieldCheck className="mx-auto h-7 w-7 text-brand-600" /><p className="mt-3 text-sm">No user profiles found.</p></div>}</CardContent></Card>
    </div>
  );
}
