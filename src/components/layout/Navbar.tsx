import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen]       = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();

  // Track scroll for glass-blur intensification
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setProductsOpen(false);
  }, [location]);

  const handleHashNav = (hash: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/${hash}`;
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-glass border-b border-border/60'
          : 'bg-white/80 backdrop-blur-md border-b border-border/40'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="BrickBloom home">
            <img
              src="/images/OurProducts/Logo_new.jpeg"
              alt="BrickBloom logo"
              className="h-9 w-auto rounded-md object-cover"
              loading="eager"
            />
            <span className="hidden sm:block font-sans font-semibold text-lg text-brand-800 tracking-tight">
              BrickBloom
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-brand-100 text-brand-800'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                )
              }
            >
              Home
            </NavLink>

            {/* Products dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-1"
                aria-expanded={productsOpen}
              >
                Products
                <svg className={cn('w-3.5 h-3.5 transition-transform', productsOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl border border-border shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-2">
                      {products.map((p) => (
                        <Link
                          key={p.slug}
                          to={`/products/${p.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition-colors group"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                            <Leaf className="w-4 h-4 text-brand-700" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-800 leading-tight">{p.name}</p>
                            <p className="text-xs text-slate-500 truncate">{p.eyebrow}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleHashNav('#why')}
              className="px-4 py-2 rounded-full text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Quality & Specs
            </button>
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex"
            >
              <a
                href="/#contact"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Request Quote
              </a>
            </Button>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-white border-t border-border"
          >
            <nav className="px-4 pt-3 pb-6 space-y-1" aria-label="Mobile navigation">
              <Link
                to="/"
                className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-800 transition-colors"
              >
                Home
              </Link>

              {/* Mobile Products section */}
              <div>
                <p className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Products</p>
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/products/${p.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-800 transition-colors"
                  >
                    <Leaf className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    {p.name}
                  </Link>
                ))}
              </div>

              <button
                onClick={() => handleHashNav('#why')}
                className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-800 transition-colors"
              >
                Quality & Specs
              </button>

              <div className="pt-2">
                <Button asChild className="w-full" size="lg">
                  <a href="/#contact">Request a Quote →</a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
