import React, { useState, useMemo } from 'react';
import { Maximize2, ZoomIn, Layers, Sparkles, Filter, Eye } from 'lucide-react';
import { Product, Language, CategoryType, GalleryItem } from '../types';
import { translations } from '../i18n';

interface GalleryViewProps {
  products: Product[];
  lang: Language;
  onViewProduct: (product: Product) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ products, lang, onViewProduct }) => {
  const t = translations[lang];
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; product: Product } | null>(null);

  // Flatten all gallery items from all products
  const allImages = useMemo(() => {
    const list: { id: string; url: string; title: string; type: string; product: Product }[] = [];
    products.forEach((p) => {
      const pTitle = lang === 'es' ? (p.nameEs || p.nameEn) : p.nameEn;
      if (p.gallery && p.gallery.length > 0) {
        p.gallery.forEach((g) => {
          list.push({
            id: g.id,
            url: g.url,
            title: g.title || `${pTitle} (${p.category})`,
            type: g.type || 'gallery',
            product: p,
          });
        });
      } else if (p.primaryImage) {
        list.push({
          id: p.id,
          url: p.primaryImage,
          title: pTitle,
          type: 'main',
          product: p,
        });
      }
    });
    return list;
  }, [products, lang]);

  const filteredImages = useMemo(() => {
    return allImages.filter((img) => {
      if (selectedCategory !== 'all' && img.product.category !== selectedCategory) return false;
      if (selectedType !== 'all' && img.type !== selectedType) return false;
      return true;
    });
  }, [allImages, selectedCategory, selectedType]);

  const categories: (CategoryType | 'all')[] = ['all', 'LVP', 'Wooden', 'Matte Series', 'Polished'];
  const photoTypes = [
    { key: 'all', label: lang === 'es' ? 'Todas las Tomas' : 'All Views' },
    { key: 'ambient', label: lang === 'es' ? 'Ambientes' : 'Living & Spaces' },
    { key: 'detail', label: lang === 'es' ? 'Textura y Detalle' : 'Texture & Detail' },
    { key: 'installation', label: lang === 'es' ? 'Instalación' : 'Installation' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Gallery Header */}
      <div className="bg-white border-b border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Architectural Portfolio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.galleryTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.gallerySubtitle}
          </p>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? t.allCategories : cat}
              </button>
            ))}
          </div>

          {/* View Type Pills */}
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            {photoTypes.map((pt) => (
              <button
                key={pt.key}
                onClick={() => setSelectedType(pt.key)}
                className={`px-3 py-1 text-xs rounded-lg transition font-medium ${
                  selectedType === pt.key
                    ? 'bg-blue-100 text-blue-800 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img, idx) => (
            <div
              key={`${img.id}-${idx}`}
              onClick={() => setLightboxImage(img)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-md break-inside-avoid"
            >
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                  {img.product.category} • {img.product.model}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{img.title}</h4>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-200">
                  <span className="font-bold">${(img.product.pricePerSqFt || img.product.price).toFixed(2)} / sq ft</span>
                  <span className="text-blue-300 font-bold flex items-center gap-1">
                    {lang === 'es' ? 'Ver Ficha' : 'View Model'} →
                  </span>
                </div>
              </div>

              {img.type && (
                <span className="absolute top-3 left-3 text-[10px] bg-white/90 text-slate-800 font-bold px-2.5 py-0.5 rounded-md border border-slate-200 uppercase backdrop-blur-md shadow-xs">
                  {img.type}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-3 max-w-7xl mx-auto w-full">
            <div>
              <h3 className="text-sm font-bold">{lightboxImage.title}</h3>
              <p className="text-xs text-slate-400">
                {lightboxImage.product.category} | Model: {lightboxImage.product.model}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onViewProduct(lightboxImage.product);
                  setLightboxImage(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-blue-500/25"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{lang === 'es' ? 'Ver Producto' : 'View Product'}</span>
              </button>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-2 hover:bg-slate-800 rounded-lg text-white font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <img
              src={lightboxImage.url}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
