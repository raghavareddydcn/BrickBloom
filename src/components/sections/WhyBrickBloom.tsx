import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FEATURES = [
  {
    icon: '🌿',
    title: 'Triple-Washed Media',
    desc: 'Strict sodium and chloride leaching protocols ensure low EC levels for immediate planting.',
    color: 'bg-green-50 border-green-100',
  },
  {
    icon: '🔬',
    title: 'Batch Consistency',
    desc: 'Uniform particle sizing and controlled fiber-to-pith ratios across every shipment.',
    color: 'bg-blue-50 border-blue-100',
  },
  {
    icon: '📦',
    title: 'Freight Optimized',
    desc: 'Compressed bales and slabs designed to maximize container loads and lower shipping costs.',
    color: 'bg-amber-50 border-amber-100',
  },
  {
    icon: '🤝',
    title: 'Direct Sourcing',
    desc: 'Direct supply from certified processing mills in India and Sri Lanka for guaranteed volume.',
    color: 'bg-purple-50 border-purple-100',
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border p-6 ${feature.color} flex flex-col gap-4 h-full`}
    >
      <div className="text-3xl" aria-hidden="true">{feature.icon}</div>
      <div>
        <h3 className="font-display text-lg text-slate-900 mb-2 leading-snug">{feature.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
      </div>
    </motion.article>
  );
}

export default function WhyBrickBloom() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: '-40px' });

  return (
    <section id="why" className="section-pad bg-background">
      <div className="max-w-7xl mx-auto">

        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="eyebrow">Why BrickBloom</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 text-balance">
            Engineered substrate superiority.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto text-balance">
            Built to optimize crop yield, lower irrigation frequency, and reduce operational waste.
          </p>
        </motion.div>

        {/* 2-col mobile, 4-col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        {/* Sourcing badges strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { region: '🇮🇳 India',              focus: 'Large-scale processing, low-EC custom blends, and compressed bales.' },
            { region: '🇱🇰 Sri Lanka',          focus: 'Naturally aged, high-porosity cocopeat for premium media mixes.' },
            { region: '🌍 Global Networks',    focus: 'Direct sourcing from certified mills and exporters worldwide.' },
          ].map((hub) => (
            <div key={hub.region} className="rounded-2xl border border-border bg-white p-5 shadow-card">
              <p className="font-semibold text-slate-800 text-sm mb-1.5">{hub.region}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{hub.focus}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
