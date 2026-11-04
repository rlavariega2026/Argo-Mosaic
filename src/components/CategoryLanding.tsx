import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X, 
  Layers, 
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check
} from 'lucide-react';
import { Product, Language, CategoryType } from '../types';
import { translations } from '../i18n';
import { ProductCard } from './ProductCard';

interface CategoryLandingProps {
  category: CategoryType;
  products: Product[];
  lang: Language;
  onSelectCategory: (cat: CategoryType) => void;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onRequestSample: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
  comparedProductIds: string[];
  onToggleCompare: (product: Product) => void;
}

export const CategoryLanding: React.FC<CategoryLandingProps> = ({
  category,
  products,
  lang,
  onSelectCategory,
  onViewDetails,
  onAddToCart,
  onRequestSample,
  onRequestQuote,
  comparedProductIds,
  onToggleCompare,
}) => {
  const t = translations[lang];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Category specific covers & rich descriptions
  const categoryMeta: Record<CategoryType, { title: string; subtitleEn: string; subtitleEs: string; coverImage: string; badge: string }> = {
    LVP: {
      title: 'LVP — Luxury Vinyl Plank Collections',
      subtitleEn: 'Commercial high-density Stone Plastic Composite (SPC) rigid core vinyl flooring. 100% waterproof construction with registered-embossed textures and integrated acoustic IXPE pad.',
      subtitleEs: 'Pisos de duela vinílica rígida de lujo (SPC) de alta densidad. Estructura 100% impermeable con textura sincronizada al relieve y membrana acústica IXPE integrada.',
      coverImage: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1920&q=85',
      badge: '100% Waterproof SPC'
    },
    Wooden: {
      title: 'Wooden — Handcrafted Hardwood & Engineered Planks',
      subtitleEn: 'Artisanal wire-brushed European white oak engineered flooring engineered for Texas thermal stability and dimensional longevity in luxury residential and executive suites.',
      subtitleEs: 'Pisos de duela de madera de ingeniería de roble blanco europeo cepillado artesanalmente, diseñada para estabilidad dimensional en el clima de Texas.',
      coverImage: 'https://images.unsplash.com/photo-1545042679-41d22b2ca130?auto=format&fit=crop&w=1920&q=85',
      badge: 'Artisanal White Oak'
    },
    'Matte Series': {
      title: 'Matte Series — Architectural Silk Porcelain',
      subtitleEn: 'Non-glare contemporary through-body matte surfaces offering superior dynamic coefficient of friction (DCOF >= 0.55), high slip resistance, and understated tactile luxury.',
      subtitleEs: 'Superficies contemporáneas de porcelanato mate no reflectante con alto coeficiente de fricción antideslizante (DCOF >= 0.55) y elegancia táctil sobria.',
      coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1920&q=85',
      badge: 'High DCOF R10 Slip-Resistant'
    },
    Polished: {
      title: 'Polished — High-Gloss Large Format Porcelain',
      subtitleEn: 'Monumental mirror-polished rectified porcelain tiles and slabs inspired by prestigious Calacatta and Statuario Italian marble with deep light reflection.',
      subtitleEs: 'Monumentales placas y porcelanatos rectificados pulido espejo de gran formato inspirados en mármoles italianos Calacatta y Statuario con alta reflexión de luz.',
      coverImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1920&q=85',
      badge: 'High-Gloss Mirror Glaze'
    }
  };

  const currentMeta = categoryMeta[category];

  // Category products
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === category && p.status !== 'hidden');
  }, [products, category]);

  // Distinct filter options extracted from real products
  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.specs?.material) set.add(p.specs.material);
    });
    return Array.from(set);
  }, [categoryProducts]);

  const availableFinishes = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.specs?.finish) set.add(p.specs.finish);
    });
    return Array.from(set);
  }, [categoryProducts]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.size) set.add(p.size);
    });
    return Array.from(set);
  }, [categoryProducts]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (p.nameEn || '').toLowerCase().includes(q) || (p.nameEs || '').toLowerCase().includes(q);
          const matchSku = (p.sku || '').toLowerCase().includes(q);
          const matchModel = (p.model || '').toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchModel) return false;
        }

        // Filters
        if (selectedMaterial !== 'all' && p.specs?.material !== selectedMaterial) return false;
        if (selectedFinish !== 'all' && p.specs?.finish !== selectedFinish) return false;
        if (selectedSize !== 'all' && p.size !== selectedSize) return false;
        if (selectedAvailability !== 'all' && p.availability !== selectedAvailability) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          const priceA = a.pricePerSqFt || a.price;
          const priceB = b.pricePerSqFt || b.price;
          return priceA - priceB;
        }
        if (sortBy === 'price-desc') {
          const priceA = a.pricePerSqFt || a.price;
          const priceB = b.pricePerSqFt || b.price;
          return priceB - priceA;
        }
        if (sortBy === 'name') {
          return a.nameEn.localeCompare(b.nameEn);
        }
        return 0; // default featured
      });
  }, [categoryProducts, searchQuery, selectedMaterial, selectedFinish, selectedSize, selectedAvailability, sortBy]);

  const categoriesList: CategoryType[] = ['LVP', 'Wooden', 'Matte Series', 'Polished'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Category Cover Hero */}
      <div className="relative min-h-[360px] sm:min-h-[420px] flex items-center bg-blue-950 border-b border-slate-200 overflow-hidden">
        <img
          src={currentMeta.coverImage}
          alt={currentMeta.title}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-40 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-4 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/50 text-blue-200 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>{currentMeta.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {currentMeta.title}
          </h1>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            {lang === 'es' ? currentMeta.subtitleEs : currentMeta.subtitleEn}
          </p>

          {/* Quick Category Selector Pills */}
          <div className="pt-4 flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition shadow-sm ${
                  cat === category
                    ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/30 ring-2 ring-white/20'
                    : 'bg-white/90 backdrop-blur-md border-white/40 text-slate-800 hover:bg-white hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Toolbar: Search, Filters, Count, Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-blue-900/5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Trigger & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                filterDrawerOpen || selectedMaterial !== 'all' || selectedFinish !== 'all' || selectedSize !== 'all'
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.filterBy}</span>
              {(selectedMaterial !== 'all' || selectedFinish !== 'all' || selectedSize !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 font-bold"
            >
              <option value="featured">{lang === 'es' ? 'Destacados' : 'Featured'}</option>
              <option value="price-asc">{lang === 'es' ? 'Precio: Menor a Mayor' : 'Price: Low to High'}</option>
              <option value="price-desc">{lang === 'es' ? 'Precio: Mayor a Menor' : 'Price: High to Low'}</option>
              <option value="name">{lang === 'es' ? 'Nombre: A - Z' : 'Name: A - Z'}</option>
            </select>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {filterDrawerOpen && (
          <div className="mt-4 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xl shadow-blue-900/5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                {lang === 'es' ? 'Filtros Arquitectónicos' : 'Architectural Surface Filters'}
              </span>
              <button
                onClick={() => {
                  setSelectedMaterial('all');
                  setSelectedFinish('all');
                  setSelectedSize('all');
                  setSelectedAvailability('all');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                {t.resetFilters}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Material Filter */}
              <div>
                <label className="block text-slate-600 mb-1 font-bold">{t.material}</label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white"
                >
                  <option value="all">{lang === 'es' ? 'Todos los Materiales' : 'All Materials'}</option>
                  {availableMaterials.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Finish Filter */}
              <div>
                <label className="block text-slate-600 mb-1 font-bold">{t.finish}</label>
                <select
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white"
                >
                  <option value="all">{lang === 'es' ? 'Todos los Acabados' : 'All Finishes'}</option>
                  {availableFinishes.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-slate-600 mb-1 font-bold">{t.size}</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white"
                >
                  <option value="all">{lang === 'es' ? 'Todas las Dimensiones' : 'All Sizes'}</option>
                  {availableSizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-slate-600 mb-1 font-bold">{t.availability}</label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white"
                >
                  <option value="all">{lang === 'es' ? 'Toda Disponibilidad' : 'All Availability'}</option>
                  <option value="In Stock">{lang === 'es' ? 'En Existencia (In Stock)' : 'In Stock'}</option>
                  <option value="Made to Order / Contact Us">{lang === 'es' ? 'Bajo Pedido' : 'Made to Order'}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div className="pt-6 pb-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            {t.showingProducts} <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> {lang === 'es' ? 'modelos en' : 'models in'} <strong className="text-blue-600 font-bold">{category}</strong>
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onRequestSample={onRequestSample}
                onRequestQuote={onRequestQuote}
                isCompared={comparedProductIds.includes(product.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <Layers className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-extrabold text-slate-900">
              {lang === 'es' ? 'No se encontraron modelos con estos filtros' : 'No models found matching your criteria'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {lang === 'es'
                ? 'Prueba restableciendo los filtros o busca con un término diferente.'
                : 'Try adjusting your search criteria or resetting filters to see available models.'}
            </p>
            <button
              onClick={() => {
                setSelectedMaterial('all');
                setSelectedFinish('all');
                setSelectedSize('all');
                setSelectedAvailability('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/20"
            >
              {t.resetFilters}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
