import React from 'react';
import { X, Layers, Check, Minus, ShoppingCart, Box, ArrowRight } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../i18n';

interface ProductComparisonModalProps {
  products: Product[];
  lang: Language;
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onClear: () => void;
  onViewDetails: (product: Product) => void;
  onRequestSample: (product: Product) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  products,
  lang,
  onClose,
  onRemoveProduct,
  onClear,
  onViewDetails,
  onRequestSample,
}) => {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-slate-800">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                {t.comparisonTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {products.length} / 3 {lang === 'es' ? 'productos seleccionados' : 'products selected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {products.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs font-bold text-slate-500 hover:text-red-600 transition"
              >
                {t.clearCompare}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-auto p-5 sm:p-6">
          {products.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-600 font-medium">{t.noProductsCompared}</p>
            </div>
          ) : (
            <div className="min-w-[600px]">
              {/* Product Cards Header */}
              <div className="grid grid-cols-4 gap-4 pb-6 border-b border-slate-200">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-end">
                  {lang === 'es' ? 'Superficies a Comparar' : 'Surfaces to Compare'}
                </div>
                {products.map((p) => {
                  const title = lang === 'es' ? (p.nameEs || p.nameEn) : p.nameEn;
                  return (
                    <div key={p.id} className="relative bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-2 shadow-xs">
                      <button
                        onClick={() => onRemoveProduct(p.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full border border-slate-200 transition shadow-xs"
                        title={t.removeFromCompare}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <img
                        src={p.primaryImage}
                        alt={title}
                        className="w-full h-24 object-cover rounded-xl border border-slate-200"
                      />

                      <div>
                        <span className="text-[10px] text-blue-600 font-extrabold uppercase">{p.category}</span>
                        <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{title}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">MOD: {p.model || 'N/A'}</span>
                      </div>

                      <div className="pt-1">
                        <span className="text-sm font-extrabold text-blue-700">
                          ${(p.pricePerSqFt || p.price).toFixed(2)}
                          <span className="text-[10px] text-slate-500 font-normal"> / sq ft</span>
                        </span>
                      </div>

                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            onViewDetails(p);
                            onClose();
                          }}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                        >
                          {lang === 'es' ? 'Ver Ficha' : 'View'}
                        </button>
                        <button
                          onClick={() => {
                            onRequestSample(p);
                            onClose();
                          }}
                          className="py-2 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs transition"
                          title={t.requestSample}
                        >
                          <Box className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comparison Rows */}
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { label: t.size, getValue: (p: Product) => p.size || '—' },
                  { label: t.pricePerBox, getValue: (p: Product) => p.pricePerBox ? `$${p.pricePerBox.toFixed(2)}` : '—' },
                  { label: t.availability, getValue: (p: Product) => p.availability || 'In Stock' },
                  { label: t.material, getValue: (p: Product) => p.specs.material || '—' },
                  { label: t.edgeType, getValue: (p: Product) => p.specs.edgeType || '—' },
                  { label: t.finish, getValue: (p: Product) => p.specs.finish || '—' },
                  { label: t.shadeVariation, getValue: (p: Product) => p.specs.shadeVariation || '—' },
                  { label: t.randomFaces, getValue: (p: Product) => p.specs.randomFaces || '—' },
                  { label: t.peiRating, getValue: (p: Product) => p.specs.peiRating || '—' },
                  { label: t.waterResistant, getValue: (p: Product) => p.specs.waterResistant || '—' },
                  { label: t.slipResistance, getValue: (p: Product) => p.specs.slipResistance || '—' },
                  { label: t.residentialUse, getValue: (p: Product) => p.specs.residentialUse || '—' },
                  { label: t.commercialUse, getValue: (p: Product) => p.specs.commercialUse || '—' },
                  { label: t.indoorApplication, getValue: (p: Product) => p.specs.indoorApplication || '—' },
                  { label: t.outdoorApplication, getValue: (p: Product) => p.specs.outdoorApplication || '—' },
                  { label: t.sqFtPerBox, getValue: (p: Product) => p.packaging.sqFtPerBox ? `${p.packaging.sqFtPerBox} sq ft` : '—' },
                  { label: t.weightLbsPerBox, getValue: (p: Product) => p.packaging.weightLbsPerBox ? `${p.packaging.weightLbsPerBox} lbs` : '—' },
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4 py-3 hover:bg-blue-50/40 transition">
                    <span className="font-bold text-slate-500">{row.label}</span>
                    {products.map((p) => (
                      <span key={p.id} className="text-slate-800 font-medium">
                        {row.getValue(p)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
