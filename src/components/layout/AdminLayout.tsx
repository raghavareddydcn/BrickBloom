import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  FileText,
  History,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { hashPassword } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Product Showcase', icon: ShoppingBag },
  { to: '/admin/invoices', label: 'Invoices & Billing', icon: FileText },
  { to: '/admin/inventory', label: 'Live Inventory', icon: Package },
  { to: '/admin/whatsapp', label: 'WhatsApp Outreach', icon: MessageCircle },
  { to: '/admin/audit', label: 'Audit Trail', icon: History },
  { to: '/admin/users', label: 'User Profiles', icon: Users },
];

export default function AdminLayout() {
  const username = sessionStorage.getItem('bb_admin_user') || 'admin';
  const role = sessionStorage.getItem('bb_admin_role') || 'viewer';

  // Change Password Modal State
  const [showModal, setShowModal] = useState(false);
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassText, setShowPassText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const signOut = () => {
    sessionStorage.removeItem('bb_admin');
    sessionStorage.removeItem('bb_admin_user');
    sessionStorage.removeItem('bb_admin_role');
    sessionStorage.removeItem('bb_last_activity');
    window.location.assign('/admin');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPass.length < 6) {
      setStatus({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPass !== confirmPass) {
      setStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const normalized = username.trim().toLowerCase();
      const userRef = doc(firestore, 'admin_users', normalized);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User record not found in system.');
      }

      const userData = userSnap.data();
      const currHash = await hashPassword(currPass);

      if (userData?.passwordHash !== currHash) {
        throw new Error('Current password is incorrect.');
      }

      const newHash = await hashPassword(newPass);
      await updateDoc(userRef, {
        passwordHash: newHash,
        passwordResetAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setStatus({ type: 'success', text: 'Password changed successfully!' });
      setCurrPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => {
        setShowModal(false);
        setStatus(null);
      }, 1500);
    } catch (err: unknown) {
      setStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to change password.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-slate-800 font-sans flex flex-col selection:bg-[#031c0e] selection:text-white">
      {/* Ultra-Premium Glass Topbar */}
      <header className="sticky top-0 z-40 h-[66px] bg-[#021a0d]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between shadow-xl text-white">
        <NavLink to="/" className="flex items-center gap-3 group" aria-label="BrickBloom Home" title="Back to BrickBloom Home">
          <img
            src="/images/OurProducts/Logo_new.jpeg"
            alt="BrickBloom"
            className="h-10 w-auto rounded-lg object-contain bg-[#f5ebd9] p-1 shadow-md transition-transform group-hover:scale-105"
          />
          <div>
            <span className="font-display text-lg font-bold text-white tracking-wide block leading-none">
              BRICKBLOOM
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[1.4px] text-emerald-400 block mt-0.5">
              Operations Enterprise Suite
            </span>
          </div>
        </NavLink>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* User Identity Pill */}
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200 shadow-sm">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-xs font-extrabold text-white">
              {initial}
            </span>
            <span className="hidden sm:inline font-semibold">{username}</span>
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider',
                role === 'admin'
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30'
                  : role === 'editor'
                  ? 'bg-blue-500/30 text-blue-200 border border-blue-400/30'
                  : 'bg-slate-500/30 text-slate-200 border border-slate-400/30'
              )}
            >
              {role}
            </span>
          </div>

          {/* Change Password Button */}
          <button
            onClick={() => {
              setShowModal(true);
              setStatus(null);
            }}
            title="Change your account password"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/20 transition-all"
          >
            <KeyRound className="h-3.5 w-3.5 text-amber-300" />
            <span className="hidden md:inline">Change Password</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={signOut}
            title="Sign out of operations"
            className="grid h-9 w-9 place-items-center rounded-xl border border-rose-500/30 bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] items-start gap-8 p-4 sm:p-6 lg:p-8">
        {/* Modern Sidebar Navigation */}
        <aside className="w-full space-y-6">
          <div>
            <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              Operations Suite
            </div>
            <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Operations navigation">
              {navigation.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'group flex shrink-0 items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-[#031c0e] text-white shadow-sm shadow-[#031c0e]/20 font-bold'
                        : 'text-slate-700 hover:bg-[#ebdcc4]/50 hover:text-slate-950'
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{label}</span>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden lg:block rounded-2xl border border-[#e2d5be] bg-white/70 p-3.5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>Bangalore Hub Active</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              Tax invoices, real-time warehouse inventory, and WhatsApp outreach synced across your workspace.
            </p>
          </div>
        </aside>

        {/* Content Body */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="text-center py-4 text-xs text-slate-500 border-t border-[#e2d5be]/70">
        &copy; 2026 Konaseema Coco Products LLP &bull; BrickBloom Enterprise Suite
      </footer>

      {/* Change Password Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#fcfaf7] border border-[#e2d5be] p-6 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  Change Password
                </h3>
                <p className="text-xs text-slate-500">
                  Account: <strong className="text-slate-800">@{username}</strong>
                </p>
              </div>
            </div>

            {status && (
              <div
                className={`mb-4 rounded-xl border p-3 text-xs font-semibold ${
                  status.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}
              >
                {status.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type={showPassText ? 'text' : 'password'}
                    value={currPass}
                    onChange={(e) => setCurrPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full h-10 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white pl-9 pr-10 text-xs text-slate-800 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassText(!showPassText)}
                    tabIndex={-1}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassText ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type={showPassText ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full h-10 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type={showPassText ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full h-10 rounded-xl border-[1.5px] border-[#d8c4a0] bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-brand-900 to-brand-950 hover:from-brand-800 hover:to-brand-900 text-white font-bold text-xs shadow-md"
                >
                  <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                  {isSubmitting ? 'Updating…' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
