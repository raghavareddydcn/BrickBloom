import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import {
  ArrowRight,
  FileText,
  History,
  IndianRupee,
  MessageCircle,
  Package,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { CATALOG_PRODUCTS } from '@/data/catalogProducts';

interface ToolItem {
  to: string;
  badge: string;
  title: string;
  description: string;
  icon: typeof FileText;
  accentBar: string;
  badgeClass: string;
  buttonBg: string;
  actionText: string;
}

const TOOLS: ToolItem[] = [
  {
    to: '/admin/products',
    badge: 'Enterprise Product Showcase',
    title: 'Product Showcase & Catalog',
    description: '',
    icon: ShoppingBag,
    accentBar: 'bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    buttonBg: 'bg-[#031c0e] hover:bg-emerald-950 text-white',
    actionText: 'Explore Product Catalog',
  },
  {
    to: '/admin/invoices',
    badge: 'Invoice & Billing',
    title: 'Tax Invoice Portal',
    description: 'Create, save, print, and export GST-compliant tax invoices with automated inventory stock deductions.',
    icon: FileText,
    accentBar: 'bg-gradient-to-r from-emerald-800 to-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    buttonBg: 'bg-[#031c0e] hover:bg-emerald-950 text-white',
    actionText: 'Launch Invoice Portal',
  },
  {
    to: '/admin/inventory',
    badge: 'Stock & Catalog',
    title: 'Inventory Dashboard',
    description: 'Track live stock levels across products, set low-stock threshold alerts, and edit stock counts in real-time.',
    icon: Package,
    accentBar: 'bg-gradient-to-r from-amber-600 to-amber-400',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
    buttonBg: 'bg-amber-900 hover:bg-amber-950 text-white',
    actionText: 'Launch Inventory',
  },
  {
    to: '/admin/whatsapp',
    badge: 'Marketing & Broadcast',
    title: 'WhatsApp Marketing',
    description: 'Connect WhatsApp Web, import customer contact sheets from Excel, and broadcast batch or manual reviewed updates.',
    icon: MessageCircle,
    accentBar: 'bg-gradient-to-r from-teal-600 to-emerald-500',
    badgeClass: 'bg-teal-50 text-teal-900 border-teal-200',
    buttonBg: 'bg-teal-900 hover:bg-teal-950 text-white',
    actionText: 'Launch WhatsApp Tool',
  },
  {
    to: '/admin/users',
    badge: 'Access Control',
    title: 'User Management',
    description: 'Manage registered admin users, assign roles (Admin, Editor, Viewer), and manage security permissions.',
    icon: Users,
    accentBar: 'bg-gradient-to-r from-purple-600 to-purple-400',
    badgeClass: 'bg-purple-50 text-purple-900 border-purple-200',
    buttonBg: 'bg-purple-900 hover:bg-purple-950 text-white',
    actionText: 'Manage Users',
  },
  {
    to: '/admin/audit',
    badge: 'Compliance & History',
    title: 'System Audit Logs',
    description: 'Real-time audit trail of all invoice creations, stock adjustments, and authentication events across BrickBloom.',
    icon: History,
    accentBar: 'bg-gradient-to-r from-slate-700 to-slate-500',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    buttonBg: 'bg-slate-900 hover:bg-slate-950 text-white',
    actionText: 'View Audit Trail',
  },
];

export default function AdminHub() {
  const [invoiceCount, setInvoiceCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [outOfStockCount, setOutOfStockCount] = useState<number>(0);
  const [waStatus, setWaStatus] = useState<string>('disconnected');

  useEffect(() => {
    // 1. Listen to Invoices & Compute Total Revenue
    const unsubInvoices = onSnapshot(collection(firestore, 'invoices'), (snap) => {
      setInvoiceCount(snap.docs.length);
      let revenue = 0;
      snap.docs.forEach((d) => {
        const it = d.data();
        if (typeof it.grandTotal === 'number' && it.grandTotal > 0) {
          revenue += it.grandTotal;
        } else {
          const items = Array.isArray(it.items) ? it.items : [];
          const itemsSubtotal = items.reduce(
            (sum: number, x: any) => sum + (Number(x.qty) || 0) * (Number(x.price) || 0),
            0
          );
          const itemsTax = items.reduce(
            (sum: number, x: any) =>
              sum +
              (Number(x.qty) || 0) *
                (Number(x.price) || 0) *
                ((Number(x.gstRate !== undefined ? x.gstRate : it.taxRate ?? 5)) / 100),
            0
          );
          revenue += itemsSubtotal + itemsTax + (Number(it.transport) || 0);
        }
      });
      setTotalRevenue(revenue);
    });

    // 2. Listen to Products & Stock Status
    const unsubProducts = onSnapshot(collection(firestore, 'products'), (snap) => {
      let low = 0;
      let out = 0;
      let total = 0;
      snap.docs.forEach((d) => {
        const p = d.data();
        total++;
        const stock = Number(p.stock || 0);
        const threshold = Number(p.lowStockThreshold || 0);
        if (stock <= 0) {
          out++;
        } else if (stock <= threshold) {
          low++;
        }
      });
      setProductCount(total);
      setLowStockCount(low);
      setOutOfStockCount(out);
    });

    // 3. Listen to Users
    const unsubUsers = onSnapshot(collection(firestore, 'admin_users'), (snap) => {
      setUserCount(snap.docs.length);
    });

    // 4. Check WA Status
    fetch('/api/wa/status')
      .then((r) => r.json())
      .then((d) => setWaStatus(d.status || 'disconnected'))
      .catch(() => undefined);

    return () => {
      unsubInvoices();
      unsubProducts();
      unsubUsers();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* The 5 Core Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => {
          return (
            <Link
              key={tool.title}
              to={tool.to}
              className="group relative flex flex-col justify-between rounded-3xl border border-[#e2d5be] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/70 hover:shadow-xl overflow-hidden text-center"
            >
              {/* Top Accent Stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${tool.accentBar}`} />

              <div className="flex flex-col items-center">
                {/* Badge */}
                <div
                  className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider mb-3 ${tool.badgeClass}`}
                >
                  {tool.badge}
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl font-extrabold text-slate-900 leading-snug group-hover:text-emerald-950 transition-colors">
                  {tool.title}
                </h3>

                {/* Integrated Metric Sub-Panel */}
                <div className="my-4 w-full rounded-2xl border border-slate-100 bg-[#fbf8f3] p-4 text-center shadow-inner">
                  {tool.to === '/admin/products' && (
                    <>
                      <div className="font-display text-2xl font-extrabold text-slate-900">
                        {CATALOG_PRODUCTS.length} <span className="text-base font-bold text-slate-500">Available Products</span>
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap text-xs">
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-200">
                          ⭐ {CATALOG_PRODUCTS.filter((p) => p.badges.some((b) => /bestseller|choice/i.test(b))).length} Fast Moving
                        </span>
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 border border-emerald-200">
                          {CATALOG_PRODUCTS.filter((p) => p.stockStatus === 'in_stock').length} In Stock
                        </span>
                      </div>
                    </>
                  )}

                  {tool.to === '/admin/invoices' && (
                    <>
                      <div className="flex items-center justify-center gap-1 font-display text-2xl font-extrabold text-emerald-900">
                        <IndianRupee className="h-5 w-5 text-emerald-700" />
                        <span>{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        {invoiceCount} Invoices &bull; All-time turnover
                      </p>
                    </>
                  )}

                  {tool.to === '/admin/inventory' && (
                    <>
                      <div className="font-display text-2xl font-extrabold text-slate-900">
                        {productCount} <span className="text-base font-bold text-slate-500">Products</span>
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap text-xs">
                        {outOfStockCount > 0 && (
                          <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold text-rose-800 border border-rose-200">
                            {outOfStockCount} Out of Stock
                          </span>
                        )}
                        {lowStockCount > 0 && (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-200">
                            {lowStockCount} Low Stock
                          </span>
                        )}
                        {outOfStockCount === 0 && lowStockCount === 0 && (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 border border-emerald-200">
                            All Items Stocked
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {tool.to === '/admin/whatsapp' && (
                    <>
                      <div className="flex items-center justify-center gap-2 font-display text-xl font-extrabold text-slate-900">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            waStatus === 'ready'
                              ? 'bg-emerald-500 ring-4 ring-emerald-100'
                              : waStatus === 'qr'
                              ? 'bg-blue-500 animate-pulse ring-4 ring-blue-100'
                              : 'bg-rose-500 ring-4 ring-rose-100'
                          }`}
                        />
                        <span className="capitalize">{waStatus === 'ready' ? 'Connected' : waStatus === 'qr' ? 'Scan QR' : 'Disconnected'}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        Local Port 3000 Outreach Client
                      </p>
                    </>
                  )}

                  {tool.to === '/admin/users' && (
                    <>
                      <div className="font-display text-2xl font-extrabold text-slate-900">
                        {userCount} <span className="text-base font-bold text-slate-500">Operators</span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        Role-based access &amp; permissions
                      </p>
                    </>
                  )}

                  {tool.to === '/admin/audit' && (
                    <>
                      <div className="font-display text-xl font-extrabold text-slate-900">
                        Live Event Log
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        Audit trail of invoice &amp; stock events
                      </p>
                    </>
                  )}
                </div>

                {/* Description */}
                {tool.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
                    {tool.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold shadow-sm transition-all ${tool.buttonBg}`}
                >
                  <span>{tool.actionText}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
