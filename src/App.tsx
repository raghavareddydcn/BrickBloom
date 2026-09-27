import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Routes>
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
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
