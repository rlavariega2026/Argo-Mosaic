import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowUpRight, Award, Truck, Layers, SlidersHorizontal } from 'lucide-react';
import { Language, CompanySettings, CategoryType } from '../types';
import { translations } from '../i18n';

interface FooterProps {
  lang: Language;
  onSelectTab: (tab: string, category?: CategoryType) => void;
  settings: CompanySettings | null;
}

export const Footer: React.FC<FooterProps> = ({ lang, onSelectTab, settings }) => {
  const t = translations[lang];
  const logoSrc = settings?.logoUrl || '/assets/aistudio/Argo_Mosaic_Logo_Transparente_0aa6f2ad.png';

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600">
      {/* Wholesale Pillars Banner */}
      <div className="border-b border-slate-200/80 bg-slate-50/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                {settings?.pillar1Title || (lang === 'es' ? 'Entrega FTL & LTL en Texas' : 'Texas Logistics Hub')}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {settings?.pillar1Desc || (lang === 'es' 
                  ? 'Despacho directo desde nuestra bodega en Dallas con entrega programada o recolección sin costo para contratistas autorizados.'
                  : 'Dallas warehouse inventory with immediate dispatch or direct pickup for commercial builders.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                {settings?.pillar2Title || (lang === 'es' ? 'Estándares Técnicos Verificados' : 'Verified Lab Standards')}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {settings?.pillar2Desc || (lang === 'es'
                  ? 'Clasificaciones PEI, DCOF antideslizante y absorción de agua estrictamente capturadas para cumplir con códigos de construcción en EE. UU.'
                  : 'Curated architectural porcelain slabs and LVP planks direct from premier global manufacturers.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                {settings?.pillar3Title || (lang === 'es' ? 'Fichas PDF y Cotización Inmediata' : 'Bilingual Project Support')}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {settings?.pillar3Desc || (lang === 'es'
                  ? 'Generación automatizada de fichas técnicas en PDF con código QR y cálculo de volumen por caja o pie cuadrado.'
                  : 'Dedicated English & Spanish commercial representatives for volume quotes and tech specs.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Texas Logistics */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="ARGO MOSAIC"
                className="h-12 w-auto object-contain"
              />
              <div>
                <span className="text-lg font-extrabold text-slate-900 tracking-wider uppercase font-sans">
                  ARGO <span className="text-blue-600 font-light">MOSAIC</span>
                </span>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                  {settings?.brandTagline || 'Commercial Surfaces & Tile Supply'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              {lang === 'es' ? (settings?.descriptionEs || t.aboutMission) : (settings?.descriptionEn || t.aboutMission)}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onSelectTab('contact')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
              >
                <span>{lang === 'es' ? 'Contactar Bodega Dallas' : 'Contact Dallas Hub'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {t.navModels}
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  onClick={() => onSelectTab('models', 'LVP')}
                  className="hover:text-blue-600 transition"
                >
                  LVP (Luxury Vinyl Plank)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('models', 'Wooden')}
                  className="hover:text-blue-600 transition"
                >
                  Wooden Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('models', 'Matte Series')}
                  className="hover:text-blue-600 transition"
                >
                  Matte Architectural Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('models', 'Polished')}
                  className="hover:text-blue-600 transition"
                >
                  Polished Mirror Slabs
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {lang === 'es' ? 'Empresa y Servicios' : 'Company & Services'}
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-blue-600 transition">
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('gallery')} className="hover:text-blue-600 transition">
                  {t.navGallery}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('contact')} className="hover:text-blue-600 transition">
                  {t.navContact}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('admin')} className="hover:text-blue-600 transition flex items-center gap-1.5 text-slate-700 font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'es' ? 'Editar App / Panel' : 'Edit App / Admin'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Warehouse Contact */}
          <div className="space-y-3">
            <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {lang === 'es' ? 'Ubicación en Texas' : 'Texas Warehouse'}
            </h5>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  {settings?.warehouseAddress || '11820 Regal Row, Suite 100'}<br />
                  {settings?.city || 'Dallas'}, {settings?.state || 'Texas'} {settings?.zipCode || '75247'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <a href={`tel:${settings?.phone || '+12147902840'}`} className="hover:text-blue-600 font-bold transition">
                  {settings?.phone || '+1 (214) 790-2840'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <a href={`mailto:${settings?.email || 'contact@argomosaic.com'}`} className="hover:text-blue-600 font-medium transition">
                  {settings?.email || 'contact@argomosaic.com'}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight text-slate-500">
                  {settings?.businessHours || 'Mon-Fri: 7:30 AM - 5:00 PM CST'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Hostinger readiness */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p 
            onDoubleClick={() => onSelectTab('admin')} 
            className="cursor-default select-none"
            title="ARGO MOSAIC"
          >
            © {new Date().getFullYear()} ARGO MOSAIC LLC. All Rights Reserved. Texas, USA.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Wholesale Supply & Import</span>
            <span>•</span>
            <span className="text-blue-600 font-bold">Hostinger Production Ready (PHP/MySQL)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
