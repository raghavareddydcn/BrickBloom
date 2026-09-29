import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const SLIDES = [
  {
    src: '/images/actual-products/image-1.jpeg',
    alt: 'BrickBloom — Premium Coir Pots, Coco Peat and Gardening Kits Catalog Poster',
  },
  {
    src: '/images/actual-products/image-2.jpeg',
    alt: 'BrickBloom — Premium Coir Gardening Solutions for Every Green Space',
  },
  {
    src: '/images/actual-products/image-3.jpeg',
    alt: 'BrickBloom — Grow Greener, Live Better Catalog Poster',
  },
];

const INTERVAL = 6000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) return;
    const tickInterval = 50;
    const step = (tickInterval / INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          next();
          return 0;
        }
        return prevProgress + step;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [next, paused]);

  const scrollToProducts = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full h-[85vh] min-h-[520px] max-h-[860px] overflow-hidden bg-[#041c0e] flex items-center justify-center select-none"
      role="banner"
      aria-label="BrickBloom Hero Poster Showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient Blurred Backdrop for widescreen displays */}
      <AnimatePresence initial={false}>
        <motion.div
          key={'bg-' + SLIDES[current].src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        >
          <img
            src={SLIDES[current].src}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover filter blur-3xl scale-110 brightness-50"
          />
        </motion.div>
      </AnimatePresence>

      {/* Main Poster — Full aspect ratio with zero obstructions and bottom clearance */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto flex items-center justify-center px-4 pt-3 pb-16">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={'slide-' + SLIDES[current].src}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full flex items-center justify-center"
          >
            <img
              src={SLIDES[current].src}
              alt={SLIDES[current].alt}
              loading="eager"
              className="max-h-full max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left Chevron */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/70 hover:scale-105 active:scale-95 transition-all shadow-lg"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Right Chevron */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/70 hover:scale-105 active:scale-95 transition-all shadow-lg"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Bottom Floating Bar */}
      <div className="absolute bottom-3 left-0 right-0 z-20 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          
          {/* Slide Indicator & Dots */}
          <div className="flex items-center gap-2.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 shadow-lg">
            <span className="font-mono text-xs font-bold text-emerald-400">
              0{current + 1} / 0{SLIDES.length}
            </span>
            <div className="h-3 w-px bg-white/20 mx-0.5" />
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Jump to slide ${i + 1}`}
                  onClick={() => {
                    setCurrent(i);
                    setProgress(0);
                  }}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    i === current ? 'w-5 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Quick jump to products */}
          <motion.button
            onClick={scrollToProducts}
            aria-label="Explore products"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white/90 hover:bg-black/80 hover:text-white transition-all shadow-lg"
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <span>Explore Products</span>
            <ChevronDown className="h-3.5 w-3.5 text-emerald-400" />
          </motion.button>
        </div>
      </div>

      {/* Bottom Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30 pointer-events-none">
        <div
          className="h-full bg-emerald-400/90 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}
