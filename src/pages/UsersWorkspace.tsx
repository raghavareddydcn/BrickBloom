import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  X,
} from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateRandomPassword, hashPassword } from '@/lib/auth';

type User = {
  id: string;
  username?: string;
  phone?: string;
  role?: 'admin' | 'editor' | 'viewer';
  status?: 'active' | 'disabled';
  lastLogin?: string;
  passwordResetAt?: string;
};

export default function UsersWorkspace() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const isAdmin = sessionStorage.getItem('bb_admin_role') === 'admin';
  const currentAdminUser = sessionStorage.getItem('bb_admin_user') || 'admin';

  // Password reset modal state
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [savingPassword, setSavingPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'admin_users'), (snapshot) => {
      setUsers(
        snapshot.docs
          .map((entry) => ({ id: entry.id, ...entry.data() } as User))
          .sort((a, b) => (a.username || a.id).localeCompare(b.username || b.id))
      );
    });
    return () => unsubscribe();
  }, []);

  const updateUser = async (user: User, patch: Partial<User>) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(firestore, 'admin_users', user.id), patch);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const openResetModal = (user: User) => {
    setResetModalUser(user);
    const suggested = generateRandomPassword(10);
    setNewPassword(suggested);
    setShowPassword(true);
    setResetStatus(null);
    setCopied(false);
  };

  const closeResetModal = () => {
    setResetModalUser(null);
    setNewPassword('');
    setResetStatus(null);
    setCopied(false);
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !isAdmin) return;

    if (newPassword.length < 6) {
      setResetStatus({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setSavingPassword(true);
    setResetStatus(null);
    try {
      const hashed = await hashPassword(newPassword);
      await updateDoc(doc(firestore, 'admin_users', resetModalUser.id), {
        passwordHash: hashed,
        passwordResetAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        passwordResetBy: currentAdminUser,
      });

      setResetStatus({
        type: 'success',
        text: `Password for @${resetModalUser.username || resetModalUser.id} updated successfully! Remember to copy and share the new password with the user.`,
      });
    } catch (err: unknown) {
      setResetStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update user password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const copyToClipboard = () => {
    if (!newPassword) return;
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.username || u.id).toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl border border-[#e2d5be] bg-white p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">User Profiles & Security</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              {users.length} Users
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage operator credentials, password resets, role-based permissions, and account status.
          </p>
        </div>
        <div className="rounded-xl border border-[#e8d7ba] bg-brand-50 p-2.5 text-brand-800 shadow-sm shrink-0">
          <UserCog className="h-5 w-5" />
        </div>
      </div>

      {!isAdmin && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm font-semibold text-amber-800 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
          <span>Only administrators have permission to reset user passwords or change account roles.</span>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="border border-[#e2d5be] shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Registered Accounts</h2>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, phone or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:border-brand-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last sign-in</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#fcfaf6] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 font-bold text-brand-900 border border-brand-200 shadow-sm text-xs">
                        {(user.username || user.id).slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">
                          {user.username || user.id}
                        </div>
                        {user.passwordResetAt && (
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                            Reset: {new Date(user.passwordResetAt).toLocaleDateString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-xs font-medium text-slate-600">
                    {user.phone || '—'}
                  </td>

                  <td className="py-4 px-4">
                    {isAdmin ? (
                      <select
                        value={user.role || 'viewer'}
                        onChange={(event) => void updateUser(user, { role: event.target.value as User['role'] })}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold capitalize outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-200 transition"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-700">
                        {user.role || 'viewer'}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    {isAdmin ? (
                      <select
                        value={user.status || 'active'}
                        onChange={(event) => void updateUser(user, { status: event.target.value as User['status'] })}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize outline-none transition ${
                          user.status === 'disabled'
                            ? 'border-rose-300 bg-rose-50 text-rose-800'
                            : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          user.status === 'disabled'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {user.status || 'active'}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-xs text-slate-500 font-medium">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'Never'}
                  </td>

                  <td className="py-4 px-5 text-right">
                    {isAdmin ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openResetModal(user)}
                        className="h-8 rounded-lg border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold gap-1.5 shadow-xs transition"
                      >
                        <KeyRound className="h-3.5 w-3.5 text-amber-700" />
                        Reset Password
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filteredUsers.length && (
            <div className="py-12 text-center text-slate-500">
              <ShieldCheck className="mx-auto h-8 w-8 text-brand-600 mb-2" />
              <p className="text-sm font-semibold">No user profiles matched your search.</p>
              <p className="text-xs text-slate-400 mt-1">Try searching with a different term.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#fcfaf7] border border-[#e2d5be] p-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeResetModal}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  Reset User Password
                </h3>
                <p className="text-xs text-slate-500">
                  User: <strong className="text-slate-800">@{resetModalUser.username || resetModalUser.id}</strong> ({resetModalUser.role || 'viewer'})
                </p>
              </div>
            </div>

            {/* Alert Status */}
            {resetStatus && (
              <div
                className={`mb-4 rounded-xl border p-3 text-xs font-semibold ${
                  resetStatus.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}
              >
                {resetStatus.text}
              </div>
            )}

            <form onSubmit={handleAdminResetPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const pass = generateRandomPassword(10);
                      setNewPassword(pass);
                      setCopied(false);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-brand-800 hover:text-brand-950 transition"
                  >
                    <RefreshCw className="h-3 w-3" /> Generate Random
                  </button>
                </div>

                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter minimum 6 characters"
                    className="w-full h-11 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white pl-3.5 pr-20 text-sm font-mono text-slate-800 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      title="Copy password to clipboard"
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {copied && (
                  <p className="mt-1 text-[11px] font-bold text-emerald-600">Copied to clipboard!</p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-700">Enterprise Security Notice:</p>
                <p>
                  Setting a new password will take effect immediately. The user will be able to sign in on their next login session.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeResetModal}
                  className="rounded-xl border-slate-300 text-xs font-semibold"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  disabled={savingPassword}
                  className="rounded-xl bg-gradient-to-r from-brand-900 to-brand-950 hover:from-brand-800 hover:to-brand-900 text-white font-bold text-xs shadow-md"
                >
                  <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                  {savingPassword ? 'Updating…' : 'Save & Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
