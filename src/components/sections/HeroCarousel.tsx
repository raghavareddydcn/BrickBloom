import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const SLIDES = [
  {
    src:  '/images/actual-products/image-1.jpeg',
    alt:  'BrickBloom — Premium Coir Pots, Coco Peat and Gardening Kits',
  },
  {
    src:  '/images/actual-products/image-2.jpeg',
    alt:  'BrickBloom — Premium Coir Gardening Solutions for Every Green Space',
  },
  {
    src:  '/images/actual-products/image-3.jpeg',
    alt:  'BrickBloom — Grow Greener, Live Better',
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
