import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Send, Building2, MapPin, Calculator, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { Product, Language, QuoteRequest, CompanySettings } from '../types';
import { translations } from '../i18n';
import { apiClient } from '../api/client';

interface QuoteRequestModalProps {
  initialProduct?: Product | null;
  products: Product[];
  lang: Language;
  settings?: CompanySettings | null;
  onClose: () => void;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  initialProduct,
  products,
  lang,
  settings,
  onClose,
}) => {
  const t = translations[lang];

  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Commercial / Hospitality');
  const [deliveryCity, setDeliveryCity] = useState('Dallas');
  const [deliveryState, setDeliveryState] = useState('Texas');
  const [estimatedSqFt, setEstimatedSqFt] = useState<number>(2500);
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProduct?.id || (products[0]?.id || ''));
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const chosenProduct = products.find(p => p.id === selectedProductId) || initialProduct;
    const productName = chosenProduct ? (lang === 'es' ? (chosenProduct.nameEs || chosenProduct.nameEn) : chosenProduct.nameEn) : 'Multiple Collections';

    const payload: Partial<QuoteRequest> = {
      customerName,
      companyName,
      email,
      phone,
      projectType,
      deliveryCity,
      deliveryState,
      estimatedSqFt,
      productsRequested: [
        {
          productId: selectedProductId,
          productName,
          sqFt: estimatedSqFt,
          quantityBoxes: chosenProduct?.packaging?.sqFtPerBox ? Math.ceil(estimatedSqFt / chosenProduct.packaging.sqFtPerBox) : undefined
        }
      ],
      notes
    };

    try {
      const res = await apiClient.createQuote(payload);
      setQuoteNumber(res.quote?.quoteNumber || `QT-${Date.now().toString().slice(-4)}`);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting quote request', err);
      setQuoteNumber(`QT-${Date.now().toString().slice(-4)}`);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {lang === 'es' ? 'Solicitud de Cotización Formal' : 'Request Commercial Wholesale Quote'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'es' ? 'Precios preferenciales para constructoras y desarrollos' : 'Preferential pricing for volume & project orders'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-white border border-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">{t.quoteSuccessTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              {t.quoteSuccessDesc}
            </p>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 font-mono text-xs font-bold text-blue-700 inline-block">
              Folio Cotización: #{quoteNumber}
            </div>

            {/* Configured Destination Routing Action Buttons */}
            <div className="space-y-2.5 max-w-sm mx-auto pt-2">
              {/* WhatsApp Action */}
              {(!settings?.quoteActionType || settings.quoteActionType === 'whatsapp' || settings.quoteActionType === 'both') && (() => {
                const targetWa = (settings?.quoteWhatsApp || settings?.whatsapp || '12147902840').replace(/[^0-9]/g, '');
                const chosenProduct = products.find(p => p.id === selectedProductId) || initialProduct;
                const pName = chosenProduct ? (lang === 'es' ? (chosenProduct.nameEs || chosenProduct.nameEn) : chosenProduct.nameEn) : 'Múltiples Modelos';
                const waMsg = encodeURIComponent(
                  `*ARGO MOSAIC - SOLICITUD DE COTIZACIÓN DE MAYOREO*\n` +
                  `Folio: #${quoteNumber}\n` +
                  `Proyecto: ${projectType}\n` +
                  `Ciudad de Entrega: ${deliveryCity}, ${deliveryState}\n` +
                  `Superficie Estimada: ${estimatedSqFt} Sq Ft\n` +
                  `Producto Seleccionado: ${pName}\n` +
                  `Cliente: ${customerName}\n` +
                  `Empresa: ${companyName || 'N/A'}\n` +
                  `Teléfono: ${phone}\n` +
                  `Correo: ${email}\n` +
                  (notes ? `Notas: ${notes}` : '')
                );
                return (
                  <a
                    href={`https://wa.me/${targetWa}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{lang === 'es' ? 'Enviar Cotización a WhatsApp del Asesor' : 'Send Quote to WhatsApp Advisor'}</span>
                  </a>
                );
              })()}

              {/* Email Action */}
              {(!settings?.quoteActionType || settings.quoteActionType === 'email' || settings.quoteActionType === 'both') && (() => {
                const targetEmail = settings?.quoteNotificationEmail || settings?.email || 'quotes@argomosaic.com';
                const chosenProduct = products.find(p => p.id === selectedProductId) || initialProduct;
                const pName = chosenProduct ? (lang === 'es' ? (chosenProduct.nameEs || chosenProduct.nameEn) : chosenProduct.nameEn) : 'Múltiples Modelos';
                const emailSubj = encodeURIComponent(`Nueva Solicitud de Cotización #${quoteNumber} - ${customerName}`);
                const emailBody = encodeURIComponent(
                  `Nueva solicitud de cotización en ARGO MOSAIC:\n\n` +
                  `Folio: #${quoteNumber}\n` +
                  `Proyecto: ${projectType}\n` +
                  `Ubicación: ${deliveryCity}, ${deliveryState}\n` +
                  `Metraje / Superficie: ${estimatedSqFt} Sq Ft\n` +
                  `Producto: ${pName}\n` +
                  `Cliente: ${customerName}\n` +
                  `Empresa: ${companyName || 'N/A'}\n` +
                  `Teléfono: ${phone}\n` +
                  `Correo: ${email}\n\n` +
                  `Notas:\n${notes || 'Sin notas adicionales'}`
                );
                return (
                  <a
                    href={`mailto:${targetEmail}?subject=${emailSubj}&body=${emailBody}`}
                    className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === 'es' ? 'Enviar Copia a Correo de Cotizaciones' : 'Send Copy to Quotes Email'}</span>
                  </a>
                );
              })()}

              {/* Custom Redirect Link */}
              {settings?.quoteRedirectUrl && (
                <a
                  href={settings.quoteRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Abrir Enlace Personalizado' : 'Open Custom Link'}</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                {lang === 'es' ? 'Cerrar' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Product selection */}
            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                {lang === 'es' ? 'Colección o Superficie de Interés *' : 'Selected Surface / Collection *'}
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:bg-white focus:border-blue-500"
              >
                {products.map((p) => {
                  const pTitle = lang === 'es' ? (p.nameEs || p.nameEn) : p.nameEn;
                  return (
                    <option key={p.id} value={p.id}>
                      [{p.category}] {pTitle} - {p.model} ({p.size})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Superficie Estimada (Sq Ft) *' : 'Estimated Sq Ft *'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={estimatedSqFt}
                    onChange={(e) => setEstimatedSqFt(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:bg-white focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    sq ft
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Tipo de Proyecto' : 'Project Type'}
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                >
                  <option value="Commercial / Hospitality">Commercial / Hospitality</option>
                  <option value="Multi-Family Residential">Multi-Family Residential</option>
                  <option value="Single Family Luxury">Single Family Luxury Residence</option>
                  <option value="Retail & Showroom">Retail & Corporate Showroom</option>
                  <option value="Contractor Resale">Contractor Wholesale Supply</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Nombre del Solicitante *' : 'Contact Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Carlos Garza"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Empresa / Constructora' : 'Company / Contractor'}
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Lone Star Developments"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Correo Electrónico *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Teléfono *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (214) 555-0199"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Ciudad de Destino / Obra *' : 'Project City *'}
                </label>
                <input
                  type="text"
                  required
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Estado *' : 'State *'}
                </label>
                <input
                  type="text"
                  required
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                {lang === 'es' ? 'Especificaciones o Notas Adicionales' : 'Project Notes / Timelines'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'es' ? 'Requerimientos de entrega, fecha estimada de colocación, etc.' : 'Timeline, freight dock access, special delivery needs...'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium resize-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 text-sm"
            >
              {isSubmitting ? (
                <span>{lang === 'es' ? 'Generando Cotización...' : 'Submitting Quote Request...'}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{lang === 'es' ? 'Enviar Solicitud de Cotización' : 'Submit Commercial Quote Request'}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
