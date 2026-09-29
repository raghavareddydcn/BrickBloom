import { NavLink, Outlet } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/invoices', label: 'Invoices & Billing', icon: FileText },
  { to: '/admin/inventory', label: 'Live Inventory', icon: Package },
  { to: '/admin/whatsapp', label: 'WhatsApp Outreach', icon: MessageCircle },
  { to: '/admin/audit', label: 'Audit Trail', icon: History },
  { to: '/admin/users', label: 'User Profiles', icon: Users },
];

export default function AdminLayout() {
  const username = sessionStorage.getItem('bb_admin_user') || 'admin';
  const role = sessionStorage.getItem('bb_admin_role') || 'viewer';

  const signOut = () => {
    sessionStorage.removeItem('bb_admin');
    sessionStorage.removeItem('bb_admin_user');
    sessionStorage.removeItem('bb_admin_role');
    sessionStorage.removeItem('bb_last_activity');
    window.location.assign('/admin');
  };

  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0e4cf_0%,#f7f1e5_100%)] text-slate-800 font-sans flex flex-col">
      {/* Ultra-Premium Glass Topbar matching public/admin.html */}
      <header className="sticky top-0 z-40 h-[66px] bg-[#031c0e]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between shadow-2xl text-white">
        <NavLink to="/admin" className="flex items-center gap-3" aria-label="BrickBloom Admin Suite">
          <img
            src="/images/OurProducts/Logo_new.jpeg"
            alt="BrickBloom"
            className="h-10 w-auto rounded-lg object-contain bg-[#f5ebd9] p-1 shadow-md"
          />
          <div>
            <span className="font-display text-lg font-bold text-white tracking-wide block leading-none">
              BRICKBLOOM
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[1.2px] text-emerald-400 block mt-0.5">
              Admin Enterprise Suite
            </span>
          </div>
        </NavLink>

        <div className="flex items-center gap-3">
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

          {/* Sign Out Button */}
          <button
            onClick={signOut}
            title="Sign out of operations"
            className="grid h-9 w-9 place-items-center rounded-xl border border-rose-500/30 bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" />
          </button>

          {/* Public Site Link */}
          <NavLink
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors ml-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Public Site
          </NavLink>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* Sidebar */}
        <aside className="h-fit rounded-3xl bg-[#fcf7ee]/90 border border-[#e8d7ba] p-4 shadow-md backdrop-blur-md">
          <nav className="flex gap-1.5 overflow-x-auto lg:flex-col" aria-label="Operations navigation">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-brand-900 to-brand-800 text-white shadow-md shadow-brand-950/20'
                      : 'text-slate-700 hover:bg-[#f0e4cf] hover:text-slate-900'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" /> {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 hidden lg:block rounded-2xl border border-brand-200/60 bg-brand-50/60 p-3.5">
            <div className="flex items-center gap-2 text-brand-900 font-bold text-xs">
              <ShieldCheck className="h-4 w-4 text-brand-700" />
              <span>Live Enterprise Sync</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-brand-800/80 font-medium">
              Tax invoices, real-time warehouse inventory, and WhatsApp outreach synced across your workspace.
            </p>
          </div>
        </aside>

        {/* Content Body */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="text-center py-4 text-xs text-slate-500 border-t border-[#e8d7ba]/60">
        &copy; 2026 Konaseema Coco Products LLP &bull; BrickBloom Enterprise Suite
      </footer>
    </div>
  );
}
