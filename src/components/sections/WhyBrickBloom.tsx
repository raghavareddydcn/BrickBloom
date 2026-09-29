import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Droplets, Factory, Layers, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Droplets,
    badge: 'Purity Standard',
    title: 'Triple-Washed Media',
    desc: 'Strict sodium and chloride leaching protocols guarantee electrical conductivity ≤ 0.5 mS/cm for immediate planting without shock.',
    accent: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
    hoverBorder: 'group-hover:border-emerald-500/40',
  },
  {
    icon: Layers,
    badge: 'Process Control',
    title: 'Batch Consistency',
    desc: 'Uniform micro-sieved particle sizing and standardized pith-to-fiber ratios across every container batch for predictable crop feeding.',
    accent: 'text-blue-700 bg-blue-50 border-blue-200/80',
    hoverBorder: 'group-hover:border-blue-500/40',
  },
  {
    icon: Box,
    badge: 'Logistics Efficient',
    title: 'Freight-Optimized Packaging',
    desc: 'High-compression 5kg blocks, GrowSlabs, and easy-stack pallets engineered to maximize cubic container volume and reduce ocean freight costs.',
    accent: 'text-amber-700 bg-amber-50 border-amber-200/80',
    hoverBorder: 'group-hover:border-amber-500/40',
  },
  {
    icon: Factory,
    badge: 'Direct Supply',
    title: 'Direct Coastal Mill Sourcing',
    desc: 'Direct container shipments from certified processing facilities in southern India and Sri Lanka with dedicated supply volume assurance.',
    accent: 'text-brand-800 bg-brand-50 border-brand-200/80',
    hoverBorder: 'group-hover:border-brand-500/40',
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const Icon = feature.icon;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1.5 transition-all duration-300 ${feature.hoverBorder}`}
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className={`grid h-12 w-12 place-items-center rounded-2xl border ${feature.accent} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            {feature.badge}
          </span>
        </div>

        <h3 className="font-display text-xl sm:text-2xl text-slate-900 mb-3 leading-snug group-hover:text-brand-800 transition-colors">
          {feature.title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          {feature.desc}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-brand-700 transition-colors">
        <span>ISO &amp; Quality Verified</span>
        <span className="font-mono text-[11px]">0{index + 1}</span>
      </div>
    </motion.article>
  );
}

export default function WhyBrickBloom() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: '-40px' });

  return (
    <section id="why" className="py-24 sm:py-32 bg-slate-50/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/80 border border-brand-200 px-3.5 py-1 text-xs font-bold text-brand-800 uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5 text-brand-700" />
            <span>Why BrickBloom</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight text-balance">
            Engineered substrate superiority.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
            Built to optimize commercial crop yield, stabilize irrigation cycles, and reduce substrate discard waste.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
