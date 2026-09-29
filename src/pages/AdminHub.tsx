import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import {
  ArrowRight,
  ChevronRight,
  ExternalLink,
  FileText,
  History,
  MessageCircle,
  Package,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { firestore } from '@/lib/firebase';

interface ToolItem {
  to: string;
  badge: string;
  title: string;
  description: string;
  icon: typeof FileText;
  accentBar: string;
  iconWrapBg: string;
  iconColor: string;
  badgeClass: string;
  buttonBg: string;
  actionText: string;
}

const TOOLS: ToolItem[] = [
  {
    to: '/admin/invoices',
    badge: 'Invoice & Billing',
    title: 'Tax Invoice Portal',
    description: 'Create, save, print, and export GST-compliant tax invoices with automated inventory stock deductions.',
    icon: FileText,
    accentBar: 'bg-gradient-to-r from-emerald-800 to-emerald-500',
    iconWrapBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    badgeClass: 'bg-emerald-500/10 text-emerald-800 border-emerald-200/80',
    buttonBg: 'bg-gradient-to-r from-emerald-900 to-emerald-950 hover:from-emerald-800 hover:to-emerald-900',
    actionText: 'Launch Invoice Portal',
  },
  {
    to: '/admin/inventory',
    badge: 'Stock & Catalog',
    title: 'Inventory Dashboard',
    description: 'Track live stock levels across products, set low-stock threshold alerts, and edit stock counts in real-time.',
    icon: Package,
    accentBar: 'bg-gradient-to-r from-amber-600 to-amber-400',
    iconWrapBg: 'bg-amber-100',
    iconColor: 'text-amber-800',
    badgeClass: 'bg-amber-500/10 text-amber-900 border-amber-200/80',
    buttonBg: 'bg-gradient-to-r from-amber-900 to-amber-950 hover:from-amber-800 hover:to-amber-900',
    actionText: 'Launch Inventory',
  },
  {
    to: '/admin/whatsapp',
    badge: 'Marketing & Broadcast',
    title: 'WhatsApp Marketing',
    description: 'Connect WhatsApp Web, import customer contact sheets from Excel, and broadcast batch or manual reviewed updates.',
    icon: MessageCircle,
    accentBar: 'bg-gradient-to-r from-teal-600 to-emerald-500',
    iconWrapBg: 'bg-emerald-100',
    iconColor: 'text-teal-800',
    badgeClass: 'bg-teal-500/10 text-teal-900 border-teal-200/80',
    buttonBg: 'bg-gradient-to-r from-teal-900 to-teal-950 hover:from-teal-800 hover:to-teal-900',
    actionText: 'Launch WhatsApp Tool',
  },
  {
    to: '/admin/users',
    badge: 'Access Control',
    title: 'User Management',
    description: 'Manage registered admin users, assign roles (Admin, Editor, Viewer), and manage security permissions.',
    icon: Users,
    accentBar: 'bg-gradient-to-r from-purple-600 to-purple-400',
    iconWrapBg: 'bg-purple-100',
    iconColor: 'text-purple-800',
    badgeClass: 'bg-purple-500/10 text-purple-900 border-purple-200/80',
    buttonBg: 'bg-gradient-to-r from-purple-900 to-purple-950 hover:from-purple-800 hover:to-purple-900',
    actionText: 'Manage Users',
  },
  {
    to: '/admin/audit',
    badge: 'Compliance & History',
    title: 'System Audit Logs',
    description: 'Real-time audit trail of all invoice creations, stock adjustments, and authentication events across BrickBloom.',
    icon: History,
    accentBar: 'bg-gradient-to-r from-slate-700 to-slate-500',
    iconWrapBg: 'bg-slate-200',
    iconColor: 'text-slate-800',
    badgeClass: 'bg-slate-500/10 text-slate-800 border-slate-300',
    buttonBg: 'bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900',
    actionText: 'View Audit Trail',
  },
];

export default function AdminHub() {
  const [invoiceCount, setInvoiceCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [waStatus, setWaStatus] = useState<string>('disconnected');

  useEffect(() => {
    // Listen to Invoices
    const unsubInvoices = onSnapshot(collection(firestore, 'invoices'), (snap) => {
      setInvoiceCount(snap.docs.length);
    });

    // Listen to Users
    const unsubUsers = onSnapshot(collection(firestore, 'admin_users'), (snap) => {
      setUserCount(snap.docs.length);
    });

    // Check WA Status
    fetch('/api/wa/status')
      .then((r) => r.json())
      .then((d) => setWaStatus(d.status || 'disconnected'))
      .catch(() => undefined);

    return () => {
      unsubInvoices();
      unsubUsers();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Statistics Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-[#e8d7ba] bg-[#fcf7ee] p-4 text-center shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Commercial Invoices</p>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">{invoiceCount}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">Live in Firestore</span>
        </div>

        <div className="rounded-2xl border border-[#e8d7ba] bg-[#fcf7ee] p-4 text-center shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Catalog Formats</p>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">18</p>
          <span className="text-[10px] text-amber-700 font-semibold">Tiered pricing active</span>
        </div>

        <div className="rounded-2xl border border-[#e8d7ba] bg-[#fcf7ee] p-4 text-center shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">WhatsApp Engine</p>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                waStatus === 'ready'
                  ? 'bg-emerald-500'
                  : waStatus === 'qr'
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="font-display text-lg font-bold text-slate-900 capitalize">{waStatus}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Local server port 3000</span>
        </div>

        <div className="rounded-2xl border border-[#e8d7ba] bg-[#fcf7ee] p-4 text-center shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Admin Operators</p>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">{userCount || 1}</p>
          <span className="text-[10px] text-purple-700 font-semibold">RBAC Secured</span>
        </div>
      </div>

      {/* The 5 Core Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              to={tool.to}
              className="group relative flex flex-col justify-between rounded-3xl border-[1.5px] border-[#e8d7ba] bg-[#fcf7ee] p-7 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-600 hover:shadow-xl overflow-hidden"
            >
              {/* Top Accent Stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${tool.accentBar}`} />

              <div>
                {/* Icon Wrap */}
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${tool.iconWrapBg} ${tool.iconColor} shadow-sm mb-4 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                {/* Badge */}
                <div
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-2.5 ${tool.badgeClass}`}
                >
                  {tool.badge}
                </div>

                {/* Title & Description */}
                <h3 className="font-display text-2xl font-extrabold text-slate-900 leading-snug group-hover:text-brand-900 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  {tool.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-[#e8d7ba]/60">
                <div
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-all ${tool.buttonBg}`}
                >
                  <span>{tool.actionText}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Bar Cards matching public/admin.html */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Audit Bar */}
        <div className="rounded-2xl border border-[#e8d7ba] bg-[#fcf7ee] p-5 flex items-center justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <History className="h-4 w-4 text-slate-700" />
              <span>System Audit Logs</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Real-time activity logs of all invoice, inventory, and login events.
            </p>
          </div>
          <Link
            to="/admin/audit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold shadow-md transition-all shrink-0 ml-3"
          >
            <span>View Logs</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Public Site Bar */}
        <div className="rounded-2xl border border-[#e8d7ba] bg-[#fcf7ee] p-5 flex items-center justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-brand-700" />
              <span>Customer Website &amp; Inquiry Desk</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Visit the live public catalog and testing lead submission flow.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 text-xs font-bold shadow-md transition-all shrink-0 ml-3"
          >
            <span>Open Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
