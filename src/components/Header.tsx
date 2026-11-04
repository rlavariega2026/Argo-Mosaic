import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingCart, 
  Layers, 
  Phone, 
  MapPin, 
  FileText, 
  Globe, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  ArrowRight,
  Download,
  SlidersHorizontal
} from 'lucide-react';
import { Language, CategoryType, CompanySettings } from '../types';
import { translations } from '../i18n';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onSelectTab: (tab: string, category?: CategoryType) => void;
  cartCount: number;
  onOpenCart: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenQuote: () => void;
  onOpenPublishModal: () => void;
  isPublicMode: boolean;
  settings: CompanySettings | null;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  compareCount,
  onOpenCompare,
  onOpenQuote,
  onOpenPublishModal,
  isPublicMode,
  settings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modelsDropdownOpen, setModelsDropdownOpen] = useState(false);
  const t = translations[lang];

  const logoSrc = settings?.logoUrl || '/assets/aistudio/Argo_Mosaic_Logo_Transparente_0aa6f2ad.png';

  const categories: { key: CategoryType; label: string; desc: string }[] = [
    { key: 'LVP', label: t.catLvp, desc: lang === 'es' ? 'Duela Vinílica Rígida SPC' : 'SPC Rigid Core Vinyl Planks' },
    { key: 'Wooden', label: t.catWooden, desc: lang === 'es' ? 'Madera de Ingeniería y Artesanal' : 'Engineered Hardwood & Planks' },
    { key: 'Matte Series', label: t.catMatte, desc: lang === 'es' ? 'Porcelanato Mate Antideslizante' : 'Architectural Matte Porcelain' },
    { key: 'Polished', label: t.catPolished, desc: lang === 'es' ? 'Porcelanato Pulido Espejo' : 'High-Gloss Polished Slabs' },
  ];

  const handleNavClick = (tab: string, cat?: CategoryType) => {
    onSelectTab(tab, cat);
    setMobileMenuOpen(false);
    setModelsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Top Commercial Bar (Clean Light Blue & White) */}
      <div className="bg-slate-50 border-b border-slate-200/80 text-xs px-4 py-1.5 font-medium tracking-wide text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{settings?.city || 'Dallas'}, {settings?.state || 'Texas'} Hub</span>
            </span>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <a href={`tel:${settings?.phone || '+12147902840'}`} className="hover:text-blue-700 transition">
                {settings?.phone || '+1 (214) 790-2840'}
              </a>
            </span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {!isPublicMode && (
              <>
                            {/* Editar App Button */}
                            <button
                              onClick={() => handleNavClick('admin')}
                              className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 hover:text-blue-700 bg-white hover:bg-slate-100 transition px-2.5 py-1 rounded-md border border-slate-300 shadow-xs"
                              title={lang === 'es' ? 'Editar todos los campos y datos de la app' : 'Edit all app fields and data'}
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                              <span>{lang === 'es' ? 'Editar App' : 'Edit App'}</span>
                            </button>
                
                            {/* Hostinger & Publish Modal Trigger */}
                            <button
                              onClick={onOpenPublishModal}
                              className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition px-2.5 py-1 rounded-md shadow-xs"
                              title="¿Dónde publicar y ver el resultado?"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{lang === 'es' ? 'Publicar en Hostinger' : 'Publish to Hostinger'}</span>
                            </button>
              </>
            )}

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white rounded-md p-0.5 border border-slate-200 shadow-xs">
              <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-0.5" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 text-[11px] rounded transition font-bold ${
                  lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('es')}
                className={`px-2 py-0.5 text-[11px] rounded transition font-bold ${
                  lang === 'es' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none py-1"
          >
            <div className="relative h-14 w-auto flex items-center">
              <img
                src={logoSrc}
                alt="ARGO MOSAIC"
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-slate-900 uppercase font-sans">
                ARGO <span className="text-blue-600 font-light">MOSAIC</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-500 uppercase font-mono font-semibold">
                Architectural Surfaces • Texas
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 text-sm font-semibold transition rounded-lg ${
                activeTab === 'home'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.navHome}
            </button>

            {/* Models Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setModelsDropdownOpen(!modelsDropdownOpen)}
                onMouseEnter={() => setModelsDropdownOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold transition rounded-lg ${
                  activeTab === 'models'
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{t.navModels}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              {modelsDropdownOpen && (
                <div 
                  onMouseLeave={() => setModelsDropdownOpen(false)}
                  className="absolute top-full left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                      {lang === 'es' ? 'Colecciones de Superficies' : 'Surface Collections'}
                    </p>
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => handleNavClick('models', cat.key)}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-blue-50 transition flex flex-col gap-0.5 group/item"
                    >
                      <span className="text-sm font-bold text-slate-900 group-hover/item:text-blue-600 transition flex items-center justify-between">
                        {cat.label}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all text-blue-600" />
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1">{cat.desc}</span>
                    </button>
                  ))}
                  <div className="pt-2 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleNavClick('models')}
                      className="w-full py-1.5 text-center text-xs text-blue-600 hover:text-blue-800 font-bold"
                    >
                      {lang === 'es' ? 'Ver Catálogo Completo' : 'View Full Catalog'} →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`px-3.5 py-2 text-sm font-semibold transition rounded-lg ${
                activeTab === 'gallery'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.navGallery}
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 text-sm font-semibold transition rounded-lg ${
                activeTab === 'about'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.navAbout}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 text-sm font-semibold transition rounded-lg ${
                activeTab === 'contact'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.navContact}
            </button>
          </nav>

          {/* Action Buttons: Compare, Quote, Order Now */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Compare Button */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.compare} ({compareCount})</span>
              </button>
            )}

            {/* Request a Quote CTA */}
            <button
              onClick={onOpenQuote}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.navQuote}</span>
            </button>

            {/* Order Now / Cart CTA */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30 transition transform active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t.navOrderNow}</span>
              {cartCount > 0 && (
                <span className="ml-1 bg-white text-blue-700 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu & Cart Icon */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 text-left text-sm rounded-lg font-bold ${
                activeTab === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className={`p-2.5 text-left text-sm rounded-lg font-bold ${
                activeTab === 'gallery' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {t.navGallery}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`p-2.5 text-left text-sm rounded-lg font-bold ${
                activeTab === 'about' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`p-2.5 text-left text-sm rounded-lg font-bold ${
                activeTab === 'contact' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {t.navContact}
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              {t.navModels}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => handleNavClick('models', c.key)}
                  className="p-2 text-left text-xs bg-slate-50 hover:bg-blue-50 text-slate-800 rounded-lg font-semibold border border-slate-200"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {!isPublicMode && (
              <>
                            <button
                              onClick={() => {
                                handleNavClick('admin');
                              }}
                              className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 shadow-xs"
                            >
                              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                              <span>{lang === 'es' ? 'Editar App (Todos los Campos)' : 'Edit App (All Fields)'}</span>
                            </button>
                
                            <button
                              onClick={() => {
                                onOpenPublishModal();
                                setMobileMenuOpen(false);
                              }}
                              className="w-full py-2.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border border-blue-200"
                            >
                              <Download className="w-4 h-4 text-blue-600" />
                              <span>Publicar en Hostinger (ZIP)</span>
                            </button>
              </>
            )}

            <button
              onClick={() => {
                onOpenQuote();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border border-slate-200"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              {t.navQuote}
            </button>

            <button
              onClick={() => {
                onOpenCart();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/30"
            >
              <ShoppingCart className="w-4 h-4" />
              {t.navOrderNow} ({cartCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
