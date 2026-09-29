import { useEffect } from 'react';
import HeroCarousel from '@/components/sections/HeroCarousel';
import StatsStrip from '@/components/sections/StatsStrip';
import ProductGrid from '@/components/sections/ProductGrid';
import SubstrateVisualizer from '@/components/sections/SubstrateVisualizer';
import BrandBanner from '@/components/sections/BrandBanner';
import WhyBrickBloom from '@/components/sections/WhyBrickBloom';
import ContactForm from '@/components/sections/ContactForm';
import EcoCanvas from '@/components/effects/EcoCanvas';

export default function Home() {
  useEffect(() => {
    document.title = 'BrickBloom | Modern Cocopeat Sourcing — From Nature, For Nature';
  }, []);

  return (
    <main className="relative">
      <EcoCanvas />
      <HeroCarousel />
      <StatsStrip />
      <ProductGrid />
      <SubstrateVisualizer />
      <BrandBanner />
      <WhyBrickBloom />
      <ContactForm />
    </main>
  );
}
