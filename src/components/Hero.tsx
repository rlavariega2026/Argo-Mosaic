import React from 'react';
import { ArrowRight, Sparkles, Shield, Download, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { Language, CategoryType, CompanySettings } from '../types';
import { translations } from '../i18n';

interface HeroProps {
  lang: Language;
  onSelectCategory: (cat: CategoryType) => void;
  onOpenQuote: () => void;
  settings: CompanySettings | null;
}

export const Hero: React.FC<HeroProps> = ({ lang, onSelectCategory, onOpenQuote, settings }) => {
  const t = translations[lang];

  const title = lang === 'es' 
    ? (settings?.homeHeroTitleEs || 'Superficies Arquitectónicas Diseñadas para la Distinción')
    : (settings?.homeHeroTitleEn || 'Architectural Surfaces Engineered for Distinction');

  const subtitle = lang === 'es'
    ? (settings?.homeHeroSubtitleEs || 'Importador directo de pisos LVP, superficies de madera, colecciones mate y porcelanatos pulidos en Texas y todo EE. UU.')
    : (settings?.homeHeroSubtitleEn || 'Direct importer of premium LVP, wood surfaces, matte collections, and high-gloss porcelain across Texas and nationwide.');

  const heroImage = settings?.homeHeroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85';

  const categoryCards: { key: CategoryType; title: string; subtitle: string; bgImage: string; badge: string }[] = [
    {
      key: 'LVP',
      title: 'LVP Collections',
      subtitle: lang === 'es' ? 'Duela Vinílica Rígida SPC de Alta Densidad' : 'Rigid Core SPC Vinyl Planks • 20mil Wear',
      bgImage: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80',
      badge: '100% Waterproof'
    },
    {
      key: 'Wooden',
      title: 'Wooden Hardwood',
      subtitle: lang === 'es' ? 'Madera Natural y Duela de Ingeniería' : 'Engineered European White Oak Planks',
      bgImage: 'https://images.unsplash.com/photo-1545042679-41d22b2ca130?auto=format&fit=crop&w=800&q=80',
      badge: 'Natural Timber'
    },
    {
      key: 'Matte Series',
      title: 'Matte Series',
      subtitle: lang === 'es' ? 'Porcelanatos Mate Sedosos de Gran Formato' : 'Architectural Silk Matte Porcelain • High DCOF',
      bgImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      badge: 'Slip Resistant'
    },
    {
      key: 'Polished',
      title: 'Polished Series',
      subtitle: lang === 'es' ? 'Porcelanato Pulido Espejo Gran Formato' : 'High-Gloss Polished Mirror Porcelain',
      bgImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
      badge: 'Mirror Glaze'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50 text-slate-900">
      {/* Editorial Hero Background Banner */}
      <div className="relative min-h-[580px] lg:min-h-[660px] flex items-center bg-slate-900">
        {/* Background Image with Architectural Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="ARGO MOSAIC Architectural Surface"
            className="w-full h-full object-cover object-center filter brightness-50 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
          {(() => {
            const fontClass = {
              serif: 'font-serif',
              mono: 'font-mono',
              sans: 'font-sans',
              system: 'font-sans'
            }[settings?.heroFontFamily || 'sans'];

            const sizeClass = {
              sm: 'text-3xl sm:text-4xl lg:text-5xl',
              md: 'text-4xl sm:text-5xl lg:text-6xl',
              lg: 'text-5xl sm:text-6xl lg:text-7xl',
              xl: 'text-6xl sm:text-7xl lg:text-8xl'
            }[settings?.heroFontSize || 'lg'];

            const alignClass = {
              center: 'text-center items-center mx-auto',
              right: 'text-right items-end ml-auto',
              left: 'text-left items-start'
            }[settings?.heroAlignment || 'left'];

            const flexAlignClass = {
              center: 'justify-center',
              right: 'justify-end',
              left: 'justify-start'
            }[settings?.heroAlignment || 'left'];

            return (
              <div className={`max-w-4xl space-y-6 flex flex-col ${alignClass}`}>
                {/* Dallas Hub Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/90 text-white text-xs font-bold tracking-wide backdrop-blur-md shadow-lg shadow-blue-900/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{settings?.heroBadgeText || t.texasWarehouseNotice}</span>
                </div>

                {/* Main Headline */}
                <h1 
                  className={`${sizeClass} font-extrabold tracking-tight leading-tight ${fontClass} drop-shadow-md transition-colors`}
                  style={{ color: settings?.heroTitleColor || '#ffffff' }}
                >
                  {title}
                </h1>

                {/* Subtitle */}
                <p 
                  className="text-base sm:text-lg leading-relaxed font-normal max-w-2xl drop-shadow-sm transition-colors"
                  style={{ color: settings?.heroSubtitleColor || '#e2e8f0' }}
                >
                  {subtitle}
                </p>

                {/* Key Value Props */}
                <div className={`flex flex-wrap gap-3 pt-2 text-xs font-medium text-slate-200 ${flexAlignClass}`}>
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>{settings?.heroBullet1 || (lang === 'es' ? 'Disponibilidad Inmediata en Dallas' : 'Direct Stock in Dallas, TX')}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>{settings?.heroBullet2 || (lang === 'es' ? 'Precios de Mayoreo p/ Constructores' : 'Contractor Wholesale Pricing')}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>{settings?.heroBullet3 || (lang === 'es' ? 'Fletes FTL & LTL a Todo EE. UU.' : 'Full Freight across US')}</span>
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className={`pt-4 flex flex-wrap items-center gap-4 ${flexAlignClass}`}>
                  <button
                    onClick={onOpenQuote}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-blue-600/40 transition transform active:scale-95"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{t.requestWholesaleQuote}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectCategory('Polished')}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg transition"
                  >
                    <span>{t.exploreCollections}</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Four Collections Cards Matrix (Bright Modern White & Blue Cards) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoryCards.map((cat) => (
            <div
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer bg-white border border-slate-200/90 hover:border-blue-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/15"
            >
              <img
                src={cat.bgImage}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 filter brightness-95 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <span className="self-start px-3 py-1 rounded-full bg-white/95 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider shadow-md backdrop-blur-md">
                  {cat.badge}
                </span>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
                    {cat.title}
                    <ChevronRight className="w-5 h-5 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed line-clamp-2">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
