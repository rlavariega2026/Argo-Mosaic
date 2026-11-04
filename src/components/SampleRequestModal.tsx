import React, { useState } from 'react';
import { X, Box, CheckCircle2, Send, MapPin, Building, User, Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { Product, Language, CompanySettings } from '../types';
import { translations } from '../i18n';
import { apiClient } from '../api/client';

interface SampleRequestModalProps {
  product: Product | null;
  lang: Language;
  settings?: CompanySettings | null;
  onClose: () => void;
}

export const SampleRequestModal: React.FC<SampleRequestModalProps> = ({
  product,
  lang,
  settings,
  onClose,
}) => {
  const t = translations[lang];
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Texas');
  const [zipCode, setZipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sampleNumber, setSampleNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.createSample({
        productId: product.id,
        productName: lang === 'es' ? (product.nameEs || product.nameEn) : product.nameEn,
        fullName,
        company,
        email,
        phone,
        shippingAddress,
        city,
        state,
        zipCode,
      });
      setSampleNumber(res.sample?.sampleNumber || `SMP-${Date.now().toString().slice(-4)}`);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting sample request', err);
      setSampleNumber(`SMP-${Date.now().toString().slice(-4)}`);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = product ? (lang === 'es' ? (product.nameEs || product.nameEn) : product.nameEn) : '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{t.sampleModalTitle}</h2>
              <p className="text-xs text-slate-500 font-medium">{t.sampleSubtitle}</p>
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
            <h3 className="text-lg font-extrabold text-slate-900">{t.sampleSuccessTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              {t.sampleSuccessDesc}
            </p>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 font-mono text-xs font-bold text-blue-700 inline-block">
              Tracking #{sampleNumber}
            </div>

            {/* Configured Destination Routing Action Buttons */}
            <div className="space-y-2.5 max-w-sm mx-auto pt-2">
              {/* WhatsApp Action */}
              {(!settings?.sampleActionType || settings.sampleActionType === 'whatsapp' || settings.sampleActionType === 'both') && (() => {
                const targetWa = (settings?.sampleWhatsApp || settings?.whatsapp || '12147902840').replace(/[^0-9]/g, '');
                const waMsg = encodeURIComponent(
                  `*ARGO MOSAIC - SOLICITUD DE MUESTRA FÍSICA*\n` +
                  `Tracking: #${sampleNumber}\n` +
                  `Producto: ${title} (SKU: ${product?.sku || 'N/A'})\n` +
                  `Cliente: ${fullName}\n` +
                  `Empresa: ${company || 'N/A'}\n` +
                  `Teléfono: ${phone}\n` +
                  `Correo: ${email}\n` +
                  `Dirección de Envío: ${shippingAddress}, ${city}, ${state} ${zipCode}`
                );
                return (
                  <a
                    href={`https://wa.me/${targetWa}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{lang === 'es' ? 'Enviar Solicitud a WhatsApp de Muestras' : 'Send Sample Request to WhatsApp'}</span>
                  </a>
                );
              })()}

              {/* Email Action */}
              {(!settings?.sampleActionType || settings.sampleActionType === 'email' || settings.sampleActionType === 'both') && (() => {
                const targetEmail = settings?.sampleNotificationEmail || settings?.email || 'samples@argomosaic.com';
                const emailSubj = encodeURIComponent(`Nueva Solicitud de Muestra #${sampleNumber} - ${title}`);
                const emailBody = encodeURIComponent(
                  `Nueva solicitud de muestra en ARGO MOSAIC:\n\n` +
                  `Tracking: #${sampleNumber}\n` +
                  `Producto: ${title} (SKU: ${product?.sku || 'N/A'})\n` +
                  `Cliente: ${fullName}\n` +
                  `Empresa: ${company || 'N/A'}\n` +
                  `Teléfono: ${phone}\n` +
                  `Correo: ${email}\n` +
                  `Dirección: ${shippingAddress}, ${city}, ${state} ${zipCode}`
                );
                return (
                  <a
                    href={`mailto:${targetEmail}?subject=${emailSubj}&body=${emailBody}`}
                    className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === 'es' ? 'Enviar Copia a Correo de Muestras' : 'Send Copy to Samples Email'}</span>
                  </a>
                );
              })()}

              {/* Custom Redirect Link */}
              {settings?.sampleRedirectUrl && (
                <a
                  href={settings.sampleRedirectUrl}
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
            {/* Target Product Badge */}
            {product && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img src={product.primaryImage} alt="" className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-blue-600 font-extrabold uppercase">{product.category}</span>
                  <h4 className="text-xs font-extrabold text-slate-900 truncate">{title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">MOD: {product.model} | SKU: {product.sku}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Nombre Completo *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  {lang === 'es' ? 'Empresa / Despacho' : 'Company / Studio'}
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Texas Builders LLC"
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
                  placeholder="builder@domain.com"
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
                  placeholder="+1 (214) 000-0000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                {lang === 'es' ? 'Dirección de Envío de Muestra *' : 'Shipping Street Address *'}
              </label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="1234 Commerce St, Suite 200"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">{t.city} *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dallas"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">{t.state} *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">{t.zipCode} *</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="75201"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === 'es'
                ? 'Las muestras físicas se envían por mensajería especializada a despachos y constructoras en EE. UU.'
                : 'Physical samples are dispatched via courier directly to architecture firms and jobsites.'}
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{lang === 'es' ? 'Enviando...' : 'Dispatching...'}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.requestSampleBtn}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
