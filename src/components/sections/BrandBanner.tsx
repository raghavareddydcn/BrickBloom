import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Check, Droplets, Leaf, ShieldCheck, Sparkles } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Leaf, text: 'Triple-washed with fresh water for low sodium & chloride levels' },
  { icon: Droplets, text: 'Strict EC control — consistently ≤ 0.5 mS/cm' },
  { icon: ShieldCheck, text: 'pH balanced between 5.8–6.5 for maximum root nutrient uptake' },
  { icon: Award, text: 'Compressed formats optimized for efficient global ocean freight' },
];

export default function BrandBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-70px' });

  return (
    <section id="brand" className="bg-brand-950 text-white relative overflow-hidden py-24 sm:py-32">
      {/* Background radial glows */}
      <div className="absolute top-1/2 -left-32 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 px-3 py-1 text-xs font-bold text-gold-300 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              <span>The BrickBloom Standard</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.15] text-balance">
              Pure Coconut Coir.<br />
              <span className="text-emerald-300">Uncompromised Quality.</span>
            </h2>

            <p className="text-brand-200/90 text-base sm:text-lg leading-relaxed font-normal">
              From raw coconut husk to finished, triple-washed substrate — BrickBloom processes high-grade coir fiber and pith with strict EC and pH controls to maximize root aeration, water distribution, and crop resilience.
            </p>

            {/* Quality List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {HIGHLIGHTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-sm">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-200 leading-snug">{item.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Tagline Quote with Gold Accents */}
            <div className="pt-2">
              <blockquote className="rounded-2xl border-l-4 border-gold-400 bg-gold-950/20 backdrop-blur-md p-4 sm:p-5 border-y border-r border-gold-500/20">
                <p className="font-display text-xl sm:text-2xl text-gold-200 italic tracking-wide">
                  &ldquo;BrickBloom — From Nature, For Nature&rdquo;
                </p>
                <p className="mt-1 text-xs text-gold-400/80 uppercase tracking-wider font-semibold">
                  Certified Natural Coir Substrates • Konaseema Coco Products LLP
                </p>
              </blockquote>
            </div>
          </motion.div>

          {/* Right: Media Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Glow ring */}
            <div className="relative rounded-3xl border-2 border-white/20 bg-white/5 p-2 shadow-2xl backdrop-blur-md overflow-hidden group">
              <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-slate-900">
                <img
                  src="/images/natural-coir-photo.jpg"
                  alt="Natural Coconut Coir & Cocopeat Substrate"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Floating Quality Seal */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-4 sm:left-4 rounded-2xl border border-white/20 bg-emerald-950/90 backdrop-blur-xl px-4 py-3 shadow-xl text-white flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500/20 text-gold-300 border border-gold-500/40">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gold-300">Lab Tested &amp; Certified</p>
                  <p className="text-xs font-semibold text-white">Weed-Free &amp; Pathogen-Clean</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
