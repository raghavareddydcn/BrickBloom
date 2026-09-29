import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { products, type Product } from '@/data/products';

type CategoryFilter = 'all' | 'kits' | 'commercial';

const CATEGORIES: { id: CategoryFilter; label: string; count: number }[] = [
  { id: 'all', label: 'All Substrates', count: 9 },
  { id: 'kits', label: 'Retail & Gardening Kits', count: 4 },
  { id: 'commercial', label: 'Commercial Substrates & Disks', count: 5 },
];

function isKit(slug: string) {
  return ['ready-pot', 'starter-kit', 'medium-kit', 'premium-kit'].includes(slug);
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col h-full rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f4ede2]/60">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Eyebrow Badge */}
        <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100 shadow-sm">
          {product.eyebrow}
        </span>
      </div>

      {/* Product Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-display text-xl sm:text-2xl text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
            {product.benefit}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 group-hover:gap-2.5 transition-all"
          >
            <span>View specifications</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'kits') return isKit(p.slug);
    if (activeFilter === 'commercial') return !isKit(p.slug);
    return true;
  });

  return (
    <section id="products" className="py-20 sm:py-28 bg-[#faf8f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span>Product Family</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
            Designed for every growing workflow.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
            Explore our standardized substrate formats — from giftable ready-to-grow pots to heavy commercial compressed coir blocks and slabs.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm max-w-full overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
