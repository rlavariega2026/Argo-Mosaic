import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Language, CompanySettings } from '../types';
import { translations } from '../i18n';

interface ContactViewProps {
  lang: Language;
  settings: CompanySettings | null;
}

export const ContactView: React.FC<ContactViewProps> = ({ lang, settings }) => {
  const t = translations[lang];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const phoneRaw = (settings?.phone || '+12147902840').replace(/[^0-9+]/g, '');
  const whatsappRaw = (settings?.whatsapp || '12147902840').replace(/[^0-9]/g, '');
  const emailAddr = settings?.email || 'contact@argomosaic.com';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Editorial Header */}
      <div className="bg-white border-b border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Commercial Inquiries & Logistics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.contactTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {t.contactSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Details: Address, Hours, Fast Buttons (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Warehouse Card */}
            <div className="rounded-3xl bg-white border border-slate-200 p-7 space-y-6 shadow-xl shadow-blue-900/5">
              <div>
                <span className="text-[11px] uppercase text-blue-600 font-extrabold tracking-wider">
                  Logistics & Distribution Center
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {settings?.companyName || 'ARGO MOSAIC'}
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5 border border-blue-100">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold text-sm">{t.warehouseLocation}</strong>
                    <span className="text-slate-600 block mt-0.5 leading-relaxed">
                      {settings?.warehouseAddress || '11820 Regal Row, Suite 100'}<br />
                      {settings?.city || 'Dallas'}, {settings?.state || 'Texas'} {settings?.zipCode || '75247'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5 border border-blue-100">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">{lang === 'es' ? 'Teléfono Directo' : 'Direct Wholesale Phone'}</strong>
                    <a href={`tel:${phoneRaw}`} className="text-blue-600 hover:text-blue-700 font-bold text-sm block mt-0.5">
                      {settings?.phone || '+1 (214) 790-2840'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-0.5 border border-emerald-100">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">WhatsApp Business</strong>
                    <a
                      href={`https://wa.me/${whatsappRaw}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-bold text-sm block mt-0.5"
                    >
                      +{whatsappRaw}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5 border border-blue-100">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">{t.email}</strong>
                    <a href={`mailto:${emailAddr}`} className="text-slate-600 hover:text-blue-600 block mt-0.5 font-medium">
                      {emailAddr}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5 border border-blue-100">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">{t.businessHours}</strong>
                    <span className="text-slate-600 block mt-0.5 leading-relaxed">
                      {settings?.businessHours || 'Monday - Friday: 7:30 AM - 5:00 PM CST | Saturday: 8:00 AM - 1:00 PM CST'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hola, me comunico para consultar catálogo de ARGO MOSAIC.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat WhatsApp</span>
                </a>

                <a
                  href={`tel:${phoneRaw}`}
                  className="py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>{lang === 'es' ? 'Llamar Bodega' : 'Call Warehouse'}</span>
                </a>
              </div>
            </div>

            {/* Interactive Google Maps Embed (100% Editable from Admin Settings) */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xl shadow-blue-900/5 aspect-4/3 w-full p-2">
              <iframe
                src={settings?.googleMapsEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107297.86469614274!2d-96.88371363618635!3d32.81723145455639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e995574577ee3%3A0x6e9f191b72e49c71!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus'}
                title="Argo Mosaic Dallas Location"
                className="w-full h-full rounded-2xl border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Direct Wholesale Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 space-y-6 shadow-xl shadow-blue-900/5">
              <div>
                <span className="text-[11px] uppercase text-blue-600 font-extrabold tracking-wider">
                  Direct Inquiries
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {lang === 'es' ? 'Envía una Consulta a Nuestro Equipo' : 'Send an Inquiry to Our Commercial Team'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {lang === 'es'
                    ? 'Responderemos a tu solicitud con disponibilidad de inventario y cotización en menos de 2 horas hábiles.'
                    : 'We respond to all wholesale and jobsite inquiries with inventory availability within 2 business hours.'}
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {lang === 'es' ? '¡Mensaje Enviado con Éxito!' : 'Message Successfully Sent!'}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    {lang === 'es'
                      ? 'Nuestro equipo de atención comercial en Dallas revisará tu consulta de inmediato.'
                      : 'Our commercial team in Dallas will review your requirements and reach out shortly.'}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    {lang === 'es' ? 'Enviar otro mensaje' : 'Send another inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">{t.name} *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Austin"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:bg-white focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-bold">{t.email} *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@architecture.com"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:bg-white focus:border-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-bold">{t.phone} *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (214) 000-0000"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:bg-white focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">{t.message} *</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={lang === 'es' ? 'Indica las colecciones de interés, metraje aproximado o proyecto...' : 'Please specify surfaces of interest, estimated sq ft, project timeline or questions...'}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 resize-none focus:outline-hidden focus:bg-white focus:border-blue-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 text-sm"
                  >
                    {submitting ? (
                      <span>{lang === 'es' ? 'Enviando...' : 'Sending...'}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.sendMessage}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
