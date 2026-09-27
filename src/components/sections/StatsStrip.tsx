import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: '≤ 0.5',    unit: 'mS/cm', label: 'Low EC',       sub: 'Triple-washed, buffered' },
  { value: '100%',     unit: '',       label: 'Organic',      sub: 'Sustainably processed coir' },
  { value: '24hr',     unit: '',       label: 'Quote',        sub: 'Turnaround time' },
  { value: 'FCL',      unit: '',       label: 'Export Ready', sub: '20ft / 40ft HQ containers' },
];

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center px-4 py-6"
    >
      <div className="flex items-baseline gap-1 mb-1">
        <span className="font-display text-3xl sm:text-4xl font-normal text-brand-800 tracking-tight">
          {stat.value}
        </span>
        {stat.unit && (
          <span className="text-sm font-semibold text-brand-600">{stat.unit}</span>
        )}
      </div>
      <p className="text-sm font-bold text-slate-800 uppercase tracking-wide">{stat.label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
    </motion.div>
  );
}

export default function StatsStrip() {
  return (
    <div className="bg-white border-y border-border/60">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-border/60 lg:divide-y-0">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
