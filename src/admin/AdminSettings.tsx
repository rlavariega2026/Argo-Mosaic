import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  Upload, 
  Globe, 
  Download, 
  CheckCircle2, 
  Server,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Truck,
  Award,
  Eye,
  SlidersHorizontal,
  Clock,
  RotateCcw,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { CompanySettings } from '../types';
import { apiClient } from '../api/client';

interface AdminSettingsProps {
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings: initialSettings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<CompanySettings>(initialSettings);
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'pillars' | 'routing' | 'company' | 'paypal' | 'hostinger'>('hero');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const res = await apiClient.uploadFile(file);
      setFormData({ ...formData, logoUrl: res.fileUrl });
    } catch (err) {
      console.error('Failed to upload logo', err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const res = await apiClient.uploadFile(file);
      setFormData({ ...formData, homeHeroImage: res.fileUrl });
    } catch (err) {
      console.error('Failed to upload hero image', err);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleDownloadHostingerZip = async () => {
    setDownloadingZip(true);
    try {
      const res = await fetch('/api/hostinger-export');
      if (!res.ok) throw new Error('Export service error');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'argo-mosaic-hostinger-production.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading Hostinger package', err);
      alert('Error generando el paquete para Hostinger.');
    } finally {
      setDownloadingZip(false);
    }
  };

  const titleColorPresets = [
    { label: 'Blanco Puro', color: '#ffffff' },
    { label: 'Azul Royal ARGO', color: '#2563eb' },
    { label: 'Ámbar Dorado', color: '#f59e0b' },
    { label: 'Slate Grafito', color: '#0f172a' },
    { label: 'Azul Cielo', color: '#38bdf8' }
  ];

  const subtitleColorPresets = [
    { label: 'Gris Perla', color: '#e2e8f0' },
    { label: 'Blanco Puro', color: '#ffffff' },
    { label: 'Azul Hielo', color: '#93c5fd' },
    { label: 'Oro Suave', color: '#fef08a' },
    { label: 'Pizarra Suave', color: '#475569' }
  ];

  return (
    <div className="space-y-6 text-stone-100 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-white">Configuración del Sitio y Operaciones</h2>
        <p className="text-xs text-stone-400">
          Personaliza la portada, tipografías, alineación, colores, textos comerciales, bodega en Texas y credenciales de ARGO MOSAIC.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap border-b border-stone-800 text-xs font-semibold gap-1">
        <button
          onClick={() => setActiveSubTab('hero')}
          className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'hero'
              ? 'border-blue-500 text-blue-400 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Portada y Tipografía (Hero)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pillars')}
          className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'pillars'
              ? 'border-blue-500 text-blue-400 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Pilares Comerciales (Logística)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('routing')}
          className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'routing'
              ? 'border-emerald-500 text-emerald-400 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Destinos (WhatsApp / Correo / Enlaces)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('company')}
          className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'company'
              ? 'border-blue-500 text-blue-400 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Empresa y Bodega Dallas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('paypal')}
          className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'paypal'
              ? 'border-blue-500 text-blue-400 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>PayPal</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hostinger')}
          className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'hostinger'
              ? 'border-purple-500 text-purple-400 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Paquete Hostinger (ZIP)</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="font-semibold">¡Configuración guardada exitosamente! Los cambios se reflejan de inmediato en la aplicación.</span>
        </div>
      )}

      {/* SUBTAB: HERO & TYPOGRAPHY SETTINGS */}
      {activeSubTab === 'hero' && (
        <form onSubmit={handleSubmit} className="p-6 bg-stone-900 border border-stone-800 rounded-2xl space-y-6 text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span>Personalización Completa de Portada (Hero)</span>
              </h3>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Edita la foto de portada, elige la tipografía (font), tamaño, alineación, colores y textos en vivo.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Portada</span>
            </button>
          </div>

          {/* 1. FOTO DE PORTADA */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
            <span className="font-bold text-blue-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>Foto de Portada / Fondo del Hero</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative rounded-lg overflow-hidden border border-stone-800 h-28 bg-stone-900">
                <img
                  src={formData.homeHeroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85'}
                  alt="Vista previa Portada"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-stone-300 font-mono">
                  Vista Previa
                </span>
              </div>

              <div className="md:col-span-2 space-y-2">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">URL de la Imagen de Portada</label>
                  <input
                    type="url"
                    value={formData.homeHeroImage || ''}
                    onChange={(e) => setFormData({ ...formData, homeHeroImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <label className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-xs cursor-pointer font-semibold inline-flex items-center gap-1.5 border border-stone-700">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>{uploadingHero ? 'Subiendo imagen...' : 'Cargar foto desde mi dispositivo'}</span>
                    <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                  </label>
                  <span className="text-[10px] text-stone-400">Formatos recomendados: JPG, WebP o PNG de alta resolución (1920x1080)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CONTROLES DE TIPOGRAFÍA, TAMAÑO, ALINEACIÓN Y COLORES */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-4">
            <span className="font-bold text-blue-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
              <Palette className="w-4 h-4" />
              <span>Estilo Visual, Tipografía y Paleta de Colores</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Font Family */}
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Tipo de Fuente (Font)</label>
                <select
                  value={formData.heroFontFamily || 'sans'}
                  onChange={(e) => setFormData({ ...formData, heroFontFamily: e.target.value as any })}
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-semibold"
                >
                  <option value="sans">Plus Jakarta Sans (Moderna y Limpia)</option>
                  <option value="serif">Playfair Serif (Elegante y Editorial)</option>
                  <option value="mono">JetBrains Mono (Técnica / Arquitectónica)</option>
                  <option value="system">Sistema Sans-Serif Nativo</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Tamaño del Título (Size)</label>
                <select
                  value={formData.heroFontSize || 'lg'}
                  onChange={(e) => setFormData({ ...formData, heroFontSize: e.target.value as any })}
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-semibold"
                >
                  <option value="sm">Compacto (3xl - 5xl)</option>
                  <option value="md">Estándar (4xl - 6xl)</option>
                  <option value="lg">Grande (5xl - 7xl) • Recomendado</option>
                  <option value="xl">Monumental (6xl - 8xl)</option>
                </select>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Alineación de Texto</label>
                <div className="grid grid-cols-3 gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroAlignment: 'left' })}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 text-[11px] font-semibold transition ${
                      (formData.heroAlignment || 'left') === 'left' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Izq</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroAlignment: 'center' })}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 text-[11px] font-semibold transition ${
                      formData.heroAlignment === 'center' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                    <span>Centro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroAlignment: 'right' })}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 text-[11px] font-semibold transition ${
                      formData.heroAlignment === 'right' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                    <span>Der</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Colors Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800/80">
              {/* Title Color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-stone-300 font-semibold">Color del Título Principal</label>
                  <span className="font-mono text-[11px] text-stone-400">{formData.heroTitleColor || '#ffffff'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.heroTitleColor || '#ffffff'}
                    onChange={(e) => setFormData({ ...formData, heroTitleColor: e.target.value })}
                    className="w-10 h-9 p-0.5 rounded bg-stone-900 border border-stone-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.heroTitleColor || '#ffffff'}
                    onChange={(e) => setFormData({ ...formData, heroTitleColor: e.target.value })}
                    placeholder="#ffffff"
                    className="flex-1 p-2 bg-stone-900 border border-stone-800 rounded font-mono text-white text-xs"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {titleColorPresets.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setFormData({ ...formData, heroTitleColor: p.color })}
                      className="px-2 py-0.5 rounded text-[10px] border border-stone-700 flex items-center gap-1 bg-stone-900 hover:border-stone-500"
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/40" style={{ backgroundColor: p.color }} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtitle Color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-stone-300 font-semibold">Color del Subtítulo</label>
                  <span className="font-mono text-[11px] text-stone-400">{formData.heroSubtitleColor || '#e2e8f0'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.heroSubtitleColor || '#e2e8f0'}
                    onChange={(e) => setFormData({ ...formData, heroSubtitleColor: e.target.value })}
                    className="w-10 h-9 p-0.5 rounded bg-stone-900 border border-stone-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.heroSubtitleColor || '#e2e8f0'}
                    onChange={(e) => setFormData({ ...formData, heroSubtitleColor: e.target.value })}
                    placeholder="#e2e8f0"
                    className="flex-1 p-2 bg-stone-900 border border-stone-800 rounded font-mono text-white text-xs"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {subtitleColorPresets.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setFormData({ ...formData, heroSubtitleColor: p.color })}
                      className="px-2 py-0.5 rounded text-[10px] border border-stone-700 flex items-center gap-1 bg-stone-900 hover:border-stone-500"
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/40" style={{ backgroundColor: p.color }} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW BOX */}
            <div className="pt-2 border-t border-stone-800/80">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Previsualización en Tiempo Real del Encabezado</span>
              </span>
              <div 
                className="relative p-6 rounded-xl overflow-hidden border border-stone-800 bg-stone-950 min-h-[160px] flex flex-col justify-center"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(2, 6, 23, 0.9), rgba(2, 6, 23, 0.7)), url(${formData.homeHeroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  textAlign: (formData.heroAlignment || 'left') as any
                }}
              >
                <div className={`space-y-2 flex flex-col ${
                  formData.heroAlignment === 'center' ? 'items-center' : formData.heroAlignment === 'right' ? 'items-end' : 'items-start'
                }`}>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>{formData.heroBadgeText || 'Inventario Directo desde nuestro Centro Logístico en Dallas, Texas'}</span>
                  </span>
                  <h4 
                    className={`font-extrabold leading-tight text-lg sm:text-xl ${
                      formData.heroFontFamily === 'serif' ? 'font-serif' : formData.heroFontFamily === 'mono' ? 'font-mono' : 'font-sans'
                    }`}
                    style={{ color: formData.heroTitleColor || '#ffffff' }}
                  >
                    {formData.homeHeroTitleEs || 'Superficies Arquitectónicas Diseñadas para la Distinción'}
                  </h4>
                  <p 
                    className="text-xs max-w-xl leading-relaxed"
                    style={{ color: formData.heroSubtitleColor || '#e2e8f0' }}
                  >
                    {formData.homeHeroSubtitleEs || 'Importador directo de pisos LVP, superficies de madera, colecciones mate y porcelanatos pulidos en Texas y todo EE. UU.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TEXTOS EDITABLES DEL HERO */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-4">
            <span className="font-bold text-blue-400 uppercase font-mono text-[11px]">
              Textos de Portada y Mensajes Clave
            </span>

            {/* Badge */}
            <div>
              <label className="block text-stone-300 mb-1 font-semibold">Badge Superior / Aviso Logístico</label>
              <input
                type="text"
                value={formData.heroBadgeText || ''}
                onChange={(e) => setFormData({ ...formData, heroBadgeText: e.target.value })}
                placeholder="Inventario Directo desde nuestro Centro Logístico en Dallas, Texas"
                className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-semibold"
              />
            </div>

            {/* Títulos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Título Principal (Español)</label>
                <input
                  type="text"
                  value={formData.homeHeroTitleEs}
                  onChange={(e) => setFormData({ ...formData, homeHeroTitleEs: e.target.value })}
                  placeholder="Superficies Arquitectónicas Diseñadas para la Distinción"
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Main Hero Title (English)</label>
                <input
                  type="text"
                  value={formData.homeHeroTitleEn}
                  onChange={(e) => setFormData({ ...formData, homeHeroTitleEn: e.target.value })}
                  placeholder="Architectural Surfaces Engineered for Distinction"
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-bold"
                />
              </div>
            </div>

            {/* Subtítulos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Subtítulo (Español)</label>
                <textarea
                  rows={2}
                  value={formData.homeHeroSubtitleEs}
                  onChange={(e) => setFormData({ ...formData, homeHeroSubtitleEs: e.target.value })}
                  placeholder="Importador directo de pisos LVP, superficies de madera, colecciones mate y porcelanatos pulidos en Texas y todo EE. UU."
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Subtitle (English)</label>
                <textarea
                  rows={2}
                  value={formData.homeHeroSubtitleEn}
                  onChange={(e) => setFormData({ ...formData, homeHeroSubtitleEn: e.target.value })}
                  placeholder="Direct importer of premium LVP, wood surfaces, matte collections, and high-gloss porcelain across Texas and nationwide."
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white resize-none"
                />
              </div>
            </div>

            {/* 3 Balas de Valor / Puntos Clave */}
            <div className="space-y-3 pt-2 border-t border-stone-800/80">
              <span className="text-[11px] font-bold text-stone-300 block">3 Puntos Clave / Balas del Hero</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold text-[11px]">Bala 1</label>
                  <input
                    type="text"
                    value={formData.heroBullet1 || ''}
                    onChange={(e) => setFormData({ ...formData, heroBullet1: e.target.value })}
                    placeholder="Disponibilidad Inmediata en Dallas"
                    className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold text-[11px]">Bala 2</label>
                  <input
                    type="text"
                    value={formData.heroBullet2 || ''}
                    onChange={(e) => setFormData({ ...formData, heroBullet2: e.target.value })}
                    placeholder="Precios de Mayoreo p/ Constructores"
                    className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold text-[11px]">Bala 3</label>
                  <input
                    type="text"
                    value={formData.heroBullet3 || ''}
                    onChange={(e) => setFormData({ ...formData, heroBullet3: e.target.value })}
                    placeholder="Fletes FTL & LTL a Todo EE. UU."
                    className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración de Portada</span>
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB: PILARES COMERCIALES & LOGÍSTICA */}
      {activeSubTab === 'pillars' && (
        <form onSubmit={handleSubmit} className="p-6 bg-stone-900 border border-stone-800 rounded-2xl space-y-6 text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Pilares Comerciales, Logística y Ventajas de Mayoreo</span>
              </h3>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Edita los 3 pilares que aparecen en las tarjetas informativas de la plataforma y en el pie de página.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Pilares</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Pilar 1 */}
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold uppercase font-mono text-[11px]">
                <Truck className="w-4 h-4" />
                <span>Pilar 1 — Logística y Despacho en Texas</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Título del Pilar 1</label>
                  <input
                    type="text"
                    value={formData.pillar1Title || ''}
                    onChange={(e) => setFormData({ ...formData, pillar1Title: e.target.value })}
                    placeholder="Entrega FTL & LTL en Texas"
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-400 mb-1 font-semibold">Descripción del Pilar 1</label>
                  <textarea
                    rows={2}
                    value={formData.pillar1Desc || ''}
                    onChange={(e) => setFormData({ ...formData, pillar1Desc: e.target.value })}
                    placeholder="Despacho directo desde nuestra bodega en Dallas con entrega programada o recolección sin costo para contratistas autorizados."
                    className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold uppercase font-mono text-[11px]">
                <Layers className="w-4 h-4" />
                <span>Pilar 2 — Estándares Técnicos e Importación Directa</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Título del Pilar 2</label>
                  <input
                    type="text"
                    value={formData.pillar2Title || ''}
                    onChange={(e) => setFormData({ ...formData, pillar2Title: e.target.value })}
                    placeholder="Estándares Técnicos Verificados"
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-400 mb-1 font-semibold">Descripción del Pilar 2</label>
                  <textarea
                    rows={2}
                    value={formData.pillar2Desc || ''}
                    onChange={(e) => setFormData({ ...formData, pillar2Desc: e.target.value })}
                    placeholder="Clasificaciones PEI, DCOF antideslizante y absorción de agua estrictamente capturadas para cumplir con códigos de construcción en EE. UU."
                    className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold uppercase font-mono text-[11px]">
                <Award className="w-4 h-4" />
                <span>Pilar 3 — Fichas Técnicas PDF y Asesoría Bilingüe</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Título del Pilar 3</label>
                  <input
                    type="text"
                    value={formData.pillar3Title || ''}
                    onChange={(e) => setFormData({ ...formData, pillar3Title: e.target.value })}
                    placeholder="Fichas PDF y Cotización Inmediata"
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-400 mb-1 font-semibold">Descripción del Pilar 3</label>
                  <textarea
                    rows={2}
                    value={formData.pillar3Desc || ''}
                    onChange={(e) => setFormData({ ...formData, pillar3Desc: e.target.value })}
                    placeholder="Generación automatizada de fichas técnicas en PDF con código QR y cálculo de volumen por caja o pie cuadrado."
                    className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Pilares Comerciales</span>
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB: DESTINATION CHANNELS & ROUTING (Pedidos, Muestras, Cotizaciones) */}
      {activeSubTab === 'routing' && (
        <form onSubmit={handleSubmit} className="p-6 bg-stone-900 border border-stone-800 rounded-2xl space-y-6 text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Destinos y Enlaces para Pedidos, Muestras y Cotizaciones</span>
              </h3>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Configura a dónde se dirigen los botones cuando un cliente hace un pedido (después de pagar), solicita una muestra o solicita una cotización.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Destinos</span>
            </button>
          </div>

          <div className="space-y-5">
            {/* 1. PEDIDOS Y COMPRAS MAYORISTAS */}
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase font-mono text-[11px]">
                  <Truck className="w-4 h-4" />
                  <span>1. Pedidos Mayoristas (Al Pagar / Finalizar Pedido)</span>
                </div>
                <span className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                  Carrito y Checkout
                </span>
              </div>
              <p className="text-stone-300 text-[11px]">
                Cuando un cliente completa su pedido o pago en PayPal, la app le muestra los botones configurados aquí para enviar inmediatamente la orden completa con productos, metraje y datos de entrega.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Canal de Acción</label>
                  <select
                    value={formData.orderActionType || 'both'}
                    onChange={(e) => setFormData({ ...formData, orderActionType: e.target.value as any })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-semibold"
                  >
                    <option value="both">WhatsApp y Correo (Recomendado)</option>
                    <option value="whatsapp">Solo WhatsApp Directo</option>
                    <option value="email">Solo Correo Electrónico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp para Pedidos</span>
                  </label>
                  <input
                    type="text"
                    value={formData.orderWhatsApp || ''}
                    onChange={(e) => setFormData({ ...formData, orderWhatsApp: e.target.value })}
                    placeholder="12147902840 (Código de país + número)"
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">Ejemplo para EE. UU.: 12147902840</span>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Correo para Pedidos</span>
                  </label>
                  <input
                    type="email"
                    value={formData.orderNotificationEmail || ''}
                    onChange={(e) => setFormData({ ...formData, orderNotificationEmail: e.target.value })}
                    placeholder="orders@argomosaic.com"
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold flex items-center gap-1 text-[11px]">
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                  <span>Enlace Web Externo Opcional para Pedidos (Redirección personalizada)</span>
                </label>
                <input
                  type="url"
                  value={formData.orderRedirectUrl || ''}
                  onChange={(e) => setFormData({ ...formData, orderRedirectUrl: e.target.value })}
                  placeholder="https://tudominio.com/gracias o https://forms.gle/..."
                  className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white text-[11px] font-mono"
                />
              </div>
            </div>

            {/* 2. SOLICITUD DE MUESTRAS FÍSICAS */}
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold uppercase font-mono text-[11px]">
                  <Layers className="w-4 h-4" />
                  <span>2. Solicitudes de Muestras Físicas (Botón 'Solicitar Muestra')</span>
                </div>
                <span className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                  Ficha de Producto y Catálogo
                </span>
              </div>
              <p className="text-stone-300 text-[11px]">
                Cuando un arquitecto o cliente pide una muestra física a su obra, el botón envía automáticamente el folio con el modelo, SKU y domicilio.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Canal de Acción</label>
                  <select
                    value={formData.sampleActionType || 'both'}
                    onChange={(e) => setFormData({ ...formData, sampleActionType: e.target.value as any })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-semibold"
                  >
                    <option value="both">WhatsApp y Correo (Recomendado)</option>
                    <option value="whatsapp">Solo WhatsApp Directo</option>
                    <option value="email">Solo Correo Electrónico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp para Muestras</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sampleWhatsApp || ''}
                    onChange={(e) => setFormData({ ...formData, sampleWhatsApp: e.target.value })}
                    placeholder="12147902840 (Código de país + número)"
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">Ejemplo para EE. UU.: 12147902840</span>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Correo para Muestras</span>
                  </label>
                  <input
                    type="email"
                    value={formData.sampleNotificationEmail || ''}
                    onChange={(e) => setFormData({ ...formData, sampleNotificationEmail: e.target.value })}
                    placeholder="samples@argomosaic.com"
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold flex items-center gap-1 text-[11px]">
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                  <span>Enlace Web Externo Opcional para Muestras</span>
                </label>
                <input
                  type="url"
                  value={formData.sampleRedirectUrl || ''}
                  onChange={(e) => setFormData({ ...formData, sampleRedirectUrl: e.target.value })}
                  placeholder="https://tudominio.com/muestras o formulario externo"
                  className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white text-[11px] font-mono"
                />
              </div>
            </div>

            {/* 3. SOLICITUD DE COTIZACIONES DE MAYOREO */}
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase font-mono text-[11px]">
                  <Award className="w-4 h-4" />
                  <span>3. Cotizaciones Formales (Botón 'Solicitar Cotización')</span>
                </div>
                <span className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                  Constructoras y Proyectos
                </span>
              </div>
              <p className="text-stone-300 text-[11px]">
                Cuando un contratista solicita cotización por tarima o volumen, el botón envía al asesor el metraje en Sq Ft, tipo de proyecto y colección requerida.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Canal de Acción</label>
                  <select
                    value={formData.quoteActionType || 'both'}
                    onChange={(e) => setFormData({ ...formData, quoteActionType: e.target.value as any })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-semibold"
                  >
                    <option value="both">WhatsApp y Correo (Recomendado)</option>
                    <option value="whatsapp">Solo WhatsApp Directo</option>
                    <option value="email">Solo Correo Electrónico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp para Cotizaciones</span>
                  </label>
                  <input
                    type="text"
                    value={formData.quoteWhatsApp || ''}
                    onChange={(e) => setFormData({ ...formData, quoteWhatsApp: e.target.value })}
                    placeholder="12147902840 (Código de país + número)"
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">Ejemplo para EE. UU.: 12147902840</span>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Correo para Cotizaciones</span>
                  </label>
                  <input
                    type="email"
                    value={formData.quoteNotificationEmail || ''}
                    onChange={(e) => setFormData({ ...formData, quoteNotificationEmail: e.target.value })}
                    placeholder="quotes@argomosaic.com"
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold flex items-center gap-1 text-[11px]">
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                  <span>Enlace Web Externo Opcional para Cotizaciones</span>
                </label>
                <input
                  type="url"
                  value={formData.quoteRedirectUrl || ''}
                  onChange={(e) => setFormData({ ...formData, quoteRedirectUrl: e.target.value })}
                  placeholder="https://tudominio.com/cotizaciones o enlace a CRM"
                  className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white text-[11px] font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración de Destinos</span>
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB: COMPANY & TEXAS WAREHOUSE */}
      {activeSubTab === 'company' && (
        <form onSubmit={handleSubmit} className="p-6 bg-stone-900 border border-stone-800 rounded-2xl space-y-5 text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Identidad de Empresa y Bodega en Dallas, Texas</span>
              </h3>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Administra el logotipo oficial, el slogan de marca, teléfonos, correos y ubicación exacta de la bodega.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Datos</span>
            </button>
          </div>

          {/* Logo Original */}
          <div className="flex items-center gap-4 p-4 bg-stone-950 rounded-xl border border-stone-800">
            <img src={formData.logoUrl} alt="Logo" className="h-16 w-auto object-contain bg-stone-900 p-2 rounded" />
            <div>
              <strong className="text-white block font-bold">Logotipo Original de ARGO MOSAIC</strong>
              <span className="text-[11px] text-stone-400 block mb-2">
                Aparece en el encabezado, catálogo, pie de página y fichas técnicas PDF.
              </span>
              <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs cursor-pointer font-semibold inline-block">
                <span>{uploadingLogo ? 'Subiendo...' : 'Cambiar / Cargar Logotipo'}</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Brand Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Nombre Comercial</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="ARGO MOSAIC"
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Slogan / Brand Tagline</label>
              <input
                type="text"
                value={formData.brandTagline || ''}
                onChange={(e) => setFormData({ ...formData, brandTagline: e.target.value })}
                placeholder="Commercial Surfaces & Tile Supply"
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-bold text-blue-400"
              />
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Teléfono de Atención</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (214) 790-2840"
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">WhatsApp Comercial</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="12147902840"
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Correo de Contacto</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@argomosaic.com"
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Texas Warehouse Logistics Address */}
          <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
            <span className="font-bold text-blue-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>Ubicación de Bodega y Centro de Distribución en Texas</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-stone-400 mb-1 font-semibold">Dirección de Bodega</label>
                <input
                  type="text"
                  value={formData.warehouseAddress}
                  onChange={(e) => setFormData({ ...formData, warehouseAddress: e.target.value })}
                  placeholder="11820 Regal Row, Suite 100"
                  className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Ciudad</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Dallas"
                  className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Código Postal (ZIP)</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="75247"
                  className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Horarios de Atención de la Bodega</span>
              </label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                placeholder="Monday - Friday: 7:30 AM - 5:00 PM CST | Saturday: 8:00 AM - 1:00 PM CST"
                className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-stone-300 font-bold">URL de Google Maps (Embed de la Bodega en Dallas)</label>
                <span className="text-[10px] text-blue-400 font-semibold">100% Editable y en tiempo real</span>
              </div>
              <input
                type="text"
                value={formData.googleMapsEmbedUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsEmbedUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono text-[11px] focus:border-blue-500"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Para obtener este enlace: Ve a Google Maps &gt; Busca la ubicación de tu bodega &gt; Haz clic en "Compartir" &gt; "Insertar un mapa" &gt; Copia el texto dentro de <code className="text-blue-300">src="..."</code>. Se actualiza al instante en la sección de Contacto.
              </p>
            </div>
          </div>

          {/* Corporate Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Descripción Corporativa (Español)</label>
              <textarea
                rows={3}
                value={formData.descriptionEs}
                onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                placeholder="Líder en importación y distribución comercial de porcelanatos arquitectónicos, duela vinílica de lujo (LVP), pisos y recubrimientos de primer nivel en Texas y Estados Unidos."
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Corporate Description (English)</label>
              <textarea
                rows={3}
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                placeholder="Leading importer and commercial distributor of premier architectural porcelain, tile, luxury vinyl plank (LVP), and surfaces across Texas and the United States."
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios de Empresa</span>
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB: PAYPAL SETTINGS */}
      {activeSubTab === 'paypal' && (
        <form onSubmit={handleSubmit} className="p-6 bg-stone-900 border border-stone-800 rounded-2xl space-y-5 text-xs shadow-xl">
          <div className="flex items-center gap-3 p-4 bg-blue-950/30 rounded-xl border border-blue-900/60">
            <div className="px-3 py-1 rounded bg-[#003087] text-white font-extrabold text-sm italic font-sans">
              PayPal
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Configuración de Integración PayPal</h3>
              <p className="text-stone-300 text-[11px]">
                Configura las credenciales de tu cuenta de PayPal para recibir pagos con tarjeta de débito/crédito y saldo PayPal.
              </p>
            </div>
          </div>

          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-4">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Entorno de Operación</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paypalMode"
                    value="sandbox"
                    checked={formData.paypalMode === 'sandbox'}
                    onChange={() => setFormData({ ...formData, paypalMode: 'sandbox' })}
                    className="text-blue-600"
                  />
                  <span className="font-semibold text-white">Sandbox (Pruebas sin cobro real)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paypalMode"
                    value="live"
                    checked={formData.paypalMode === 'live'}
                    onChange={() => setFormData({ ...formData, paypalMode: 'live' })}
                    className="text-blue-600"
                  />
                  <span className="font-semibold text-emerald-400">Live (Producción Comercial Real)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">PayPal Client ID</label>
              <input
                type="text"
                value={formData.paypalClientId}
                onChange={(e) => setFormData({ ...formData, paypalClientId: e.target.value })}
                placeholder="AbC..._client_id_from_developer_paypal"
                className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">PayPal Secret Key</label>
              <input
                type="password"
                value={formData.paypalSecretKey}
                onChange={(e) => setFormData({ ...formData, paypalSecretKey: e.target.value })}
                placeholder="Secret key for server authentication"
                className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                La clave secreta se utiliza exclusivamente del lado del servidor para validar órdenes. Nunca se expone en el cliente.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Credenciales PayPal</span>
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB: HOSTINGER EXPORT */}
      {activeSubTab === 'hostinger' && (
        <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl space-y-6 text-xs shadow-xl">
          <div className="flex items-center gap-3 p-4 bg-purple-950/30 rounded-xl border border-purple-900/60">
            <Server className="w-8 h-8 text-purple-400 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-white">Paquete de Producción Hostinger (PHP + MySQL + React)</h3>
              <p className="text-stone-300 text-xs mt-0.5">
                Genera y descarga un archivo ZIP con todos los archivos listos para subir a tu hosting Hostinger.
              </p>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-stone-950 rounded-xl border border-stone-800">
            <strong className="text-white block font-mono text-xs uppercase text-blue-400">
              Contenido del Paquete Listo para Despliegue:
            </strong>
            <ul className="list-disc list-inside space-y-1.5 text-stone-300">
              <li><strong>database.sql:</strong> Estructura completa de MySQL con tablas de productos, órdenes, cotizaciones, muestras y settings.</li>
              <li><strong>api/config.php:</strong> Conexión PDO a MySQL para hPanel de Hostinger.</li>
              <li><strong>api/*.php:</strong> Endpoints REST completos (productos, órdenes con validación, cotizaciones, subida de archivos, PayPal).</li>
              <li><strong>.htaccess:</strong> Reglas Apache para enrutamiento limpio de rutas React y API PHP.</li>
              <li><strong>INSTRUCCIONES_INSTALACION_HOSTINGER.md:</strong> Manual paso a paso para Hostinger.</li>
              <li><strong>database_export.json:</strong> Respaldo de los datos actuales de la aplicación.</li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={handleDownloadHostingerZip}
              disabled={downloadingZip}
              className="w-full sm:w-auto px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>{downloadingZip ? 'Comprimiendo y Generando ZIP...' : 'Descargar ZIP para Hostinger (Producción)'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
