import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  {
    src:  '/images/actual-products/image-1.jpeg',
    alt:  'BrickBloom — Premium Coir Pots, Coco Peat and Gardening Kits',
    heading: 'From Nature,\nFor Nature.',
    sub:     'Premium coconut coir substrates — triple-washed, export-grade, crop-ready.',
  },
  {
    src:  '/images/actual-products/image-2.jpeg',
    alt:  'BrickBloom — Premium Coir Gardening Solutions for Every Green Space',
    heading: 'Engineered for\nEvery Grower.',
    sub:     'Custom EC & pH buffering, FCL container shipping, 24-hour quote turnaround.',
  },
  {
    src:  '/images/actual-products/image-3.jpeg',
    alt:  'BrickBloom — Grow Greener, Live Better',
    heading: 'Grow Greener.\nLive Better.',
    sub:     'Sourced directly from certified mills in India and Sri Lanka.',
  },
];

const INTERVAL = 5000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next, paused]);

  const scrollToProducts = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full h-[90svh] min-h-[560px] max-h-[900px] overflow-hidden"
      role="banner"
      aria-label="BrickBloom hero banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Images */}
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`hero-slide ${i === current ? 'is-active' : ''}`}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/65 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            {/* Eyebrow badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-600/80 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-300 animate-pulse" />
              Premium Cocopeat &mdash; Export Ready
            </motion.span>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] whitespace-pre-line tracking-tight drop-shadow-lg">
              {SLIDES[current].heading}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
              {SLIDES[current].sub}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="xl"
                onClick={scrollToProducts}
                className="w-full sm:w-auto shadow-lg"
              >
                Explore Products
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto border-white/60 text-white hover:bg-white/15 hover:border-white backdrop-blur-sm bg-white/10"
                asChild
              >
                <a href="/#contact">Request a Quote →</a>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot navigation */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
        role="tablist"
        aria-label="Hero slides"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            onClick={() => { setCurrent(i); setPaused(false); }}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <motion.button
        onClick={scrollToProducts}
        aria-label="Scroll to products"
        className="absolute bottom-8 right-6 sm:right-10 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-5 h-5" />
      </motion.button>
    </section>
  );
}
