import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function BrandBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="brand" className="bg-brand-950 overflow-hidden">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              The BrickBloom Standard
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight text-balance">
              Pure Coconut Coir.<br />Uncompromised Quality.
            </h2>
            <p className="mt-6 text-brand-300 text-base sm:text-lg leading-relaxed max-w-lg">
              From raw coconut husk to finished, triple-washed substrate — BrickBloom processes high-grade coir
              fiber and pith with strict EC and pH controls to maximize root aeration and water retention.
            </p>

            {/* Quality bullets */}
            <ul className="mt-8 space-y-3">
              {[
                { icon: '🌿', text: 'Triple-washed for low sodium & chloride levels' },
                { icon: '🔬', text: 'Strict EC control — consistently ≤ 0.5 mS/cm' },
                { icon: '⚖️', text: 'pH balanced 5.5–6.5 for optimal nutrient uptake' },
                { icon: '📦', text: 'Compressed format for freight-optimized shipping' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                  <span className="text-brand-200 text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Tagline quote */}
            <blockquote className="mt-10 pl-4 border-l-2 border-gold-500">
              <p className="text-gold-300 font-display text-lg italic">
                "BrickBloom — From Nature, For Nature"
              </p>
            </blockquote>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-[3/4] shadow-2xl">
              <img
                src="/images/natural-coir-photo.jpg"
                alt="Natural Coconut Coir & Cocopeat Substrate"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/40 to-transparent pointer-events-none" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-4 -left-4 sm:bottom-6 sm:left-6 bg-white rounded-2xl shadow-xl px-5 py-4 max-w-[200px]"
            >
              <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-1">Certified Quality</p>
              <p className="text-2xl font-display text-brand-900">EC ≤ 0.5</p>
              <p className="text-xs text-slate-500 mt-0.5">mS/cm — every batch</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
