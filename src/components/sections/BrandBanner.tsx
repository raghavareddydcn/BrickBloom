import { Award, Droplets, Leaf, ShieldCheck, Sparkles } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Leaf, text: 'Triple-washed with fresh water for low sodium & chloride levels' },
  { icon: Droplets, text: 'Strict EC control — consistently ≤ 0.5 mS/cm' },
  { icon: ShieldCheck, text: 'pH balanced between 5.8–6.5 for maximum root nutrient uptake' },
  { icon: Award, text: 'Compressed formats optimized for efficient global ocean freight' },
];

export default function BrandBanner() {
  return (
    <section id="brand" className="bg-[#052312] text-white relative overflow-hidden py-20 sm:py-28">
      {/* Background radial glow */}
      <div className="absolute top-1/2 -left-20 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>The BrickBloom Standard</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.18] text-balance">
              Pure Coconut Coir.<br />
              <span className="text-emerald-300">Uncompromised Quality.</span>
            </h2>

            <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed font-normal">
              From raw coconut husk to finished, triple-washed substrate — BrickBloom processes high-grade coir fiber and pith with strict EC and pH controls to maximize root aeration, water distribution, and crop resilience.
            </p>

            {/* Quality List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {HIGHLIGHTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-200 leading-snug">{item.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Tagline Quote */}
            <blockquote className="border-l-2 border-amber-400 pl-4 py-1 mt-6">
              <p className="font-serif italic text-amber-200/90 text-sm sm:text-base">
                &ldquo;From Nature, For Nature &mdash; Engineered for Precision Growing.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Right: Official Brand Logo Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] w-full max-w-lg border border-white/15 shadow-2xl bg-white/10 backdrop-blur-md p-3 sm:p-5 flex items-center justify-center">
              <img
                src="/images/OurProducts/Logo_new.jpeg"
                alt="BrickBloom Official Logo"
                className="h-full w-full object-cover rounded-2xl shadow-md"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
