import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
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
    sub: 'Dedicated fast sourcing desk',
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
    const duration = 1400;
    const startTime = performance.now();

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

function StatCard({ stat }: { stat: StatItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-white border border-[#ebdcc7] shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-300"
    >
      {/* Top subtle emerald stripe */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-2xl opacity-80" />

      {/* Icon Badge */}
      <div className="mb-3.5 grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
        <Icon className="h-5 w-5" />
      </div>

      {/* Number */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="font-display text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight">
          {stat.prefix}
          {stat.targetNum !== undefined ? (
            <AnimatedCounter target={stat.targetNum} isInView={isInView} />
          ) : (
            stat.staticText
          )}
          {stat.suffix}
        </span>
        {stat.unit && (
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700">
            {stat.unit}
          </span>
        )}
      </div>

      {/* Label and Sub */}
      <p className="text-sm font-bold text-slate-800 tracking-wide">{stat.label}</p>
      <p className="text-xs text-slate-500 mt-1 max-w-[210px] leading-relaxed">{stat.sub}</p>
    </div>
  );
}

export default function StatsStrip() {
  return (
    <section className="relative z-10 bg-[#fbf9f4] border-y border-[#ebdcc7] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
