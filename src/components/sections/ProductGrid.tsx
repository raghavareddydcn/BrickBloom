import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/products';

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="group block h-full rounded-2xl border border-border bg-white overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
        aria-label={`View ${product.name} product details`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Eyebrow badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-brand-700 border border-brand-100">
            {product.eyebrow}
          </span>
        </div>

        {/* Copy */}
        <div className="p-5">
          <h3 className="font-display text-xl text-slate-900 leading-snug mb-2 group-hover:text-brand-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
            {product.benefit}
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5 transition-all">
            View specifications
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProductGrid() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: '-40px' });

  return (
    <section id="products" className="section-pad bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="eyebrow">Product Family</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 text-balance">
            Designed for every growing workflow.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto text-balance">
            Choose your preferred substrate format — each engineered to match your farm setup.
          </p>
        </motion.div>

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
