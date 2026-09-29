import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, FileText, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  {
    src: '/images/actual-products/image-1.jpeg',
    alt: 'BrickBloom — Premium Coir Pots, Coco Peat and Gardening Kits',
    caption: 'Pure Coconut Substrates for Hydroponic & Nursery Precision',
  },
  {
    src: '/images/actual-products/image-2.jpeg',
    alt: 'BrickBloom — Premium Coir Gardening Solutions for Every Green Space',
    caption: 'Direct Mill Sourcing with Strict EC & pH Standardization',
  },
  {
    src: '/images/actual-products/image-3.jpeg',
    alt: 'BrickBloom — Grow Greener, Live Better',
    caption: '100% Organic, Sustainable Growing Media for Higher Crop Yields',
  },
];

const INTERVAL = 6500;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  // Smooth progress ticker
  useEffect(() => {
    if (paused) return;
    const tickInterval = 50;
    const step = (tickInterval / INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          next();
          return 0;
        }
        return prev + step;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [next, paused]);

  const scrollToProducts = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full min-h-[92svh] max-h-[960px] overflow-hidden bg-slate-950 flex items-center justify-center"
      role="banner"
      aria-label="BrickBloom hero banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Slides with Ken-Burns and Crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={SLIDES[current].src}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={SLIDES[current].src}
            alt={SLIDES[current].alt}
            className="h-full w-full object-cover object-center filter brightness-[0.78]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Layered Cinematic Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/35 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

      {/* Subtle organic radial glows */}
      <div className="absolute -left-20 top-1/4 z-10 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 z-10 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Left Copy */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-emerald-300 shadow-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
              </span>
              <span>Direct Mill Sourcing • Certified Processing in India &amp; Sri Lanka</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-6xl lg:text-7xl text-white font-normal tracking-tight leading-[1.1]"
            >
              Modern Cocopeat for Precision Growing.
            </motion.h1>

            {/* Tagline & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 max-w-2xl"
            >
              <p className="font-display text-2xl sm:text-3xl italic bg-gradient-to-r from-gold-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent">
                &ldquo;From Nature, For Nature&rdquo;
              </p>
              <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed font-normal">
                Triple-washed, low EC (≤ 0.5 mS/cm) substrates engineered for hydroponics, commercial nurseries, and sustainable growers worldwide.
              </p>
            </motion.div>

            {/* Interactive Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              <Button
                size="lg"
                onClick={scrollToProducts}
                className="rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold px-7 py-6 text-sm sm:text-base shadow-xl shadow-brand-950/50 hover:shadow-brand-500/25 transition-all hover:scale-105 active:scale-95 group"
              >
                Explore Product Family
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToContact}
                className="rounded-full border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-semibold px-6 py-6 text-sm sm:text-base hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <FileText className="mr-2 h-4 w-4 text-gold-300" />
                Request Commercial Quote
              </Button>
            </motion.div>
          </div>

          {/* Right Floating Interactive Physics Badges */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-4">
            
            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 shadow-2xl text-white hover:border-emerald-400/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-emerald-300">Triple-Washed Quality</p>
                  <p className="text-sm font-semibold text-white">Low EC ≤ 0.5 mS/cm Guaranteed</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-300/80 leading-relaxed">
                Buffered and naturally aged to protect sensitive young roots from sodium burn.
              </p>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 shadow-2xl text-white hover:border-gold-400/40 transition-colors ml-4"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-gold-300">Optimal Air Porosity</p>
                  <p className="text-sm font-semibold text-white">High Expansion &amp; Drainage</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-300/80 leading-relaxed">
                Uniform pith-to-fiber ratio for maximum root oxygenation and irrigation efficiency.
              </p>
            </motion.div>

            {/* Floating Card 3 */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 shadow-2xl text-white hover:border-emerald-400/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-blue-300">Global Export Ready</p>
                  <p className="text-sm font-semibold text-white">FCL Containers (20ft / 40ft HQ)</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-300/80 leading-relaxed">
                Palletized or floor loaded directly from certified coastal processing hubs.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Dot Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Active slide progress indicator */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-white/60">
              0{current + 1} / 0{SLIDES.length}
            </span>
            <div className="h-1.5 w-36 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-emerald-400 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => {
                    setCurrent(i);
                    setProgress(0);
                  }}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    i === current ? 'w-6 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Scroll Down Hint Button */}
          <motion.button
            onClick={scrollToProducts}
            aria-label="Scroll down to products"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-white/80 hover:bg-white/20 hover:text-white transition-all"
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <span>Explore Substrates</span>
            <ChevronDown className="h-3.5 w-3.5 text-emerald-300" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
