import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Box, 
  FileText, 
  Phone, 
  MapPin, 
  Star 
} from 'lucide-react';
import { 
  Product, 
  Order, 
  QuoteRequest, 
  SampleRequest, 
  SalesRep, 
  CompanySettings, 
  Language, 
  CategoryType, 
  CartItem 
} from './types';
import { translations } from './i18n';
import { apiClient } from './api/client';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { CategoryLanding } from './components/CategoryLanding';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { SampleRequestModal } from './components/SampleRequestModal';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { CartDrawer } from './components/CartDrawer';
import { GalleryView } from './components/GalleryView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { AdminLayout } from './admin/AdminLayout';
import { PublishHostingerModal } from './components/PublishHostingerModal';
import { MobileAppInstallBanner } from './components/MobileAppInstallBanner';

export default function App() {
  const [lang, setLang] = useState<Language>('es'); // Default to Spanish as requested by the prompt language, easily toggleable to EN
  const t = translations[lang];
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const isPublicMode = window.location.pathname.replace(/\/+$/, '') === '/Argo-Mosaic/argomosaic';

  // Routing and State
  const [activeTab, setActiveTab] = useState<string>('home'); // home | models | gallery | about | contact | admin
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('LVP');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Cart & Comparison State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('argo_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Modals
  const [sampleModalProduct, setSampleModalProduct] = useState<Product | null>(null);
  const [quoteModalProduct, setQuoteModalProduct] = useState<Product | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('argo_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load Data on Mount
  const loadAllData = async () => {
    try {
      const [prodsData, ordersData, quotesData, samplesData, repsData, settingsData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getOrders(),
        apiClient.getQuotes(),
        apiClient.getSamples(),
        apiClient.getSalesReps(),
        apiClient.getSettings(),
      ]);

      setProducts(prodsData);
      setOrders(ordersData);
      setQuotes(quotesData);
      setSamples(samplesData);
      setSalesReps(repsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Error loading initial data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Listen for query params, hash changes, and admin shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleUrlRouting = () => {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product');
      const tabParam = params.get('tab');
      const isAdmin = params.get('admin') === 'true' || params.has('admin') || window.location.hash === '#admin';
      
      if (isAdmin) {
        setActiveTab('admin');
      } else if (tabParam) {
        setActiveTab(tabParam);
      }
      
      if (prodId && products.length > 0) {
        const found = products.find(p => p.id === prodId || p.sku === prodId);
        if (found) setSelectedProduct(found);
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);

    // Private keyboard shortcut for store owner: Ctrl + Shift + A or Cmd + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [products]);

  // Keep URL search params in sync with selected product for seamless sharing
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedProduct) {
        url.searchParams.set('product', selectedProduct.id);
        window.history.replaceState({}, '', url.toString());
      } else {
        if (url.searchParams.has('product')) {
          url.searchParams.delete('product');
          window.history.replaceState({}, '', url.toString());
        }
      }
    } catch {
      // ignore
    }
  }, [selectedProduct]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity: number = 10, unitType: 'box' | 'sqft' = 'box') => {
    const sqftPerBox = product.packaging?.sqFtPerBox || 16.0;
    const unitPrice = unitType === 'box'
      ? (product.pricePerBox || ((product.pricePerSqFt || product.price) * sqftPerBox))
      : (product.pricePerSqFt || product.price);

    setCartItems((prev) => {
      const existing = prev.find(item => item.productId === product.id && item.unitType === unitType);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id && item.unitType === unitType
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, product, quantity, unitType, unitPrice }];
    });
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map(item => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter(item => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Compare Operations
  const handleToggleCompare = (product: Product) => {
    setComparedProductIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      }
      if (prev.length >= 3) {
        alert(t.maxCompareReached);
        return prev;
      }
      return [...prev, product.id];
    });
  };

  const comparedProducts = products.filter(p => comparedProductIds.includes(p.id));

  // Navigation handlers
  const handleSelectTab = (tab: string, category?: CategoryType) => {
    setSelectedProduct(null);
    if (category) {
      setSelectedCategory(category);
      setActiveTab('models');
    } else {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Data Actions
  const handleSaveProduct = async (product: Product) => {
    const existing = products.some(p => p.id === product.id);
    if (existing) {
      await apiClient.updateProduct(product.id, product);
    } else {
      await apiClient.createProduct(product);
    }
    await loadAllData();
  };

  const handleDeleteProduct = async (productId: string) => {
    await apiClient.deleteProduct(productId);
    loadAllData();
  };

  const handleToggleProductStatus = async (product: Product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    await apiClient.updateProduct(product.id, { ...product, status: newStatus });
    loadAllData();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: any, paymentStatus?: any) => {
    await apiClient.updateOrderStatus(orderId, status, paymentStatus);
    loadAllData();
  };

  const handleUpdateQuoteStatus = async (quoteId: string, status: string) => {
    await apiClient.updateQuoteStatus(quoteId, status);
    loadAllData();
  };

  const handleUpdateSampleStatus = async (sampleId: string, status: string) => {
    await apiClient.updateSampleStatus(sampleId, status);
    loadAllData();
  };

  const handleSaveSalesRep = async (rep: SalesRep) => {
    await apiClient.saveSalesRep(rep);
    loadAllData();
  };

  const handleDeleteSalesRep = async (repId: string) => {
    await apiClient.deleteSalesRep(repId);
    loadAllData();
  };

  const handleSaveSettings = async (newSettings: CompanySettings) => {
    await apiClient.updateSettings(newSettings);
    loadAllData();
  };

  // If Admin Portal is active
  if (activeTab === 'admin') {
    return (
      <AdminLayout
        products={products}
        orders={orders}
        quotes={quotes}
        samples={samples}
        salesReps={salesReps}
        settings={settings || {
          companyName: 'ARGO MOSAIC',
          logoUrl: '/assets/aistudio/Argo_Mosaic_Logo_Transparente_0aa6f2ad.png',
          descriptionEn: '',
          descriptionEs: '',
          phone: '+1 (214) 790-2840',
          whatsapp: '12147902840',
          email: 'contact@argomosaic.com',
          website: 'https://argomosaic.com',
          warehouseAddress: '11820 Regal Row, Suite 100',
          city: 'Dallas',
          state: 'Texas',
          zipCode: '75247',
          businessHours: '',
          googleMapsEmbedUrl: '',
          paypalClientId: '',
          paypalSecretKey: '',
          paypalMode: 'sandbox',
          lowStockThreshold: 50,
          homeHeroTitleEn: '',
          homeHeroTitleEs: '',
          homeHeroSubtitleEn: '',
          homeHeroSubtitleEs: '',
          homeHeroImage: '',
        }}
        onExitAdmin={() => { window.location.assign(`${import.meta.env.BASE_URL}argomosaic`); }}
        onRefreshData={loadAllData}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onToggleProductStatus={handleToggleProductStatus}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateQuoteStatus={handleUpdateQuoteStatus}
        onUpdateSampleStatus={handleUpdateSampleStatus}
        onSaveSalesRep={handleSaveSalesRep}
        onDeleteSalesRep={handleDeleteSalesRep}
        onSaveSettings={handleSaveSettings}
      />
    );
  }

  // Filter featured & new arrivals for home page
  const featuredProducts = products.filter(p => p.badge === 'Featured' || p.badge === 'Best Seller');
  const newArrivals = products.filter(p => p.badge === 'New Arrival');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        compareCount={comparedProductIds.length}
        onOpenCompare={() => setCompareModalOpen(true)}
        onOpenQuote={() => setQuoteModalOpen(true)}
        onOpenPublishModal={() => setPublishModalOpen(true)}
        isPublicMode={isPublicMode}
        settings={settings}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {selectedProduct ? (
          /* Individual Product Technical Publication */
          <ProductDetail
            product={selectedProduct}
            lang={lang}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            onRequestSample={(p) => setSampleModalProduct(p)}
            onRequestQuote={(p) => {
              setQuoteModalProduct(p);
              setQuoteModalOpen(true);
            }}
            isCompared={comparedProductIds.includes(selectedProduct.id)}
            onToggleCompare={handleToggleCompare}
          />
        ) : activeTab === 'models' ? (
          /* Models & Collections View */
          <CategoryLanding
            category={selectedCategory}
            products={products}
            lang={lang}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onViewDetails={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onRequestSample={(p) => setSampleModalProduct(p)}
            onRequestQuote={(p) => {
              setQuoteModalProduct(p);
              setQuoteModalOpen(true);
            }}
            comparedProductIds={comparedProductIds}
            onToggleCompare={handleToggleCompare}
          />
        ) : activeTab === 'gallery' ? (
          /* Architectural Project Gallery */
          <GalleryView
            products={products}
            lang={lang}
            onViewProduct={(p) => setSelectedProduct(p)}
          />
        ) : activeTab === 'about' ? (
          /* About Us & Sales Representatives */
          <AboutView
            salesReps={salesReps}
            lang={lang}
            settings={settings}
            onOpenQuote={() => setQuoteModalOpen(true)}
          />
        ) : activeTab === 'contact' ? (
          /* Contact & Warehouse Location */
          <ContactView
            lang={lang}
            settings={settings}
          />
        ) : (
          /* HOME PAGE */
          <div className="space-y-16 pb-20">
            {/* Hero Banner with Texas Messaging & Fast Track Cards */}
            <Hero
              lang={lang}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveTab('models');
              }}
              onOpenQuote={() => setQuoteModalOpen(true)}
              settings={settings}
            />

            {/* Featured Architectural Products Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    Direct Texas Warehouse Supply
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {lang === 'es' ? 'Colecciones Destacadas' : 'Featured Architectural Surfaces'}
                  </h2>
                </div>
                <button
                  onClick={() => handleSelectTab('models')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition"
                >
                  <span>{lang === 'es' ? 'Ver catálogo completo' : 'View all models'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(featuredProducts.length > 0 ? featuredProducts : products).slice(0, 4).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    lang={lang}
                    onViewDetails={(p) => setSelectedProduct(p)}
                    onAddToCart={handleAddToCart}
                    onRequestSample={(p) => setSampleModalProduct(p)}
                    onRequestQuote={(p) => {
                      setQuoteModalProduct(p);
                      setQuoteModalOpen(true);
                    }}
                    isCompared={comparedProductIds.includes(prod.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            </section>

            {/* Commercial Advantages Banner */}
            <section className="bg-white border-y border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8 shadow-xs">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Why Commercial Builders Choose Argo Mosaic
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {lang === 'es'
                      ? 'Ventajas Competitivas para Contratistas y Desarrollos'
                      : 'Commercial Advantages for Developers & Architects'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition space-y-3 shadow-xs">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-xl inline-block">
                      <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {lang === 'es' ? 'Entrega FTL & LTL en Texas' : 'Rapid Texas Jobsite Freight'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'es'
                        ? 'Despacho directo desde nuestra bodega en Dallas con entrega programada o recolección sin costo para contratistas autorizados.'
                        : 'Direct dispatch from Dallas warehouse with scheduled jobsite delivery or zero-fee contractor warehouse pickup.'}
                    </p>
                  </div>

                  <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition space-y-3 shadow-xs">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-xl inline-block">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {lang === 'es' ? 'Estándares Técnicos Verificados' : 'Verified Commercial Specs'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'es'
                        ? 'Clasificaciones PEI, DCOF antideslizante y absorción de agua estrictamente capturadas para cumplir con códigos de construcción en EE. UU.'
                        : 'PEI ratings, DCOF traction standards, and water absorption data meticulously tested for strict US building compliance.'}
                    </p>
                  </div>

                  <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition space-y-3 shadow-xs">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-xl inline-block">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {lang === 'es' ? 'Fichas PDF y Cotización Inmediata' : 'Instant Specs & Formal Quotes'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'es'
                        ? 'Generación automatizada de fichas técnicas en PDF con código QR y cálculo de volumen por caja o pie cuadrado.'
                        : 'Instant downloadable PDF technical specification sheets with QR codes and dual-unit packaging calculators.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* New Arrivals Section */}
            {newArrivals.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                      New Imports & Trends
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {lang === 'es' ? 'Novedades y Nuevos Modelos' : 'New Arrivals'}
                    </h2>
                  </div>
                  <button
                    onClick={() => handleSelectTab('models')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition"
                  >
                    {lang === 'es' ? 'Explorar todas →' : 'Explore all →'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newArrivals.slice(0, 3).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      lang={lang}
                      onViewDetails={(p) => setSelectedProduct(p)}
                      onAddToCart={handleAddToCart}
                      onRequestSample={(p) => setSampleModalProduct(p)}
                      onRequestQuote={(p) => {
                        setQuoteModalProduct(p);
                        setQuoteModalOpen(true);
                      }}
                      isCompared={comparedProductIds.includes(prod.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Direct Commercial Quote Action Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl text-white">
                <div className="space-y-3 max-w-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    Contractors & Architecture Firms
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {lang === 'es'
                      ? '¿Tienes un proyecto en desarrollo en Texas o EE. UU.?'
                      : 'Developing an Architectural or Commercial Project in Texas?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                    {lang === 'es'
                      ? 'Solicita una cotización por volumen o pide muestras físicas de nuestros porcelanatos y duelas de vinilo directo a tu oficina o despacho.'
                      : 'Request volume tier pricing or order physical sample swatches delivered directly to your jobsite or studio.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    className="px-7 py-4 bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-xs rounded-xl transition shadow-lg text-center"
                  >
                    {t.requestWholesaleQuote}
                  </button>
                  <button
                    onClick={() => handleSelectTab('contact')}
                    className="px-7 py-4 bg-blue-900/60 hover:bg-blue-900 text-white font-bold text-xs rounded-xl border border-blue-400/30 transition text-center"
                  >
                    {t.navContact}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectTab={handleSelectTab}
        settings={settings}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        lang={lang}
        settings={settings}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenQuote={() => {
          setCartOpen(false);
          setQuoteModalOpen(true);
        }}
        onOrderPlaced={() => {
          loadAllData();
        }}
      />

      {/* Comparison Modal */}
      {compareModalOpen && (
        <ProductComparisonModal
          products={comparedProducts}
          lang={lang}
          onClose={() => setCompareModalOpen(false)}
          onRemoveProduct={(id) => setComparedProductIds(prev => prev.filter(pId => pId !== id))}
          onClear={() => setComparedProductIds([])}
          onViewDetails={(p) => {
            setSelectedProduct(p);
            setCompareModalOpen(false);
          }}
          onRequestSample={(p) => {
            setSampleModalProduct(p);
            setCompareModalOpen(false);
          }}
        />
      )}

      {/* Sample Request Modal */}
      {sampleModalProduct && (
        <SampleRequestModal
          product={sampleModalProduct}
          lang={lang}
          settings={settings}
          onClose={() => setSampleModalProduct(null)}
        />
      )}

      {/* Quote Request Modal */}
      {quoteModalOpen && (
        <QuoteRequestModal
          initialProduct={quoteModalProduct}
          products={products}
          lang={lang}
          settings={settings}
          onClose={() => {
            setQuoteModalOpen(false);
            setQuoteModalProduct(null);
          }}
        />
      )}

      {/* Hostinger Publication & Live URLs Modal */}
      <PublishHostingerModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
      />

      {/* Fullscreen Mobile PWA Install Helper (iOS & Android) */}
      <MobileAppInstallBanner lang={lang} />
    </div>
  );
}

