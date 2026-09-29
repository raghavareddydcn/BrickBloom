import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Clock, Container, Droplets } from 'lucide-react';

interface StatItem {
  icon: typeof Droplets;
  prefix?: string;
  targetNum?: number;
  suffix?: string;
  staticText?: string;
  unit: string;
  label: string;
  sub: string;
}

const STATS: StatItem[] = [
  {
    icon: Droplets,
    prefix: '≤ ',
    targetNum: 0.5,
    unit: 'mS/cm',
    label: 'Low EC Substrate',
    sub: 'Triple-washed & calcium buffered',
  },
  {
    icon: Award,
    targetNum: 100,
    suffix: '%',
    unit: '',
    label: 'Organic & Sustainable',
    sub: 'Pure renewable coconut husk',
  },
  {
    icon: Clock,
    prefix: '< ',
    targetNum: 24,
    suffix: 'h',
    unit: '',
    label: 'Quote Turnaround',
    sub: 'Fast dedicated sourcing desk',
  },
  {
    icon: Container,
    staticText: 'FCL',
    unit: 'HQ',
    label: 'Global Export Ready',
    sub: '20ft & 40ft High Cube containers',
  },
];

function AnimatedCounter({ target, isInView }: { target: number; isInView: boolean }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1600;
    const startTime = performance.now();

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (target - start) * ease;
      setVal(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setVal(target);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, target]);

  return <>{target % 1 === 0 ? Math.round(val) : val.toFixed(1)}</>;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/5 hover:-translate-y-1 overflow-hidden"
    >
      {/* Top subtle glow on hover */}
      <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-transparent via-brand-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Floating Icon Badge */}
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 border border-brand-100/80 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>

      {/* Big Animated Number */}
      <div className="flex items-baseline gap-1 mb-1.5">
        <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight group-hover:text-brand-900 transition-colors">
          {stat.prefix}
          {stat.targetNum !== undefined ? (
            <AnimatedCounter target={stat.targetNum} isInView={isInView} />
          ) : (
            stat.staticText
          )}
          {stat.suffix}
        </span>
        {stat.unit && (
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700">
            {stat.unit}
          </span>
        )}
      </div>

      {/* Label and Sub */}
      <p className="text-sm font-bold text-slate-800 tracking-wide">{stat.label}</p>
      <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">{stat.sub}</p>
    </motion.div>
  );
}

export default function StatsStrip() {
  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl p-3 sm:p-5 border border-slate-200/80 shadow-2xl shadow-slate-900/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
