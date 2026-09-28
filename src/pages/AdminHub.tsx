import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const tools = [
  { to: '/admin/invoices', title: 'Invoices', description: 'Create, review, and manage commercial invoices.', icon: FileText, accent: 'bg-gold-50 text-gold-700' },
  { to: '/admin/inventory', title: 'Inventory', description: 'Monitor stock positions and update quantities in real time.', icon: Package, accent: 'bg-brand-50 text-brand-700' },
  { to: '/admin/whatsapp', title: 'WhatsApp', description: 'Connect a business session and send customer updates.', icon: MessageCircle, accent: 'bg-emerald-50 text-emerald-700' },
];

export default function AdminHub() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="eyebrow">BrickBloom operations</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl text-slate-900 sm:text-5xl">Control center</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-500">A single, framework-driven workspace for the daily operations that support every BrickBloom order.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-xs font-bold text-brand-800"><ShieldCheck className="h-4 w-4" /> Live data enabled</div>
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {tools.map(({ to, title, description, icon: Icon, accent }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full hover:-translate-y-0.5">
              <CardHeader>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}><Icon className="h-5 w-5" /></div>
                <CardTitle className="mt-5">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent><span className="inline-flex items-center gap-2 text-sm font-bold text-brand-700">Open workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
