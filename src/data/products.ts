// BrickBloom product data — comprehensive catalog containing all 9 product formats
// Each product maps to a /products/:slug route in React Router

export interface PricingRow {
  label: string;
  qty20: string;
  qty50: string;
  qty100: string;
}

export interface ApplicationCard {
  title: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  benefit: string;
  image: string;
  heroImages?: string[];
  inclusions: string[];
  pricing?: PricingRow[];
  pricingNote?: string;
  badges: string[];
  applications: ApplicationCard[];
  ctaTitle: string;
  ctaSubtitle: string;
  metaTitle: string;
  metaDesc: string;
}

export const products: Product[] = [
  {
    slug: 'ready-pot',
    name: 'Ready Pot',
    eyebrow: 'Gift & Retail Kit',
    tagline: 'Unbox. Plant. Grow.',
    benefit: 'A ready-to-gift 4″ eco-coir pot with coco peat and premium seeds in an eco-friendly gift box.',
    image: '/images/actual-products/Ready-Pot.JPG',
    inclusions: [
      '4″ Eco-Coir Pot',
      'Sufficient coco peat for planting',
      'Premium seed(s) — also available without plant/seeds',
      'Eco-friendly gift box packaging',
    ],
    pricing: [
      { label: 'With Plant',    qty20: '₹139', qty50: '₹135', qty100: '₹129' },
      { label: 'Without Plant', qty20: '₹125', qty50: '₹119', qty100: '₹100' },
    ],
    pricingNote: 'Prices are for reference only and may vary by destination, customization, and current availability. Contact us for a custom quote.',
    badges: ['🌱 100% Natural & Biodegradable', '♻️ Sustainable & Eco-Friendly', '📦 Wholesale Minimum: 100 Units', '🎁 Perfect for Gifts & Events'],
    applications: [
      { title: 'Vegetable production',  description: 'Open top bags suit tomatoes, peppers, cucurbits and more.' },
      { title: 'Ornamental crops',      description: 'Easy plant access and clean irrigation for premium greenhouse items.' },
      { title: 'Ease of handling',      description: 'Simple fill, transport, and placement for commercial operations.' },
    ],
    ctaTitle: 'Request a quote for Ready Pot',
    ctaSubtitle: 'Share your bag dimensions, volume, and delivery location. We\'ll deliver product and packing recommendations.',
    metaTitle: 'BrickBloom Ready Pot | Eco-Coir Gift Pot with Premium Seeds',
    metaDesc:  'A ready-to-gift 4" eco-coir pot kit from BrickBloom, pre-packed with coco peat and premium seeds.',
  },
  {
    slug: 'starter-kit',
    name: 'Starter Kit',
    eyebrow: 'DIY Coir Kit',
    tagline: 'The easiest way to begin growing.',
    benefit: 'A compact 2-pot DIY coir kit with coco peat and premium seed balls for easy at-home growing.',
    image: '/images/actual-products/Strater-kit.JPG',
    inclusions: [
      '2 × 4″ Eco-Coir Pots',
      'Sufficient coco peat for planting',
      '2 Premium Seed Balls',
      'Eco-friendly packaging',
    ],
    pricing: [
      { label: 'Price / unit', qty20: '₹149', qty50: '₹145', qty100: '₹139' },
    ],
    pricingNote: 'Prices are for reference only and may vary by destination, customization, and current availability. Contact us for a custom quote.',
    badges: ['🌱 100% Natural & Biodegradable', '♻️ Sustainable & Eco-Friendly', '📦 Wholesale Minimum: 100 Units', '🌿 Promotes Healthy Root Growth'],
    applications: [
      { title: 'Seed starting',          description: 'Uniform tablets create reliable seed bed conditions.' },
      { title: 'Cutting propagation',    description: 'Stable moisture and root support for cuttings.' },
      { title: 'Retail kits',            description: 'Easy packaging for DIY garden and plant starter kits.' },
    ],
    ctaTitle: 'Request a quote for Starter Kit',
    ctaSubtitle: 'Send your order volume, destination, and preferred tablet size. We\'ll reply with pricing and delivery options.',
    metaTitle: 'BrickBloom Starter Kit | DIY Eco-Coir Starter Kit',
    metaDesc:  'A compact 2-pot DIY eco-coir starter kit with coco peat and premium seed balls from BrickBloom.',
  },
  {
    slug: 'medium-kit',
    name: 'Medium Kit',
    eyebrow: 'DIY Coir Kit',
    tagline: 'Grow bigger, grow better.',
    benefit: 'A complete 2-pot medium DIY coir kit with larger 6″ pots, coco peat, and premium seed balls.',
    image: '/images/actual-products/Medium-Kit.JPG',
    inclusions: [
      '2 × 6″ Eco-Coir Pots',
      'Sufficient coco peat for both pots',
      '2 Premium Seed Balls',
      'Eco-friendly packaging',
    ],
    pricing: [
      { label: 'Price / unit', qty20: '₹249', qty50: '₹239', qty100: '₹229' },
    ],
    pricingNote: 'Prices are for reference only and may vary by destination, customization, and current availability. Contact us for a custom quote.',
    badges: ['🌱 100% Natural & Biodegradable', '♻️ Sustainable & Eco-Friendly', '📦 Wholesale Minimum: 100 Units', '🌿 Promotes Healthy Root Growth'],
    applications: [
      { title: 'Home gardening',   description: 'Larger pots for tomatoes, herbs, and flowering plants.' },
      { title: 'Retail gifting',   description: 'Premium feel for mid-range retail and D2C gift lines.' },
      { title: 'School programs',  description: 'Ideal kit size for educational gardening programs.' },
    ],
    ctaTitle: 'Request a quote for Medium Kit',
    ctaSubtitle: 'Send your order volume, destination, and customization requests. We\'ll respond with pricing options.',
    metaTitle: 'BrickBloom Medium Kit | 6" DIY Eco-Coir Kit',
    metaDesc:  'A complete 2-pot medium DIY coir kit with 6" pots, coco peat, and premium seed balls from BrickBloom.',
  },
  {
    slug: 'premium-kit',
    name: 'Premium Kit',
    eyebrow: 'Luxury DIY Kit',
    tagline: 'Our finest kit — elevated unboxing.',
    benefit: 'Our top-tier kit with 6 eco-coir pots, a hanging coir basket, and a coco support pole in a luxury box.',
    image: '/images/actual-products/premium.png',
    inclusions: [
      '2 × 2″, 2 × 4″, 2 × 6″ Eco-Coir Pots',
      '1 × 8″ Hanging Coir Basket with Metal Chain',
      '1 × Coco Support Pole',
      'Sufficient coco peat / peat discs for the complete set',
      'Premium Seeds',
      'Eco-friendly luxury box',
    ],
    pricing: [
      { label: 'Price / unit', qty20: '₹679', qty50: '₹659', qty100: '₹649' },
    ],
    pricingNote: 'Prices are for reference only and may vary by destination, customization, and current availability. Contact us for a custom quote.',
    badges: ['🌱 100% Natural & Biodegradable', '♻️ Sustainable & Eco-Friendly', '📦 Wholesale Minimum: 100 Units', '🏆 Top-Tier Gift Experience'],
    applications: [
      { title: 'Corporate gifting',  description: 'Luxury unboxing perfect for premium corporate eco-gifts.' },
      { title: 'Retail flagship',    description: 'Hero product for plant boutiques and premium garden stores.' },
      { title: 'Event gifting',      description: 'Memorable giveaways for weddings, launches, and milestones.' },
    ],
    ctaTitle: 'Request a quote for Premium Kit',
    ctaSubtitle: 'Tell us your order volume, destination, and customization preferences. We\'ll prepare a detailed quote.',
    metaTitle: 'BrickBloom Premium Kit | Premium DIY Eco-Coir Kit',
    metaDesc:  'Our top-tier DIY coir kit — 6-pot set, hanging basket, and support pole packed in a luxury eco box.',
  },
  {
    slug: 'coco-grow-disk',
    name: 'Coco Grow Disk',
    eyebrow: 'Propagation Media',
    tagline: 'Clean propagation. Quick rooting.',
    benefit: 'Uniform coco grow disks for clean propagation, quick rooting, and tidy nursery handling.',
    image: '/images/actual-products/disk.png',
    inclusions: [
      'Uniform compressed coco disks',
      'Controlled fiber-to-pith ratio',
      'Consistent disk dimensions per batch',
      'Export-ready packaging options',
    ],
    pricing: [
      { label: 'Per unit (MOQ 500)', qty20: 'RFQ', qty50: 'RFQ', qty100: 'RFQ' },
    ],
    pricingNote: 'Pricing varies by disk size and order volume. Contact us for a custom commercial quote.',
    badges: ['🌱 100% Natural Coir', '🔬 Uniform Disk Size', '📦 Bulk Export Ready', '🌿 Quick Root Development'],
    applications: [
      { title: 'Seed propagation',  description: 'Reliable uniform disks for mass-scale seed starting.' },
      { title: 'Cutting rooting',   description: 'Ideal moisture and aeration for strong early roots.' },
      { title: 'Nursery handling',  description: 'Clean, stackable format for efficient nursery workflows.' },
    ],
    ctaTitle: 'Request a quote for Coco Grow Disk',
    ctaSubtitle: 'Tell us your disk size, quantity, and destination port. We\'ll prepare a commercial offer.',
    metaTitle: 'BrickBloom Coco Grow Disk | Propagation Grow Disks',
    metaDesc:  'Uniform coco grow disks from BrickBloom for clean propagation, quick rooting, and nursery operations.',
  },
  {
    slug: 'premium-cocopeat',
    name: 'Premium Cocopeat',
    eyebrow: 'Bulk Growing Media',
    tagline: 'Triple-washed. Export-grade. Crop-ready.',
    benefit: 'Premium cocopeat media formulated for strong root growth and reliable moisture retention.',
    image: '/images/actual-products/Brick.JPG',
    inclusions: [
      'Excellent bulk handling for nurseries and greenhouse operations',
      'Hydrates fast into a stable, root-friendly substrate',
      'Available in practical sizes for both retail and industrial supply chains',
    ],
    pricing: undefined,
    pricingNote: 'Pricing varies by block size, EC level, and container volume. Contact us for a freight-inclusive export quote.',
    badges: ['🌿 Triple-Washed', '🔬 Low EC ≤ 0.5 mS/cm', '📦 FCL Export Ready', '✅ pH Balanced 5.5–6.5'],
    applications: [
      { title: 'Seedlings & cuttings', description: 'Consistent moisture and good aeration for early root growth.' },
      { title: 'Export packing',       description: 'Compressed format reduces shipping cost and keeps product fresh.' },
      { title: 'Commercial growers',   description: 'Batch-friendly media for nurseries and greenhouse production.' },
    ],
    ctaTitle: 'Request a quote for Premium Cocopeat',
    ctaSubtitle: 'Send your order volume, destination port, and preferred block sizes. We\'ll reply with availability and freight options.',
    metaTitle: 'BrickBloom Premium Cocopeat | Bulk Cocopeat Media',
    metaDesc:  'Premium bulk cocopeat from BrickBloom — triple-washed, low EC, export-ready for commercial growers.',
  },
  {
    slug: 'coco-bricks',
    name: 'Coco Bricks',
    eyebrow: 'Compressed Substrates',
    tagline: 'High-expansion compressed bricks.',
    benefit: 'Compressed cocopeat bricks for potting mixes, seedling beds, and retail garden packs.',
    image: '/images/Brick5KG.jpeg',
    inclusions: [
      'Compact format minimizes storage space and container freight costs',
      'Fast water absorption and high volume expansion',
      'Suitable for automated mixing and retail distribution',
    ],
    pricing: undefined,
    pricingNote: 'Available in 650g and 5kg bricks. Request wholesale volume pricing.',
    badges: ['🧱 High Compression Ratio', '💧 Fast Hydration', '🌱 100% Organic Substrate', '📦 Global Export Ready'],
    applications: [
      { title: 'Mixing lines',      description: 'Easy hydration into consistent media blends for batches or custom mixes.' },
      { title: 'Retail packaging',  description: 'Neat bricks for garden center retail and grower convenience.' },
      { title: 'Propagation beds',  description: 'Reliable foundation media for shrubs, vegetables, and ornamentals.' },
    ],
    ctaTitle: 'Request a quote for Coco Bricks',
    ctaSubtitle: 'Share your required brick count, format (650g or 5kg), and destination. We\'ll reply with freight and pricing.',
    metaTitle: 'BrickBloom Coco Bricks | Compressed Cocopeat Bricks',
    metaDesc:  'High-compression cocopeat bricks that expand into a rich, airy medium for seedling beds and potting mixes.',
  },
  {
    slug: 'coco-growslabs',
    name: 'Coco GrowSlabs',
    eyebrow: 'Greenhouse Hydroponics',
    tagline: 'Precision greenhouse growing slabs.',
    benefit: 'Ready-to-use slabs crafted for hydroponic channels, balanced drainage, and crop steering.',
    image: '/images/ALL products.png',
    inclusions: [
      'Uniform slab shape supports quick bench and gutter setup',
      'Engineered fiber-to-pith ratio for root-zone oxygenation',
      'UV-treated poly sleeve options with pre-cut planting & drainage slits',
    ],
    pricing: undefined,
    pricingNote: 'Custom dimensions and fiber-to-pith ratios available on contract orders.',
    badges: ['🍅 Hydroponic Ready', '📐 Precision Dimensions', '🌿 High Air Porosity', '💧 Even Water Distribution'],
    applications: [
      { title: 'Vegetable greenhouses', description: 'Engineered for vine crops: tomatoes, bell peppers, and cucumbers.' },
      { title: 'Berry production',      description: 'Optimized aeration and root health for strawberry and berry gutters.' },
      { title: 'Custom blends',         description: 'Tailored slab density and chip ratio for specific crop watering regimes.' },
    ],
    ctaTitle: 'Request a quote for Coco GrowSlabs',
    ctaSubtitle: 'Share your desired slab dimensions, volume, and destination. We\'ll prepare custom container pricing.',
    metaTitle: 'BrickBloom Coco GrowSlabs | Ready-to-use Growing Slabs',
    metaDesc:  'Ready-to-use cocopeat slabs crafted for clean crop placement, balanced root-zone conditions, and greenhouse yields.',
  },
  {
    slug: 'coir-chips',
    name: 'Coir Chips',
    eyebrow: 'Aeration & Drainage',
    tagline: 'Enhanced aeration and drainage media.',
    benefit: 'Open-structure coir chips for superior drainage, root aeration, and soil blending.',
    image: '/images/coir-chips.svg',
    inclusions: [
      'Uniform chip sizing for consistent root aeration',
      'Naturally resilient husk chunks resistant to decomposition',
      'Low dust and washed to maintain optimal EC stability',
    ],
    pricing: undefined,
    pricingNote: 'Available in bulk compressed bales or custom blend bags.',
    badges: ['💨 Maximum Aeration', '🚿 Superior Drainage', '🌸 Ideal for Orchids', '⏳ Long Substrate Life'],
    applications: [
      { title: 'Orchid mixes',      description: 'Airy, fast-draining substrate for epiphytes and premium ornamentals.' },
      { title: 'Soil blending',     description: 'Add structure and porosity to container substrates without losing moisture balance.' },
      { title: 'Propagation beds', description: 'Improve aeration for cuttings and seedling trays with steady water movement.' },
    ],
    ctaTitle: 'Request a quote for BrickBloom Coir Chips',
    ctaSubtitle: 'Send your order volume, destination, and desired chip size. We\'ll respond with product options.',
    metaTitle: 'BrickBloom Coir Chips | Drainage and Soil Blend Media',
    metaDesc:  'Open-structure coir chips for enhanced drainage, aeration, and soil blending in nursery media.',
  },
];

export const productBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

// Sourcing hubs shown on homepage
export const sourcingHubs = [
  { region: 'India',            focus: 'Large-scale processing, low-EC custom blends, and compressed bales.' },
  { region: 'Sri Lanka',        focus: 'Naturally aged, high-porosity cocopeat for premium media mixes.' },
  { region: 'Global networks',  focus: 'Direct sourcing from certified mills and exporters worldwide.' },
];

// Quality badges shown on homepage
export const qualityNotes = [
  'Washed and buffered media for lower salinity.',
  'Custom peat-to-chip ratios for different crop programs.',
  'Bulk freight-ready packaging for long-haul export.',
];
