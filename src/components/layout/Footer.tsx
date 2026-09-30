import { Link } from 'react-router-dom';
import { Mail, MapPin, Package } from 'lucide-react';
import { products } from '@/data/products';

const COMPANY_LINKS = [
  { label: 'Our Craft',      href: '/#brand' },
  { label: 'Why BrickBloom', href: '/#why' },
  { label: 'Sourcing Desk',  href: '/#contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-white">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4" aria-label="BrickBloom home">
              <img
                src="/images/OurProducts/Logo_new.jpeg"
                alt="BrickBloom logo"
                className="h-10 w-10 rounded-lg object-cover"
                loading="lazy"
              />
              <span className="font-sans font-semibold text-lg text-brand-100 tracking-tight">BrickBloom</span>
            </Link>
            <p className="text-brand-300 text-sm leading-relaxed max-w-xs">
              Premium coconut coir substrates sourced directly from certified processing mills across southern India.
            </p>
            <p className="mt-4 text-xs text-brand-400 font-medium tracking-widest uppercase">
              From Nature, For Nature
            </p>
          </div>

          {/* Products column */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-brand-100 mb-4 uppercase tracking-wider">
              <Package className="w-4 h-4 text-brand-400" />
              Products
            </h4>
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/products/${p.slug}`}
                    className="text-sm text-brand-300 hover:text-white transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-sm font-semibold text-brand-100 mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-brand-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-sm font-semibold text-brand-100 mb-4 uppercase tracking-wider">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:admin@brickbloom.co.in"
                  className="text-sm text-brand-300 hover:text-white transition-colors break-all"
                >
                  admin@brickbloom.co.in
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-brand-300">India</span>
              </li>
              <li className="mt-4 px-3 py-2 rounded-lg bg-brand-900/60 border border-brand-800">
                <p className="text-xs font-semibold text-brand-300 uppercase tracking-wide mb-0.5">FCL Container Export</p>
                <p className="text-xs text-brand-400">20ft / 40ft High Cube</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-500 text-center sm:text-left">
            &copy; {year} Konasema Coco Products LLP. BrickBloom is a trademark of Konasema Coco Products LLP.
          </p>
          <p className="text-xs text-brand-600 font-medium">
            From Nature, For Nature.
          </p>
        </div>
      </div>
    </footer>
  );
}
