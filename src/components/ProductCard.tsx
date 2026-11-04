import React from 'react';
import { 
  Eye, 
  ShoppingCart, 
  Layers, 
  FileText, 
  Box, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../i18n';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onRequestSample: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onViewDetails,
  onAddToCart,
  onRequestSample,
  onRequestQuote,
  isCompared,
  onToggleCompare,
}) => {
  const t = translations[lang];

  const title = lang === 'es' ? (product.nameEs || product.nameEn) : product.nameEn;
  const description = lang === 'es' ? (product.descriptionEs || product.descriptionEn) : product.descriptionEn;

  const badgeColors: Record<string, string> = {
    'New Arrival': 'bg-emerald-600 text-white shadow-xs',
    'Best Seller': 'bg-amber-500 text-white shadow-xs',
    'Featured': 'bg-blue-600 text-white shadow-xs',
  };

  const imageSrc = product.primaryImage || (product.gallery && product.gallery[0]?.url) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10">
      {/* Product Image & Badges */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={imageSrc}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106 filter brightness-98 group-hover:brightness-102"
        />

        {/* Subtle Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/15 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {product.badge && product.badge !== 'none' && (
            <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm ${badgeColors[product.badge] || 'bg-slate-800 text-white'}`}>
              {product.badge}
            </span>
          )}

          <span className="ml-auto px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-white/95 text-blue-700 shadow-sm border border-slate-100">
            {product.category}
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/30 backdrop-blur-[2px]">
          <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Ver Ficha Completa' : 'View Specifications'}</span>
          </span>
        </div>

        {/* Dimensions banner at bottom of image */}
        {product.size && (
          <div className="absolute bottom-2 left-3 text-[11px] font-mono font-semibold text-white bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-md">
            {product.size}
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Model & SKU */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>MOD: <strong className="text-slate-800 font-semibold">{product.model || 'N/A'}</strong></span>
            <span>SKU: {product.sku}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
          >
            {title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Key Quick Spec Highlights */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] border-t border-slate-100 pt-2 text-slate-600">
            <div>
              <span className="text-slate-400">{t.finish}:</span>{' '}
              <span className="text-slate-800 font-medium truncate">{product.specs?.finish || 'Standard'}</span>
            </div>
            <div>
              <span className="text-slate-400">{t.availability}:</span>{' '}
              <span className="text-emerald-700 font-semibold">{product.availability || 'In Stock'}</span>
            </div>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold font-mono">
                {t.pricePerSqFt}
              </span>
              <span className="text-xl font-extrabold text-blue-700">
                ${(product.pricePerSqFt || product.price || 0).toFixed(2)}
                <span className="text-xs font-normal text-slate-500 ml-0.5">/ sq ft</span>
              </span>
            </div>

            {product.pricePerBox > 0 && (
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold font-mono">
                  {t.pricePerBox}
                </span>
                <span className="text-sm font-bold text-slate-700">
                  ${product.pricePerBox.toFixed(2)}
                  <span className="text-[10px] font-normal text-slate-400 ml-0.5">/ box</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Grid */}
        <div className="pt-2 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Compare Toggle */}
            <button
              onClick={() => onToggleCompare(product)}
              className={`py-2 px-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                isCompared
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{isCompared ? (lang === 'es' ? 'Comparando' : 'Compared') : t.compare}</span>
            </button>

            {/* Request Sample */}
            <button
              onClick={() => onRequestSample(product)}
              className="py-2 px-2.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition hover:text-blue-700"
            >
              <Box className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'es' ? 'Muestra' : 'Sample'}</span>
            </button>
          </div>

          {/* Add to Order / View Detail */}
          <button
            onClick={() => onViewDetails(product)}
            className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition group/btn"
          >
            <span>{lang === 'es' ? 'Ver Ficha y Cotizar' : 'View Specs & Order'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
