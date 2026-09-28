import { NavLink, Outlet } from 'react-router-dom';
import { FileText, Leaf, LayoutDashboard, MessageCircle, Package, ArrowLeft, LogOut, History, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/invoices', label: 'Invoices', icon: FileText },
  { to: '/admin/inventory', label: 'Inventory', icon: Package },
  { to: '/admin/whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { to: '/admin/audit', label: 'Audit log', icon: History },
  { to: '/admin/users', label: 'User profiles', icon: Users },
];

export default function AdminLayout() {
  const username = sessionStorage.getItem('bb_admin_user') || 'User';
  const role = sessionStorage.getItem('bb_admin_role') || 'viewer';
  const signOut = () => { sessionStorage.removeItem('bb_admin'); sessionStorage.removeItem('bb_admin_user'); sessionStorage.removeItem('bb_admin_role'); sessionStorage.removeItem('bb_last_activity'); window.location.assign('/admin'); };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink to="/admin" className="flex items-center gap-3" aria-label="BrickBloom Admin Hub">
            <img src="/images/OurProducts/Logo_new.jpeg" alt="BrickBloom" className="h-9 w-9 rounded-xl object-cover" />
            <div>
              <p className="text-sm font-bold tracking-tight text-brand-900">BrickBloom</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Operations</p>
            </div>
          </NavLink>
          <div className="flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-bold text-slate-700">{username}</p><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{role}</p></div><button onClick={signOut} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-800"><LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span></button><NavLink to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-800"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Public site</span></NavLink></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white px-4 py-4 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Operations navigation">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => cn(
                  'flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive ? 'bg-brand-700 text-white shadow-sm' : 'text-slate-600 hover:bg-brand-50 hover:text-brand-800',
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 hidden rounded-2xl bg-brand-50 p-4 lg:block">
            <Leaf className="h-5 w-5 text-brand-700" />
            <p className="mt-3 text-sm font-bold text-brand-900">One operational workspace</p>
            <p className="mt-1 text-xs leading-relaxed text-brand-800/75">Live inventory, invoices, and customer outreach in one consistent interface.</p>
          </div>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-10"><Outlet /></main>
      </div>
    </div>
  );
}
