import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminAccessGate from '@/components/auth/AdminAccessGate';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import NotFound from '@/pages/NotFound';

const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));
const AdminHub = lazy(() => import('@/pages/AdminHub'));
const InvoiceWorkspace = lazy(() => import('@/pages/InvoiceWorkspace'));
const InventoryWorkspace = lazy(() => import('@/pages/InventoryWorkspace'));
const WhatsAppWorkspace = lazy(() => import('@/pages/WhatsAppWorkspace'));
const AuditLogWorkspace = lazy(() => import('@/pages/AuditLogWorkspace'));
const UsersWorkspace = lazy(() => import('@/pages/UsersWorkspace'));

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          {/* Fallback legacy routes compatibility */}
          <Route path="/tabs.html" element={<ProductDetail />} />
          <Route path="/blocks.html" element={<ProductDetail />} />
          <Route path="/growbags.html" element={<ProductDetail />} />
          <Route path="/loose.html" element={<ProductDetail />} />
          <Route path="/coco-grow-cubes.html" element={<ProductDetail />} />
          <Route path="/open-top-growbags.html" element={<ProductDetail />} />
          <Route path="/coco-bricks.html" element={<ProductDetail />} />
          <Route path="/coco-growslabs.html" element={<ProductDetail />} />
          <Route path="/coir-chips.html" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin" element={<AdminRoutes />}>
        <Route index element={<AdminHub />} />
        <Route path="invoices" element={<InvoiceWorkspace />} />
        <Route path="inventory" element={<InventoryWorkspace />} />
        <Route path="whatsapp" element={<WhatsAppWorkspace />} />
        <Route path="audit" element={<AuditLogWorkspace />} />
        <Route path="users" element={<UsersWorkspace />} />
      </Route>
      <Route path="/operations" element={<LegacyRedirect to="/admin" />} />
      <Route path="/dashboard" element={<LegacyRedirect to="/admin" />} />
      <Route path="/invoice" element={<LegacyRedirect to="/admin/invoices" />} />
      <Route path="/inventory" element={<LegacyRedirect to="/admin/inventory" />} />
      <Route path="/whatsapp" element={<LegacyRedirect to="/admin/whatsapp" />} />
    </Routes>
  );
}

function AdminRoutes() {
  return <AdminAccessGate><Suspense fallback={<div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-500">Loading BrickBloom operations…</div>}><AdminLayout /></Suspense></AdminAccessGate>;
}

function LegacyRedirect({ to }: { to: string }) {
  useEffect(() => { window.location.replace(to); }, [to]);
  return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-500">Opening BrickBloom operations…</div>;
}

function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1"><Outlet /></div>
      <Footer />
    </div>
  );
}
