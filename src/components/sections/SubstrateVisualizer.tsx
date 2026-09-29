import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ChevronRight, Droplet, Microscope, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubstrateVisualizer() {
  const [mode, setMode] = useState<'brickbloom' | 'raw'>('brickbloom');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const metrics = {
    brickbloom: {
      ec: { value: '≤ 0.5 mS/cm', percent: 18, color: 'bg-emerald-500', note: 'Triple-washed & calcium buffered' },
      afp: { value: '20 - 24%', percent: 88, color: 'bg-emerald-500', note: 'Optimal oxygen delivery to roots' },
      sodium: { value: '< 40 ppm', percent: 15, color: 'bg-emerald-500', note: 'Safe for delicate root tips' },
      ph: { value: '5.8 - 6.5', percent: 75, color: 'bg-emerald-500', note: 'Optimal plant nutrient uptake' },
      expansion: { value: '15L / kg', percent: 92, color: 'bg-emerald-500', note: 'Fluffy, uniform aerated sponge' },
    },
    raw: {
      ec: { value: '2.5 - 3.8 mS/cm', percent: 85, color: 'bg-rose-500', note: 'High salt risk; burns seedling roots' },
      afp: { value: '8 - 12%', percent: 35, color: 'bg-amber-500', note: 'Dense dust causes compaction' },
      sodium: { value: '> 250 ppm', percent: 90, color: 'bg-rose-500', note: 'Toxic salt accumulation' },
      ph: { value: '4.8 - 7.5 erratic', percent: 40, color: 'bg-rose-500', note: 'Locks out nitrogen & calcium' },
      expansion: { value: '8 - 10L / kg', percent: 45, color: 'bg-amber-500', note: 'Clumpy with sand & weed seeds' },
    },
  };

  const currentMetrics = metrics[mode];

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-brand-950 text-white relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-300 uppercase tracking-widest mb-3">
            <Microscope className="h-3.5 w-3.5 text-emerald-400" />
            <span>Substrate Engineering Science</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            The Science of Substrate: Why Quality Matters.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-brand-200/80 leading-relaxed text-balance">
            Compare BrickBloom&apos;s triple-washed, buffered cocopeat with standard raw coir. See the chemical &amp; physical differences that protect root architecture.
          </p>

          {/* Mode Switcher Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl">
            <button
              onClick={() => setMode('brickbloom')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                mode === 'brickbloom'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-200" />
              <span>BrickBloom Triple-Washed (Plant Ready)</span>
            </button>
            <button
              onClick={() => setMode('raw')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                mode === 'raw'
                  ? 'bg-rose-700 text-white shadow-lg shadow-rose-950/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <AlertTriangle className="h-4 w-4 text-rose-300" />
              <span>Standard Raw Coir (Unwashed)</span>
            </button>
          </div>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Summary Banner */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`lg:col-span-5 rounded-3xl p-6 sm:p-8 border backdrop-blur-xl ${
              mode === 'brickbloom'
                ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-50'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl ${
                  mode === 'brickbloom' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {mode === 'brickbloom' ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold opacity-75">
                  {mode === 'brickbloom' ? 'Certified Quality Grade' : 'Untreated Bulk Coir'}
                </p>
                <h3 className="font-display text-2xl font-normal text-white">
                  {mode === 'brickbloom' ? 'BrickBloom Media' : 'Unprocessed Coir'}
                </h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-300 mb-6">
              {mode === 'brickbloom'
                ? 'Undergoes three thorough washing cycles with freshwater, calcium-nitrate buffering to displace sodium, and fine micro-screening to remove short weeds and sand particles.'
                : 'Raw coir husk pith retains marine salts, high potassium chloride, and weed seeds from open-air coastal drying. Requires extensive on-site washing before any planting.'}
            </p>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <Zap className="h-4 w-4 text-gold-400" />
                <span>Immediate root propagation with zero shock</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Droplet className="h-4 w-4 text-blue-400" />
                <span>Uniform water dispersion without dry hydrophobia</span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={scrollToContact}
                className="w-full rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-md"
              >
                <span>Request Lab Analysis &amp; Sourcing Sheet</span>
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Right: Interactive Metric Progress Bars */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* EC Metric */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Electrical Conductivity (EC)</span>
                  <p className="text-xs text-slate-400">{currentMetrics.ec.note}</p>
                </div>
                <span className="font-mono text-base sm:text-lg font-bold text-white">
                  {currentMetrics.ec.value}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  key={mode + '-ec'}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentMetrics.ec.percent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${currentMetrics.ec.color}`}
                />
              </div>
            </div>

            {/* Air-Filled Porosity */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Air-Filled Porosity (AFP)</span>
                  <p className="text-xs text-slate-400">{currentMetrics.afp.note}</p>
                </div>
                <span className="font-mono text-base sm:text-lg font-bold text-white">
                  {currentMetrics.afp.value}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  key={mode + '-afp'}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentMetrics.afp.percent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${currentMetrics.afp.color}`}
                />
              </div>
            </div>

            {/* Sodium & Chloride Level */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Sodium (Na) &amp; Chloride (Cl)</span>
                  <p className="text-xs text-slate-400">{currentMetrics.sodium.note}</p>
                </div>
                <span className="font-mono text-base sm:text-lg font-bold text-white">
                  {currentMetrics.sodium.value}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  key={mode + '-sodium'}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentMetrics.sodium.percent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${currentMetrics.sodium.color}`}
                />
              </div>
            </div>

            {/* pH Stability */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">pH Stability</span>
                  <p className="text-xs text-slate-400">{currentMetrics.ph.note}</p>
                </div>
                <span className="font-mono text-base sm:text-lg font-bold text-white">
                  {currentMetrics.ph.value}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  key={mode + '-ph'}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentMetrics.ph.percent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${currentMetrics.ph.color}`}
                />
              </div>
            </div>

            {/* Expansion Volume */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Re-hydration Expansion Yield</span>
                  <p className="text-xs text-slate-400">{currentMetrics.expansion.note}</p>
                </div>
                <span className="font-mono text-base sm:text-lg font-bold text-white">
                  {currentMetrics.expansion.value}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  key={mode + '-expansion'}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentMetrics.expansion.percent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${currentMetrics.expansion.color}`}
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
