import { useEffect } from 'react';
import HeroCarousel from '@/components/sections/HeroCarousel';
import StatsStrip from '@/components/sections/StatsStrip';
import ProductGrid from '@/components/sections/ProductGrid';
import BrandBanner from '@/components/sections/BrandBanner';
import WhyBrickBloom from '@/components/sections/WhyBrickBloom';
import ContactForm from '@/components/sections/ContactForm';

export default function Home() {
  useEffect(() => {
    document.title = 'BrickBloom | Modern Cocopeat Sourcing — From Nature, For Nature';
  }, []);

  return (
    <main className="relative bg-background">
      <HeroCarousel />
      <ProductGrid />
      <StatsStrip />
      <BrandBanner />
      <WhyBrickBloom />
      <ContactForm />
    </main>
  );
}
