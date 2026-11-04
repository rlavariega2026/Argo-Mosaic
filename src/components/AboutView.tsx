import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle, 
  Truck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Language, SalesRep, CompanySettings } from '../types';
import { translations } from '../i18n';

interface AboutViewProps {
  salesReps: SalesRep[];
  lang: Language;
  settings: CompanySettings | null;
  onOpenQuote: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  salesReps,
  lang,
  settings,
  onOpenQuote,
}) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Editorial Header */}
      <div className="bg-white border-b border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Texas Commercial Supply</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.aboutTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {lang === 'es' ? (settings?.descriptionEs || t.aboutMission) : (settings?.descriptionEn || t.aboutMission)}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Company Identity & Texas Logistics Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              {lang === 'es' ? 'Infraestructura de Distribución' : 'Distribution Infrastructure'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {lang === 'es'
                ? 'Conectando la fabricación mundial con contratistas y desarrolladores en Texas'
                : 'Direct global porcelain import supplying builders and developers across Texas'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'es'
                ? 'ARGO MOSAIC opera con un enfoque corporativo centrado en la calidad de materiales arquitectónicos, importando directamente grandes formatos de porcelanato pulido, series mate con alto DCOF, maderas de ingeniería y pisos vinílicos SPC de alto rendimiento.'
                : 'ARGO MOSAIC is an enterprise architectural distributor specializing in direct importation of premier porcelain slabs, high-DCOF matte collections, handcrafted hardwood, and heavy commercial SPC rigid core vinyl flooring.'}
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{lang === 'es' ? 'Inventario Inmediato en Texas:' : 'Immediate Texas Stock:'}</strong>{' '}
                  {lang === 'es'
                    ? 'Bodega con inventario permanente en Dallas para recolección o envío inmediato a obra.'
                    : 'Dedicated distribution center in Dallas for warehouse pickup or rapid freight transit.'}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{lang === 'es' ? 'Precios de Mayoreo y Proyectos:' : 'Volume Wholesale Pricing:'}</strong>{' '}
                  {lang === 'es'
                    ? 'Tarifas preferenciales por tarima completa y contenedor directo para desarrollos.'
                    : 'Pallet-level and full-container volume pricing for large commercial and multi-family jobs.'}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{lang === 'es' ? 'Muestras Físicas a Obra:' : 'Jobsite Physical Swatches:'}</strong>{' '}
                  {lang === 'es'
                    ? 'Envío ágil de piezas de muestra para despachos de diseño y juntas de comité de obra.'
                    : 'Sample swatches shipped direct to architecture firms and construction project offices.'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenQuote}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
              >
                <span>{t.requestWholesaleQuote}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-blue-900/5">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
              alt="ARGO MOSAIC Texas Warehouse"
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-md shadow-lg text-slate-900">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-1">
                <MapPin className="w-4 h-4" />
                <span>Dallas Logistics Center</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {settings?.warehouseAddress || '11820 Regal Row, Suite 100'}, {settings?.city || 'Dallas'}, {settings?.state || 'Texas'}
              </p>
            </div>
          </div>
        </div>

        {/* Commercial Sales Representatives Section */}
        <div className="space-y-6 pt-10 border-t border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Direct Contact & Project Advising
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.meetRepresentatives}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              {lang === 'es'
                ? 'Nuestros asesores comerciales brindan atención personalizada para cotizaciones de volumen, especificaciones técnicas y visitas a obra.'
                : 'Connect directly with our commercial account managers for project specifications, volume quotes, and on-site support.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesReps.map((rep) => (
              <div
                key={rep.id}
                className="rounded-3xl bg-white border border-slate-200 hover:border-blue-400 transition p-6 space-y-4 shadow-xl shadow-blue-900/5 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={rep.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={rep.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{rep.name}</h3>
                    <p className="text-xs text-blue-600 font-bold">{rep.title}</p>
                    <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                      {rep.languages || 'English / Español'}
                    </span>
                  </div>
                </div>

                {/* Assigned Collections */}
                {rep.assignedCategories && rep.assignedCategories.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                      {lang === 'es' ? 'Colecciones Asignadas:' : 'Assigned Collections:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rep.assignedCategories.map((c, i) => (
                        <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${rep.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${rep.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === 'es' ? 'Llamar' : 'Call'}</span>
                  </a>

                  <a
                    href={`mailto:${rep.email}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                    title={rep.email}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
