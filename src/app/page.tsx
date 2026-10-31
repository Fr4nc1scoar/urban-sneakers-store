'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, CartItem, Order, StoreSettings } from '@/types';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import ProductCard3D from '@/components/ProductCard3D';
import BackgroundGlow from '@/components/BackgroundGlow';
import FloatingCartPill from '@/components/FloatingCartPill';
import RotatingWhatsAppStamp from '@/components/RotatingWhatsAppStamp';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import {
  Sparkles,
  Filter,
  Calendar,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  X,
  CreditCard,
  Zap,
  Search,
} from 'lucide-react';

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'brand'>('featured');
  // Progressive batch loading for silky smooth 60-120 FPS mobile performance (prevents mobile phone lag/freeze)
  const [visibleCount, setVisibleCount] = useState(24);

  // Reset batch count when any filter or search changes
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedBrand, selectedSize, sortBy]);

  // Cart & Modals
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalInitialSize, setDetailModalInitialSize] = useState<number | undefined>(undefined);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [whatsAppRedirectUrl, setWhatsAppRedirectUrl] = useState('');
  const [isCreditExplainerOpen, setIsCreditExplainerOpen] = useState(false);

  const catalogRef = useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  // Load products and settings
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, setRes] = await Promise.all([
          fetch('/api/products').then(r => r.json()),
          fetch('/api/settings').then(r => r.json()),
        ]);

        if (prodRes.success && prodRes.products) {
          setProducts(prodRes.products);
        }
        if (setRes.success && setRes.settings) {
          setSettings(setRes.settings);
        }
      } catch (err) {
        console.error('Error loading storefront data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Distinct brands list
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Distinct sizes list (sorted numerically)
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<number>();
    products.forEach(p => {
      p.sizes.forEach(s => sizeSet.add(s));
    });
    return Array.from(sizeSet).sort((a, b) => a - b);
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Brand filter
        if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
        // Size filter
        if (selectedSize !== null && !p.sizes.includes(selectedSize)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          return matchName || matchBrand || matchDesc;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'brand') return a.brand.localeCompare(b.brand);
        // Featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedBrand, selectedSize, searchQuery, sortBy]);

  // Sliced products for batch rendering (prevents memory spikes on mobile phones)
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Progressive batch loading IntersectionObserver for silky smooth 60-120 FPS mobile performance
  useEffect(() => {
    if (!loadMoreSentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            if (prev < filteredProducts.length) {
              return prev + 24;
            }
            return prev;
          });
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(loadMoreSentinelRef.current);
    return () => observer.disconnect();
  }, [filteredProducts.length]);

  // Cart operations
  const handleAddToCart = (product: Product, size: number, quantity: number) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.product.id === product.id && i.selectedSize === size
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, selectedSize: size, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, size: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCartItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.selectedSize === size
          ? { ...i, quantity: newQty }
          : i
      )
    );
  };

  const handleRemoveItem = (productId: string, size: number) => {
    setCartItems(prev =>
      prev.filter(i => !(i.product.id === productId && i.selectedSize === size))
    );
  };

  // Open modal from card
  const handleSelectProduct = (product: Product, preselectedSize?: number) => {
    setSelectedProduct(product);
    setDetailModalInitialSize(preselectedSize);
    setIsDetailModalOpen(true);
  };

  // Direct buy from modal
  const handleDirectBuy = (product: Product, size: number, quantity: number) => {
    handleAddToCart(product, size, quantity);
    setIsDetailModalOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order success
  const handleOrderSuccess = (order: Order, whatsAppUrl: string) => {
    setCompletedOrder(order);
    setWhatsAppRedirectUrl(whatsAppUrl);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsSuccessModalOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06060c] relative overflow-x-hidden">
      {/* High-End Ambient Background & Dynamic Spotlight Glow (Unique Capital / Iqxion style) */}
      <BackgroundGlow />

      {/* Navbar (Clean luxury look, Admin link removed) */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        ownerPhone={settings?.ownerWhatsApp || '584248057420'}
      />

      {/* Hero Section */}
      <HeroBanner
        onExploreClick={scrollToCatalog}
        onCreditInfoClick={() => setIsCreditExplainerOpen(true)}
        totalProducts={products.length || 290}
      />

      {/* Catalog & Filter Section */}
      <main ref={catalogRef} id="catalogo" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8 relative z-10">
        {/* Section title & Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-rose-500 font-mono font-bold text-xs uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Colección Exclusiva 2026</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Modelos Disponibles{' '}
                <span className="bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent font-mono font-bold text-xl sm:text-2xl">
                  ({filteredProducts.length})
                </span>
              </h2>
            </div>

            {/* Sort & Quick info */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono font-semibold hidden sm:inline">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0b0c16] border border-white/[0.12] rounded-2xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-lg backdrop-blur-xl"
              >
                <option value="featured">Destacados / Populares</option>
                <option value="name-asc">Nombre (A - Z)</option>
                <option value="brand">Por Marca</option>
              </select>
            </div>
          </div>

          {/* Integrated Ergonomic Search Bar - Direct in Catalog (No scrolling back up needed) */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por modelo (ej. Dunk, Jordan 4, Samba), marca o talla..."
              className="w-full pl-11 pr-11 py-3 sm:py-3.5 bg-[#0e101d]/95 border border-white/[0.14] focus:border-rose-500 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 shadow-xl backdrop-blur-xl transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brand Filter Chips Carousel with High-Energy Neons */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedBrand === 'all'
                  ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] border border-rose-400'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.1] hover:border-rose-400/60 backdrop-blur-md'
              }`}
            >
              Todas las Marcas ({products.length})
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  selectedBrand.toLowerCase() === brand.toLowerCase()
                    ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] border border-rose-400'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.1] hover:border-rose-400/60 backdrop-blur-md'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Size Filter Pills Bar with Vivid Highlights */}
          <div className="p-4 rounded-3xl bg-[#0c0d18]/90 border border-white/[0.1] backdrop-blur-2xl flex flex-wrap items-center gap-2 shadow-xl">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 mr-2">
              <Filter className="w-3.5 h-3.5 text-rose-500" />
              <span>Filtrar por Talla:</span>
            </div>

            <button
              onClick={() => setSelectedSize(null)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedSize === null
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Cualquiera
            </button>

            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedSize === size
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] ring-1 ring-rose-400'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]'
                }`}
              >
                EU {size}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid with 3D Tilt & Specular Highlights */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No encontramos zapatos con esos filtros</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Prueba limpiando la búsqueda o seleccionando otra talla o marca.
            </p>
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSelectedSize(null);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white shadow-lg"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard3D
                  key={product.id}
                  product={product}
                  onSelectProduct={handleSelectProduct}
                  onQuickAdd={(p, size) => handleAddToCart(p, size, 1)}
                />
              ))}
            </div>

            {/* Load More Models Controls */}
            {visibleCount < filteredProducts.length && (
              <div className="pt-8 pb-4 flex flex-col items-center justify-center gap-3">
                <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Mostrando <strong className="text-white">{Math.min(visibleCount, filteredProducts.length)}</strong> de{' '}
                    <strong className="text-rose-400">{filteredProducts.length}</strong> modelos disponibles
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  data-interactive="true"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(244,63,94,0.45)] hover:shadow-[0_0_35px_rgba(244,63,94,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-white/20"
                >
                  <span>Cargar Más Modelos (+24)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scroll Sentinel for Smooth Auto-Loading */}
            <div ref={loadMoreSentinelRef} className="h-4 w-full pointer-events-none" />
          </>
        )}
      </main>

      {/* Credit Explanation Modal */}
      {isCreditExplainerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div
            className="relative w-full max-w-md bg-[#0f111a] border border-slate-700/80 rounded-3xl p-6 md:p-8 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCreditExplainerOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white mb-2">
              ¿Cómo funciona la Venta a Crédito?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Te ofrecemos facilidades para que estrenes tus zapatos favoritos pagando en cómodas cuotas quincenales:
            </p>

            <div className="space-y-3 mb-6 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex gap-3">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-white block">Elige tu modelo y talla</strong>
                  Selecciona los zapatos y la talla que necesitas en el catálogo.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex gap-3">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-white block">Envías tu pedido por WhatsApp</strong>
                  Al contactar con el vendedor, confirmas la disponibilidad y el acuerdo de cuotas quincenales.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex gap-3">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-white block">2 o más cuotas quincenales</strong>
                  Acuerdas la cantidad de cuotas (generalmente 2 o 3) y recibes tu recordatorio personalizado por WhatsApp para tu comodidad.
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCreditExplainerOpen(false)}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-600/30"
            >
              ¡Entendido, quiero ver el catálogo!
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Floating Cart Island (Appears when cart has items) */}
      <FloatingCartPill
        items={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Signature Rotating Contact Stamp Widget (Unique Capital style) */}
      <RotatingWhatsAppStamp
        whatsappNumber={settings?.ownerWhatsApp || '584248057420'}
        whatsappDisplay={settings?.ownerWhatsAppDisplay || '+58 424-8057420'}
      />

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProduct}
        initialSize={detailModalInitialSize}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToCart={handleAddToCart}
        onDirectBuy={handleDirectBuy}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
        ownerWhatsAppDisplay={settings?.ownerWhatsAppDisplay || '+58 424-8057420'}
      />

      <OrderSuccessModal
        order={completedOrder}
        whatsAppUrl={whatsAppRedirectUrl}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      {/* Footer (Admin link completely removed) */}
      <footer className="mt-20 border-t border-slate-800 bg-[#07080c] py-12 text-slate-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-black text-base text-white tracking-wider uppercase">
              URBAN <span className="text-rose-500">SNEAKERS</span>
            </span>
            <p className="text-slate-400 leading-relaxed">
              Venta de calzado urbano, deportivo y casual de alta calidad. Precios accesibles y facilidad de pago a crédito en cuotas quincenales a convenir.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Atención Directa</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`https://api.whatsapp.com/send?phone=${settings?.ownerWhatsApp || '584248057420'}`}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: {settings?.ownerWhatsAppDisplay || '+58 424-8057420'}</span>
                </a>
              </li>
              <li>Envíos directos o entregas personales</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Métodos de Pago</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Pago Móvil (Tasa del día)</li>
              <li>• Divisas en Efectivo ($ USD)</li>
              <li>• Binance Pay (USDT)</li>
              <li>• Zelle</li>
              <li>• Crédito en cuotas quincenales</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Garantía y Seguridad</h4>
            <p className="leading-relaxed text-slate-400">
              Trato directo con el vendedor sin intermediarios. Confirmación de pedido en WhatsApp y acuerdo personalizado de cuotas.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Urban Sneakers. Catálogo actualizado con stock en vivo.</p>
          <p>Tallas reales disponibles</p>
        </div>
      </footer>
    </div>
  );
}
