import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { products, type Product } from '@/data/products';

type CategoryFilter = 'all' | 'kits' | 'commercial';

const CATEGORIES: { id: CategoryFilter; label: string; count: number }[] = [
  { id: 'all', label: 'All Substrates', count: 9 },
  { id: 'kits', label: 'Consumer & Retail Kits', count: 4 },
  { id: 'commercial', label: 'Commercial Substrates & Disks', count: 5 },
];

function isKit(slug: string) {
  return ['ready-pot', 'starter-kit', 'medium-kit', 'premium-kit'].includes(slug);
}

function ProductCard3D({ product, index }: { product: Product; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  // 3D Tilt Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 24 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 24 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  // Specular glare position
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setGlare({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.16,
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-card hover:shadow-2xl hover:shadow-emerald-950/10 transition-shadow duration-300 flex flex-col justify-between"
      >
        {/* Dynamic Specular Cursor Glare */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle 220px at ${glare.x}% ${glare.y}%, rgba(22, 163, 74, 0.15), transparent 70%)`,
            opacity: glare.opacity,
          }}
        />

        <div>
          {/* Image Container with Zoom effect */}
          <div className="relative aspect-[4/3] overflow-hidden bg-brand-50/50">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Gradient bottom shadow inside photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Eyebrow badge */}
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-brand-800 border border-brand-100 shadow-sm">
              {product.eyebrow}
            </span>

            {/* Tagline snippet */}
            <span className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white/95 drop-shadow line-clamp-1 italic">
              &ldquo;{product.tagline}&rdquo;
            </span>
          </div>

          {/* Copy section */}
          <div className="p-5 sm:p-6 space-y-3">
            <h3 className="font-display text-2xl text-slate-900 leading-snug group-hover:text-brand-800 transition-colors">
              {product.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
              {product.benefit}
            </p>

            {/* Inclusions pill previews */}
            <div className="pt-1 flex flex-wrap gap-1.5">
              {product.inclusions.slice(0, 2).map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-100"
                >
                  <Check className="h-2.5 w-2.5 text-brand-600" />
                  <span className="truncate max-w-[170px]">{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="p-5 sm:p-6 pt-0">
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to={`/products/${product.slug}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-700 group-hover:text-brand-900 group-hover:gap-2.5 transition-all"
            >
              <span>Specifications &amp; Pricing</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-[11px] font-semibold text-slate-400">Low EC</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: '-40px' });

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'kits') return isKit(p.slug);
    if (activeFilter === 'commercial') return !isKit(p.slug);
    return true;
  });

  return (
    <section id="products" className="py-24 sm:py-32 bg-slate-50/60 relative overflow-hidden">
      {/* Decorative ambient backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/70 border border-brand-200/60 px-3 py-1 text-xs font-bold text-brand-800 uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5 text-brand-700" />
            <span>Product Family</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight text-balance">
            Engineered for every growing workflow.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
            Explore our standardized substrate formats — from giftable ready-to-grow pots to heavy commercial compressed coir blocks and slabs.
          </p>

          {/* Animated Category Filter Tabs */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white border border-slate-200 shadow-sm max-w-full overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`relative rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeProductFilter"
                      className="absolute inset-0 rounded-full bg-brand-700 shadow-md shadow-brand-900/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {cat.label} ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 3D Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProducts.map((product, i) => (
              <ProductCard3D key={product.slug} product={product} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
