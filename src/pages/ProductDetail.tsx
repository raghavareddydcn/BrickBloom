import { useEffect, useRef } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productBySlug, products } from '@/data/products';
import ContactForm from '@/components/sections/ContactForm';

const LEGACY_MAP: Record<string, string> = {
};

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate  = useNavigate();
  
  const effectiveSlug = slug || LEGACY_MAP[location.pathname.toLowerCase()];
  const product = effectiveSlug ? productBySlug(effectiveSlug) : undefined;

  useEffect(() => {
    if (!product) {
      navigate('/404', { replace: true });
      return;
    }
    document.title = product.metaTitle;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [product, navigate]);

  if (!product) return null;

  // Sidebar products (other products)
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  const heroRef  = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const appRef   = useRef<HTMLDivElement>(null);

  const heroInView  = useInView(heroRef,  { once: true });
  const priceInView = useInView(priceRef, { once: true, margin: '-60px' });
  const appInView   = useInView(appRef,   { once: true, margin: '-60px' });

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white section-pad-sm">
        <div className="max-w-7xl mx-auto" ref={heroRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-brand-700 font-medium hover:text-brand-900 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                All Products
              </Link>

              <span className="eyebrow">{product.eyebrow}</span>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="mt-3 text-lg text-brand-700 font-medium italic font-display">
                {product.tagline}
              </p>
              <p className="mt-4 text-base text-slate-500 leading-relaxed max-w-lg">
                {product.benefit}
              </p>

              {/* Inclusions */}
              <div className="mt-8">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                  What's included
                </h2>
                <ul className="space-y-2">
                  {product.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <a href="#contact-form" onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Request a Quote
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:admin@brickbloom.co.in">Email Directly</a>
                </Button>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden aspect-square sm:aspect-[4/3] bg-brand-50 shadow-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-medium text-brand-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      {product.pricing && product.pricing.length > 0 && (
        <section className="section-pad bg-background" ref={priceRef}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={priceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <span className="eyebrow">Wholesale Pricing</span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-slate-900">
                Bulk unit pricing for {product.name}
              </h2>
              <p className="mt-3 text-slate-500 max-w-xl mx-auto">
                Reference pricing from BrickBloom&rsquo;s catalog. Minimum wholesale order: 100 units.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={priceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-2xl border border-border bg-white shadow-card overflow-hidden"
            >
              <div className="table-scroll">
                <table className="pricing-table">
                  <caption className="sr-only">Wholesale unit price (₹)</caption>
                  <thead>
                    <tr>
                      <th>Variant</th>
                      <th>20 units</th>
                      <th>50 units</th>
                      <th>100 units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.pricing.map((row) => (
                      <tr key={row.label}>
                        <td className="font-medium text-slate-800">{row.label}</td>
                        <td>{row.qty20}</td>
                        <td>{row.qty50}</td>
                        <td className="font-semibold text-brand-700">{row.qty100}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {product.pricingNote && (
                <p className="px-5 py-4 text-xs text-muted-foreground border-t border-border bg-slate-50">
                  ⓘ {product.pricingNote}
                </p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Applications */}
      <section className="section-pad bg-white" ref={appRef}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={appInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="eyebrow">Applications</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-slate-900">
              Where {product.name} excels.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {product.applications.map((app, i) => (
              <motion.article
                key={app.title}
                initial={{ opacity: 0, y: 20 }}
                animate={appInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="rounded-2xl bg-brand-50 border border-brand-100 p-6"
              >
                <h3 className="font-display text-lg text-brand-900 mb-2">{app.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{app.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="section-pad-sm bg-background border-y border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl text-slate-800 mb-6">Other Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/products/${p.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5 p-4 transition-all"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-brand-50">
                  <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-800 group-hover:text-brand-800 transition-colors">{p.name}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{p.eyebrow}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-700 flex-shrink-0 ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <ContactForm />
    </>
  );
}
