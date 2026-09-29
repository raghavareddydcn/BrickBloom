import { Box, Droplets, Factory, Layers, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Droplets,
    badge: 'Purity Standard',
    title: 'Triple-Washed Media',
    desc: 'Strict sodium and chloride leaching protocols guarantee electrical conductivity ≤ 0.5 mS/cm for immediate planting without shock.',
    accent: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    icon: Layers,
    badge: 'Process Control',
    title: 'Batch Consistency',
    desc: 'Uniform micro-sieved particle sizing and standardized pith-to-fiber ratios across every container batch for predictable crop feeding.',
    accent: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    icon: Box,
    badge: 'Logistics Efficient',
    title: 'Freight-Optimized Packaging',
    desc: 'High-compression 5kg blocks, GrowSlabs, and easy-stack pallets engineered to maximize cubic container volume and reduce ocean freight costs.',
    accent: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    icon: Factory,
    badge: 'Direct Supply',
    title: 'Direct Coastal Mill Sourcing',
    desc: 'Direct container shipments from certified processing facilities in southern India and Sri Lanka with dedicated supply volume assurance.',
    accent: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  },
];

const HUBS = [
  {
    flag: '🇮🇳 India Hub',
    spec: 'Large-scale processing, low-EC custom blends, buffered coir pith, and high-cube container consolidation.',
  },
  {
    flag: '🇱🇰 Sri Lanka Hub',
    spec: 'Aged premium coco chips, high air-filled porosity growbags, and specialty greenhouse hydroponic slabs.',
  },
  {
    flag: '🌍 Global Export Desk',
    spec: 'CIF & FOB freight quotes, phytosanitary certificates, SGS lab test verification, and fast customs dispatch.',
  },
];

export default function WhyBrickBloom() {
  return (
    <section id="why" className="py-20 sm:py-28 bg-[#fdfbf7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span>Why BrickBloom</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
            Engineered substrate superiority.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
            Built to maximize crop root aeration, optimize irrigation cycles, and deliver rock-solid container batch consistency.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className={`grid h-12 w-12 place-items-center rounded-xl border ${feature.accent}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Coastal Mill Sourcing Hubs */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {HUBS.map((hub) => (
            <div
              key={hub.flag}
              className="rounded-2xl border border-[#ebdcc7] bg-[#f8f3ea]/60 p-5 shadow-sm"
            >
              <h4 className="font-display text-base font-semibold text-slate-900 mb-1.5">{hub.flag}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{hub.spec}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
