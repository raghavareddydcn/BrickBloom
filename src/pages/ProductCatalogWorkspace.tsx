import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Grid3X3,
  List,
  Star,
  CheckCircle2,
  FileText,
  MessageCircle,
  Copy,
  ExternalLink,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  X,
  Layers,
  ShieldCheck,
  Check,
  Percent,
  ChevronUp,
  ChevronDown,
  Boxes,
  Clock,
  Droplets,
} from 'lucide-react';
import {
  CATALOG_CATEGORIES,
  CATALOG_PRODUCTS,
  type CatalogProduct,
} from '@/data/catalogProducts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface OrderItemDraft {
  product: CatalogProduct;
  qty: number;
}

export default function ProductCatalogWorkspace() {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [filterInStockOnly, setFilterInStockOnly] = useState(false);
  const [filterBestsellersOnly, setFilterBestsellersOnly] = useState(false);
  const [filterGst5Only, setFilterGst5Only] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Active selected image index for card gallery
  const [activeThumbnails, setActiveThumbnails] = useState<Record<string, number>>({});

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<CatalogProduct | null>(null);
  const [modalActiveImage, setModalActiveImage] = useState<string>('');
  const [modalQty, setModalQty] = useState<number>(50);

  // Floating Order Sheet / Cart State
  const [orderItems, setOrderItems] = useState<OrderItemDraft[]>([]);
  const [isOrderTrayOpen, setIsOrderTrayOpen] = useState(false);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch image on card
  const handleCardImageSelect = (productId: string, imgIndex: number) => {
    setActiveThumbnails((prev) => ({ ...prev, [productId]: imgIndex }));
  };

  // Open Quick View Modal
  const openQuickView = (product: CatalogProduct) => {
    setQuickViewProduct(product);
    setModalActiveImage(product.image);
    setModalQty(product.moq || 25);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'All Products' && product.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesEyebrow = product.eyebrow.toLowerCase().includes(q);
        const matchesTagline = product.tagline.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesHighlights = product.highlights.some((h) => h.toLowerCase().includes(q));
        if (!matchesName && !matchesSku && !matchesEyebrow && !matchesTagline && !matchesCategory && !matchesHighlights) {
          return false;
        }
      }
      // In stock filter
      if (filterInStockOnly && product.stockStatus !== 'in_stock') {
        return false;
      }
      // Bestseller filter
      if (filterBestsellersOnly && !product.badges.some((b) => /bestseller|choice/i.test(b))) {
        return false;
      }
      // 5% GST filter
      if (filterGst5Only && product.gstRate !== 5) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price100 - b.price100;
      if (sortBy === 'price-desc') return b.price100 - a.price100;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // featured retains curated order
    });
  }, [searchQuery, selectedCategory, filterInStockOnly, filterBestsellersOnly, filterGst5Only, sortBy]);

  // Order Sheet Helper Functions
  const addToOrderSheet = (product: CatalogProduct, qtyToAdd?: number) => {
    const qty = qtyToAdd || product.moq || 20;
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { product, qty }];
    });
    showToast(`Added ${qty} × ${product.name} to quotation order sheet!`);
  };

  const updateOrderItemQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setOrderItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setOrderItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, qty: newQty } : item))
      );
    }
  };

  const removeOrderItem = (productId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearOrderSheet = () => {
    setOrderItems([]);
    showToast('Order sheet cleared.');
  };

  // Calculate tier price based on quantity
  const getProductPriceForQty = (product: CatalogProduct, qty: number) => {
    if (qty >= 100) return product.price100;
    if (qty >= 50) return product.price50;
    return product.price1;
  };

  // Order Sheet Total Metrics
  const orderMetrics = useMemo(() => {
    let totalUnits = 0;
    let subtotal = 0;
    let totalGst = 0;

    orderItems.forEach(({ product, qty }) => {
      totalUnits += qty;
      const unitPrice = getProductPriceForQty(product, qty);
      const itemSubtotal = unitPrice * qty;
      const gst = (itemSubtotal * (product.gstRate || 0)) / 100;
      subtotal += itemSubtotal;
      totalGst += gst;
    });

    return {
      totalUnits,
      subtotal,
      totalGst,
      grandTotal: subtotal + totalGst,
    };
  }, [orderItems]);

  // Copy SKU
  const copySkuToClipboard = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
    showToast(`SKU ${sku} copied!`);
  };

  // Launch Tax Invoice with single item
  const launchInvoiceWithItem = (product: CatalogProduct, qty: number = 50) => {
    const unitPrice = getProductPriceForQty(product, qty);
    const draftData = [
      {
        rowId: crypto.randomUUID(),
        productName: product.invoiceItemName,
        qty,
        price: unitPrice,
        gstRate: product.gstRate,
      },
    ];
    sessionStorage.setItem('bb_catalog_order_items', JSON.stringify(draftData));
    navigate('/admin/invoices?source=catalog');
  };

  // Transfer whole Order Sheet to Tax Invoice
  const transferOrderSheetToInvoice = () => {
    if (orderItems.length === 0) return;
    const draftData = orderItems.map(({ product, qty }) => ({
      rowId: crypto.randomUUID(),
      productName: product.invoiceItemName,
      qty,
      price: getProductPriceForQty(product, qty),
      gstRate: product.gstRate,
    }));
    sessionStorage.setItem('bb_catalog_order_items', JSON.stringify(draftData));
    navigate('/admin/invoices?source=catalog');
  };

  // Share formatted WhatsApp catalog quotation
  const shareWhatsAppQuotation = (product?: CatalogProduct, qty?: number) => {
    let text = '';
    if (product) {
      const q = qty || product.moq || 50;
      const price = getProductPriceForQty(product, q);
      const sub = price * q;
      const gst = (sub * product.gstRate) / 100;
      const total = sub + gst;

      text = `*BRICKBLOOM™ PRODUCT QUOTATION*\n` +
        `----------------------------------------\n` +
        `*Product:* ${product.name}\n` +
        `*SKU:* ${product.sku}\n` +
        `*Category:* ${product.category}\n` +
        `*Specs:* ${product.specs.dimensions || ''} | ${product.specs.material || ''}\n\n` +
        `*Wholesale Pricing Tier:*\n` +
        `• 1-49 units: ₹${product.price1}/unit\n` +
        `• 50-99 units: ₹${product.price50}/unit\n` +
        `• 100+ units: ₹${product.price100}/unit (Bulk)\n\n` +
        `*Your Quote (${q} Units):*\n` +
        `• Unit Price: ₹${price}\n` +
        `• Subtotal: ₹${sub.toLocaleString('en-IN')}\n` +
        `• GST (${product.gstRate}%): ₹${gst.toLocaleString('en-IN')}\n` +
        `• *Estimated Total: ₹${total.toLocaleString('en-IN')}*\n\n` +
        `*Stock Status:* In Stock • Bangalore & Konaseema Hub\n` +
        `*Contact:* BrickBloom Commercial Sales\n` +
        `🌐 https://brickbloom.com`;
    } else {
      if (orderItems.length === 0) return;
      text = `*BRICKBLOOM™ B2B WHOLESALE QUOTATION*\n` +
        `----------------------------------------\n` +
        orderItems
          .map(({ product, qty }, i) => {
            const price = getProductPriceForQty(product, qty);
            const lineSub = price * qty;
            return `${i + 1}. *${product.name}*\n   • Qty: ${qty} units @ ₹${price}/unit = ₹${lineSub.toLocaleString('en-IN')}`;
          })
          .join('\n\n') +
        `\n\n----------------------------------------\n` +
        `• *Total Units:* ${orderMetrics.totalUnits}\n` +
        `• *Subtotal:* ₹${orderMetrics.subtotal.toLocaleString('en-IN')}\n` +
        `• *GST Total:* ₹${orderMetrics.totalGst.toLocaleString('en-IN')}\n` +
        `• *Grand Total:* ₹${orderMetrics.grandTotal.toLocaleString('en-IN')}\n\n` +
        `*Dispatched from:* Bangalore Hub (Karnataka 29)\n` +
        `*BrickBloom Commercial Operations*`;
    }

    navigator.clipboard.writeText(text);
    showToast('Quotation copied to clipboard! Opening WhatsApp Web...');
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-[#021a0d] px-4 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#e2d5be] bg-gradient-to-br from-[#031c0e] via-[#042814] to-[#011409] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left Column: Heading & Sourcing Vision */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Enterprise B2B Product Showcase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white leading-tight">
              BrickBloom Product Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore our complete line of 100% natural coconut coir pots, retail starter kits, high-expansion blocks, propagation discs, and commercial hydroponic slabs with live wholesale tier pricing.
            </p>
          </div>

          {/* Right Column: Sourcing & Commercial Specifications */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Catalog</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{CATALOG_PRODUCTS.length} SKUs</div>
              <div className="text-[10px] text-slate-400 mt-0.5">7 Product Sectors</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">GST Compliant</div>
              <div className="text-xl sm:text-2xl font-black text-teal-300 mt-0.5">5% Tax</div>
              <div className="text-[10px] text-slate-400 mt-0.5">HSN Code 5305</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm min-w-[130px]">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dispatch Hub</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">Bangalore</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Direct Warehouse</div>
            </div>
          </div>

        </div>
      </div>

      {/* Marketplace Search & Filtering Bar */}
      <Card className="rounded-2xl border border-[#e2d5be] bg-white p-4 sm:p-5 shadow-sm space-y-4">
        {/* Top Search & View Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, SKU (e.g. BB-POT), category, specs or keywords..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 text-sm font-medium outline-none transition focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-100 text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown & Layout Toggles */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>

            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                className={`grid h-9 w-9 place-items-center rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List View"
                className={`grid h-9 w-9 place-items-center rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-emerald-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATALOG_CATEGORIES.map((category) => {
            const count =
              category === 'All Products'
                ? CATALOG_PRODUCTS.length
                : CATALOG_PRODUCTS.filter((p) => p.category === category).length;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#031c0e] text-white shadow-sm shadow-[#031c0e]/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    isSelected ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Check Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1">Quick Filters:</span>
          
          <button
            onClick={() => setFilterInStockOnly(!filterInStockOnly)}
            className={`rounded-lg border px-2.5 py-1 font-semibold transition flex items-center gap-1.5 ${
              filterInStockOnly
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${filterInStockOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>In Stock Only</span>
          </button>

          <button
            onClick={() => setFilterBestsellersOnly(!filterBestsellersOnly)}
            className={`rounded-lg border px-2.5 py-1 font-semibold transition flex items-center gap-1.5 ${
              filterBestsellersOnly
                ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${filterBestsellersOnly ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>Bestsellers & Choice</span>
          </button>

          <button
            onClick={() => setFilterGst5Only(!filterGst5Only)}
            className={`rounded-lg border px-2.5 py-1 font-semibold transition flex items-center gap-1.5 ${
              filterGst5Only
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Percent className={`h-3.5 w-3.5 ${filterGst5Only ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>5% GST Products</span>
          </button>

          <span className="ml-auto text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {CATALOG_PRODUCTS.length} products
          </span>
        </div>
      </Card>

      {/* Meaningful Numbers & Commercial Standards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="flex items-center gap-3.5 rounded-2xl border border-[#ebdcc7] bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 font-display">19,550+</div>
            <div className="text-xs font-bold text-slate-700">Ready Units in Stock</div>
            <div className="text-[11px] text-slate-500">21 production SKUs ready</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-[#ebdcc7] bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 font-display">Up to 60%</div>
            <div className="text-xs font-bold text-slate-700">Bulk Margin Savings</div>
            <div className="text-[11px] text-slate-500">Tier 50 & 100+ volume</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-[#ebdcc7] bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 font-display">≤ 0.5 mS/cm</div>
            <div className="text-xs font-bold text-slate-700">Triple-Washed Purity</div>
            <div className="text-[11px] text-slate-500">Low sodium & EC certified</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-[#ebdcc7] bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 font-display">&lt; 24 Hours</div>
            <div className="text-xs font-bold text-slate-700">Quote & Invoice Prep</div>
            <div className="text-[11px] text-slate-500">Fast commercial dispatch</div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">No products match your criteria</h3>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting your search terms or resetting the category filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Products');
              setFilterInStockOnly(false);
              setFilterBestsellersOnly(false);
              setFilterGst5Only(false);
            }}
            className="mt-4"
          >
            Reset All Filters
          </Button>
        </Card>
      )}

      {/* GRID VIEW (3-Column Cards) */}
      {viewMode === 'grid' && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const currentImgIdx = activeThumbnails[product.id] || 0;
            const currentImage = product.gallery[currentImgIdx] || product.image;
            const discountPct = Math.round(((product.mrp - product.price100) / product.mrp) * 100);

            return (
              <Card
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5d9c5] bg-white shadow-sm hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300"
              >
                {/* Product Image Area with Badges & Thumbnail Switcher */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-100 to-slate-50 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/OurProducts/Logo_new.jpeg';
                    }}
                  />

                  {/* Badges Top Left & Right */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {product.badges.slice(0, 2).map((badge, idx) => (
                      <span
                        key={idx}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                          /bestseller|choice/i.test(badge)
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-[#031c0e] text-emerald-300'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                      {discountPct}% OFF
                    </span>
                  </div>

                  {/* Thumbnail Switcher Dots/Pills at bottom of image */}
                  {product.gallery.length > 1 && (
                    <div className="absolute bottom-2.5 inset-x-0 flex justify-center items-center gap-1.5 z-10">
                      {product.gallery.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardImageSelect(product.id, idx);
                          }}
                          className={`h-2 rounded-full transition-all ${
                            currentImgIdx === idx
                              ? 'w-6 bg-emerald-600 shadow-sm'
                              : 'w-2 bg-slate-300/80 hover:bg-slate-400'
                          }`}
                          title={`View photo ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="flex flex-1 flex-col p-5 space-y-3.5">
                  {/* Category, SKU & Public Link */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-emerald-800 tracking-wide uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {product.category}
                    </span>
                    <button
                      onClick={() => copySkuToClipboard(product.sku)}
                      className="group/sku flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-800 transition"
                      title="Click to copy SKU"
                    >
                      <span>{product.sku}</span>
                      {copiedSku === product.sku ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400 group-hover/sku:text-slate-600" />
                      )}
                    </button>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="font-display text-base font-extrabold text-slate-900 leading-snug line-clamp-1 group-hover:text-emerald-950 transition">
                      {product.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Star Rating & Order Count */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-extrabold text-slate-800">{product.rating}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ({product.reviewCount} reviews)
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {product.ordersMonth}
                    </span>
                  </div>

                  {/* Wholesale Tier Pricing Box */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-950 font-display">
                          ₹{product.price100}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          MRP ₹{product.mrp}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-1.5 py-0.5 rounded">
                        100+ MOQ
                      </span>
                    </div>

                    {/* Wholesale Tiers Breakdown */}
                    <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-200/80 text-center">
                      <div className="rounded bg-white p-1 border border-slate-200/60">
                        <div className="text-[9px] uppercase font-bold text-slate-400">1 - 49 Units</div>
                        <div className="text-xs font-extrabold text-slate-800">₹{product.price1}</div>
                      </div>
                      <div className="rounded bg-white p-1 border border-slate-200/60">
                        <div className="text-[9px] uppercase font-bold text-slate-400">50 - 99 Units</div>
                        <div className="text-xs font-extrabold text-slate-800">₹{product.price50}</div>
                      </div>
                      <div className="rounded bg-emerald-50/80 p-1 border border-emerald-300/60">
                        <div className="text-[9px] uppercase font-bold text-emerald-700">100+ Bulk</div>
                        <div className="text-xs font-black text-emerald-950">₹{product.price100}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <span>GST: <strong>{product.gstRate}%</strong> (HSN 5305)</span>
                      <span>Stock: <strong className="text-emerald-700">{product.stockCount} units</strong></span>
                    </div>
                  </div>

                  {/* Highlights Bullet Points */}
                  <ul className="space-y-1 text-xs text-slate-600 line-clamp-2">
                    {product.highlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                        <Check className="h-3 w-3 shrink-0 text-emerald-600 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions Footer */}
                  <div className="mt-auto pt-3 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openQuickView(product)}
                        className="text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Layers className="h-3.5 w-3.5 mr-1 text-slate-500" />
                        Quick Specs
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => addToOrderSheet(product)}
                        className="text-xs font-bold bg-[#031c0e] hover:bg-emerald-950 text-white"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                        + Order Tray
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => launchInvoiceWithItem(product, 50)}
                        className="h-8 text-[11px] font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100"
                        title="Draft an invoice in Invoice Workspace"
                      >
                        <FileText className="h-3 w-3 mr-1 text-emerald-700" />
                        Make Invoice
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => shareWhatsAppQuotation(product, 50)}
                        className="h-8 text-[11px] font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100"
                        title="Share pricing via WhatsApp"
                      >
                        <MessageCircle className="h-3 w-3 mr-1 text-teal-700" />
                        WhatsApp
                      </Button>
                    </div>

                    {product.publicSlug && (
                      <div className="text-center pt-1">
                        <a
                          href={`/products/${product.publicSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-700 transition"
                        >
                          <span>View Public Landing Page</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* LIST VIEW (Table Rows) */}
      {viewMode === 'list' && filteredProducts.length > 0 && (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const currentImgIdx = activeThumbnails[product.id] || 0;
            const currentImage = product.gallery[currentImgIdx] || product.image;
            const discountPct = Math.round(((product.mrp - product.price100) / product.mrp) * 100);

            return (
              <Card
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-[#e5d9c5] bg-white p-5 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Column: Image with gallery switcher */}
                  <div className="md:col-span-3 flex flex-col items-center">
                    <div className="relative aspect-square w-full max-w-[200px] bg-slate-50 rounded-xl p-3 flex items-center justify-center border border-slate-100 overflow-hidden">
                      <img
                        src={currentImage}
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/OurProducts/Logo_new.jpeg';
                        }}
                      />
                      <span className="absolute top-2 left-2 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                        {discountPct}% OFF
                      </span>
                    </div>

                    {/* Small Thumbnails Below Image */}
                    {product.gallery.length > 1 && (
                      <div className="flex items-center gap-1.5 mt-2.5">
                        {product.gallery.map((thumb, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleCardImageSelect(product.id, idx)}
                            className={`h-8 w-8 rounded-lg overflow-hidden border p-0.5 transition ${
                              currentImgIdx === idx
                                ? 'border-emerald-600 ring-2 ring-emerald-200'
                                : 'border-slate-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={thumb} alt="thumb" className="h-full w-full object-cover rounded" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Center Column: Product Specs & Information */}
                  <div className="md:col-span-5 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-800 border border-emerald-200">
                        {product.category}
                      </span>
                      <button
                        onClick={() => copySkuToClipboard(product.sku)}
                        className="font-mono text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                        title="Copy SKU"
                      >
                        <span>{product.sku}</span>
                        <Copy className="h-3 w-3 text-slate-400" />
                      </button>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 font-display">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Rating Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-900">{product.rating}</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">({product.reviewCount} customer reviews)</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {product.ordersMonth}
                      </span>
                    </div>

                    {/* Specifications Pills */}
                    <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-600">
                      {product.specs.dimensions && (
                        <span className="rounded-md bg-slate-100 px-2 py-1">
                          <strong>Dim:</strong> {product.specs.dimensions}
                        </span>
                      )}
                      {product.specs.material && (
                        <span className="rounded-md bg-slate-100 px-2 py-1">
                          <strong>Material:</strong> {product.specs.material}
                        </span>
                      )}
                      {product.specs.expansion && (
                        <span className="rounded-md bg-emerald-50 text-emerald-800 px-2 py-1">
                          <strong>Yield:</strong> {product.specs.expansion}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Pricing Tiers & Order Action Buttons */}
                  <div className="md:col-span-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-950 font-display">
                          ₹{product.price100}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          MRP ₹{product.mrp}
                        </span>
                        <span className="text-xs font-bold text-rose-600">
                          Save ₹{product.mrp - product.price100}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Tiered per unit pricing (Excl. {product.gstRate}% GST)
                      </div>
                    </div>

                    {/* Tiers List */}
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="rounded-lg bg-white p-1.5 border border-slate-200">
                        <div className="text-[9px] uppercase font-bold text-slate-400">1 - 49</div>
                        <div className="text-xs font-extrabold text-slate-800">₹{product.price1}</div>
                      </div>
                      <div className="rounded-lg bg-white p-1.5 border border-slate-200">
                        <div className="text-[9px] uppercase font-bold text-slate-400">50 - 99</div>
                        <div className="text-xs font-extrabold text-slate-800">₹{product.price50}</div>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-1.5 border border-emerald-300">
                        <div className="text-[9px] uppercase font-bold text-emerald-700">100+</div>
                        <div className="text-xs font-black text-emerald-950">₹{product.price100}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <Button
                        size="sm"
                        onClick={() => addToOrderSheet(product)}
                        className="w-full text-xs font-bold bg-[#031c0e] hover:bg-emerald-950 text-white"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                        Add to Order Sheet
                      </Button>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => launchInvoiceWithItem(product, 50)}
                          className="text-xs font-semibold"
                        >
                          <FileText className="h-3 w-3 mr-1 text-emerald-700" />
                          Create Invoice
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openQuickView(product)}
                          className="text-xs font-semibold"
                        >
                          <Layers className="h-3 w-3 mr-1 text-slate-600" />
                          View Specs
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* QUICK VIEW & PRICE CALCULATOR MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#e2d5be] bg-white p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Image Zoom & Gallery */}
              <div className="md:col-span-5 space-y-4">
                <div className="relative aspect-square w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={modalActiveImage || quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {quickViewProduct.badges.map((b, i) => (
                      <span key={i} className="rounded bg-emerald-950 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 uppercase">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gallery Thumbnails */}
                {quickViewProduct.gallery.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {quickViewProduct.gallery.map((thumb, idx) => (
                      <button
                        key={idx}
                        onClick={() => setModalActiveImage(thumb)}
                        className={`h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 p-1 transition ${
                          modalActiveImage === thumb
                            ? 'border-emerald-600 ring-2 ring-emerald-200'
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={thumb} alt="thumb" className="h-full w-full object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Sourcing Seal */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-700 shrink-0" />
                  <div className="text-xs text-emerald-950">
                    <strong>Konaseema & Karnataka Certified</strong>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Low EC, zero salt contamination, triple washed & buffered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Details, Specifications & Live Price Calculator */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {quickViewProduct.category}
                    </span>
                    <span className="font-mono text-slate-500 font-semibold">{quickViewProduct.sku}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
                    {quickViewProduct.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {quickViewProduct.tagline}
                  </p>
                </div>

                {/* Live Price Calculator & Order Box */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Wholesale Order Calculator</span>
                    <span className="text-emerald-700 font-extrabold">Instant Tier Pricing</span>
                  </div>

                  {/* Quantity Input & Preset Buttons */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-slate-300 bg-white p-1">
                      <button
                        onClick={() => setModalQty(Math.max(quickViewProduct.moq || 10, modalQty - 10))}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={modalQty}
                        onChange={(e) => setModalQty(Math.max(1, Number(e.target.value) || 0))}
                        className="h-8 w-20 text-center text-sm font-black text-slate-900 outline-none"
                      />
                      <button
                        onClick={() => setModalQty(modalQty + 10)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 text-xs">
                      {[25, 50, 100, 250, 500].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setModalQty(preset)}
                          className={`rounded-lg px-2.5 py-1.5 font-bold transition text-xs ${
                            modalQty === preset
                              ? 'bg-[#031c0e] text-white shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Calculated Calculation */}
                  {(() => {
                    const unitPrice = getProductPriceForQty(quickViewProduct, modalQty);
                    const subtotal = unitPrice * modalQty;
                    const gstAmount = (subtotal * quickViewProduct.gstRate) / 100;
                    const grandTotal = subtotal + gstAmount;

                    return (
                      <div className="rounded-xl bg-white border border-slate-200/80 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Applicable Tier Rate:</span>
                          <span className="font-extrabold text-slate-900">
                            ₹{unitPrice} / unit {modalQty >= 100 ? '(Wholesale Rate)' : modalQty >= 50 ? '(Mid-tier)' : '(Standard)'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Base Subtotal ({modalQty} units):</span>
                          <span className="font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">GST ({quickViewProduct.gstRate}%):</span>
                          <span className="font-bold text-slate-800">₹{gstAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-black pt-2 border-t border-slate-100 text-emerald-950">
                          <span>Total Quotation Estimate:</span>
                          <span className="text-base text-emerald-800 font-display">₹{grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Modal Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <Button
                      onClick={() => {
                        addToOrderSheet(quickViewProduct, modalQty);
                        setQuickViewProduct(null);
                      }}
                      className="bg-[#031c0e] hover:bg-emerald-950 text-white font-bold text-xs"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                      Add to Order Sheet
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        launchInvoiceWithItem(quickViewProduct, modalQty);
                        setQuickViewProduct(null);
                      }}
                      className="border-emerald-600 text-emerald-900 hover:bg-emerald-50 font-bold text-xs"
                    >
                      <FileText className="h-3.5 w-3.5 mr-1 text-emerald-700" />
                      Draft Invoice ({modalQty} Qty)
                    </Button>
                  </div>
                </div>

                {/* Technical Specifications Table */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(quickViewProduct.specs).map(([key, val]) => (
                      <div key={key} className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Product Description
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {quickViewProduct.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM ORDER SHEET / QUOTATION TRAY */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#021a0d]/95 backdrop-blur-md border-t border-emerald-500/30 px-4 py-3 sm:py-4 shadow-2xl text-white animate-in slide-in-from-bottom-6">
          <div className="mx-auto max-w-7xl space-y-3">
            {/* Expandable Selected Items List */}
            {isOrderTrayOpen && (
              <div className="max-h-60 overflow-y-auto space-y-2 pb-3 border-b border-white/10">
                {orderItems.map(({ product, qty }) => {
                  const price = getProductPriceForQty(product, qty);
                  const lineTotal = price * qty;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-2.5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-contain bg-white/10 p-1"
                        />
                        <div>
                          <div className="text-xs font-bold text-white line-clamp-1">{product.name}</div>
                          <div className="text-[10px] text-emerald-300">
                            ₹{price} / unit &bull; ₹{lineTotal.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-white/20 bg-black/40">
                          <button
                            onClick={() => updateOrderItemQty(product.id, qty - 10)}
                            className="h-7 w-7 grid place-items-center text-slate-300 hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold">{qty}</span>
                          <button
                            onClick={() => updateOrderItemQty(product.id, qty + 10)}
                            className="h-7 w-7 grid place-items-center text-slate-300 hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeOrderItem(product.id)}
                          className="h-7 w-7 grid place-items-center rounded-lg text-rose-400 hover:bg-rose-500/20"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left: Summary Items */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsOrderTrayOpen(!isOrderTrayOpen)}
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition shrink-0"
                  title={isOrderTrayOpen ? 'Collapse item details' : 'Expand item details'}
                >
                  {isOrderTrayOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-white font-display">
                      Wholesale Order Sheet
                    </span>
                    <button
                      onClick={() => setIsOrderTrayOpen(!isOrderTrayOpen)}
                      className="rounded-full bg-emerald-400/20 border border-emerald-400/30 px-2 py-0.2 text-xs font-extrabold text-emerald-300 hover:bg-emerald-400/30 transition"
                    >
                      {orderItems.length} Products ({orderMetrics.totalUnits} Units) {isOrderTrayOpen ? '▲' : '▼'}
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Est. Subtotal: <strong className="text-white">₹{orderMetrics.subtotal.toLocaleString('en-IN')}</strong> + GST: <strong className="text-emerald-300">₹{orderMetrics.totalGst.toLocaleString('en-IN')}</strong> &bull; Total: <strong className="text-amber-300 text-sm font-extrabold">₹{orderMetrics.grandTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearOrderSheet}
                  className="text-xs text-rose-300 hover:text-white hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>

                <Button
                  size="sm"
                  onClick={() => shareWhatsAppQuotation()}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
                >
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                  Send WhatsApp Quote
                </Button>

                <Button
                  size="sm"
                  onClick={transferOrderSheetToInvoice}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
                >
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  Generate Tax Invoice
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
