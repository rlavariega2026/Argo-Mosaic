import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  ArrowLeft, 
  ShoppingCart, 
  FileText, 
  Box, 
  Download, 
  Share2, 
  Layers, 
  Play, 
  Eye, 
  ExternalLink, 
  Check, 
  Copy, 
  QrCode as QrIcon, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  MessageCircle,
  Mail,
  Truck,
  Sparkles,
  Maximize2,
  Maximize,
  Minimize,
  ShieldCheck,
  Shield,
  Printer,
  Snowflake,
  Droplets,
  Droplet,
  Footprints,
  Home,
  Building2,
  Sun,
  LayoutGrid,
  Scale,
  Ruler,
  Boxes,
  Palette,
  Component
} from 'lucide-react';
import { Product, Language, GalleryItem } from '../types';
import { translations } from '../i18n';
import { generateProductTechSheetPdf } from '../utils/pdfGenerator';

interface ProductDetailProps {
  product: Product;
  lang: Language;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, unitType: 'box' | 'sqft') => void;
  onRequestSample: (product: Product) => void;
  onRequestQuote: (product: Product, quantityBoxes?: number) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  lang,
  onBack,
  onAddToCart,
  onRequestSample,
  onRequestQuote,
  isCompared,
  onToggleCompare,
}) => {
  const t = translations[lang];

  // Images setup
  const galleryItems: GalleryItem[] = (product.gallery && product.gallery.length > 0)
    ? product.gallery
    : [{ id: 'main', url: product.primaryImage, title: 'Primary Image', type: 'main' }];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Order calculator state
  const [orderUnit, setOrderUnit] = useState<'box' | 'sqft'>('box');
  const [quantity, setQuantity] = useState<number>(10);

  // Conversion calculations
  const sqFtPerBox = product.packaging?.sqFtPerBox || 16.0;
  const pricePerBox = product.pricePerBox || ((product.pricePerSqFt || product.price) * sqFtPerBox);
  const pricePerSqFt = product.pricePerSqFt || (product.pricePerBox ? product.pricePerBox / sqFtPerBox : product.price);

  const calculatedBoxes = orderUnit === 'box' ? quantity : Math.ceil(quantity / sqFtPerBox);
  const calculatedSqFt = orderUnit === 'sqft' ? quantity : Number((quantity * sqFtPerBox).toFixed(2));
  const calculatedTotal = Number((orderUnit === 'box' ? calculatedBoxes * pricePerBox : calculatedSqFt * pricePerSqFt).toFixed(2));

  // Current image
  const currentImage = galleryItems[activeImageIndex] || galleryItems[0];
  const title = lang === 'es' ? (product.nameEs || product.nameEn) : product.nameEn;
  const description = lang === 'es' ? (product.descriptionEs || product.descriptionEn) : product.descriptionEn;

  // Fullscreen state & handler for mobile & web
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(prev => !prev);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Sync dynamic document title and social meta tags for WhatsApp
  useEffect(() => {
    const pageTitle = `${title} - ARGO MOSAIC Texas`;
    document.title = pageTitle;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && product.primaryImage) ogImage.setAttribute('content', product.primaryImage);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) ogDesc.setAttribute('content', description.slice(0, 160));
  }, [title, description, product.primaryImage]);

  // Open QR modal
  const handleOpenQr = async () => {
    try {
      const url = `${window.location.origin}/?product=${product.id}`;
      const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 });
      setQrDataUrl(dataUrl);
      setQrModalOpen(true);
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/?product=${product.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const shareUrl = `${window.location.origin}/?product=${product.id}`;
    const text = `*ARGO MOSAIC* — Catálogo Comercial Texas\n\n📌 *${title}*\n• Modelo: ${product.model || product.sku}\n• Dimensiones: ${product.size || 'N/A'}\n• Precio Sq Ft: $${pricePerSqFt.toFixed(2)} USD\n\n🔗 *Ver publicación en pantalla completa:*\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = () => {
    const shareUrl = `${window.location.origin}/?product=${product.id}`;
    const subject = encodeURIComponent(`${title} - ARGO MOSAIC`);
    const body = encodeURIComponent(`Hola,\n\nTe comparto este modelo de pisos y revestimientos de ARGO MOSAIC:\n${shareUrl}\n\nDimensiones: ${product.size || 'N/A'}\nPrecio: $${pricePerSqFt.toFixed(2)}/sq ft`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };
  const embedVideoUrl = getYouTubeEmbedUrl(product.youtubeVideoUrl);

  return (
    <article className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-4 shadow-xs sticky top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3.5 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>{lang === 'es' ? 'Volver al Catálogo' : 'Back to Catalog'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-blue-900">ARGO MOSAIC</span>
            <span>/</span>
            <span className="text-blue-600 font-bold">{product.category}</span>
            <span>/</span>
            <span className="text-slate-800 font-mono">{product.model || product.sku}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Pantalla Completa Button */}
            <button
              onClick={handleToggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-xs transition"
              title={isFullscreen ? (lang === 'es' ? 'Salir de Pantalla Completa' : 'Exit Fullscreen') : (lang === 'es' ? 'Ver en Pantalla Completa' : 'View Fullscreen')}
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-blue-600" /> : <Maximize className="w-4 h-4 text-blue-600" />}
              <span className="hidden sm:inline">{isFullscreen ? (lang === 'es' ? 'Salir Pantalla Completa' : 'Exit Fullscreen') : (lang === 'es' ? 'Pantalla Completa' : 'Fullscreen')}</span>
              <span className="sm:hidden">{lang === 'es' ? 'Completa' : 'Full'}</span>
            </button>

            {/* Compare Toggle */}
            <button
              onClick={() => onToggleCompare(product)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition ${
                isCompared
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{isCompared ? (lang === 'es' ? 'En Comparador' : 'In Comparison') : t.compare}</span>
            </button>

            {/* QR Code */}
            <button
              onClick={handleOpenQr}
              className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-xs transition"
              title="Generar Código QR"
            >
              <QrIcon className="w-4 h-4 text-blue-600" />
            </button>

            {/* Download Tech Sheet PDF */}
            <button
              onClick={() => generateProductTechSheetPdf(product, lang)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'es' ? 'Ficha PDF' : 'Tech Sheet PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Presentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* LEFT: Premium Architectural Gallery (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image Showcase */}
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-blue-900/5 group">
              <img
                src={currentImage?.url}
                alt={currentImage?.title || title}
                className={`w-full h-full object-cover transition-transform duration-500 cursor-zoom-in ${
                  zoomActive ? 'scale-150' : 'group-hover:scale-105'
                }`}
                onClick={() => setLightboxOpen(true)}
              />

              {/* Top Image Overlay Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                {product.badge && product.badge !== 'none' && (
                  <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg bg-blue-600 text-white shadow-md">
                    {product.badge}
                  </span>
                )}

                <div className="flex items-center gap-2 pointer-events-auto ml-auto">
                  {embedVideoUrl && (
                    <button
                      onClick={() => setVideoModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-red-600 hover:text-white text-slate-800 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-slate-200 shadow-md transition"
                    >
                      <Play className="w-3.5 h-3.5 text-red-600 group-hover:text-white" />
                      <span>{t.watchVideo}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="p-2 rounded-lg bg-white/90 hover:bg-slate-100 text-slate-700 backdrop-blur-md border border-slate-200 shadow-md transition"
                    title={lang === 'es' ? 'Ver pantalla completa' : 'View Fullscreen'}
                  >
                    <ZoomIn className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <span className="text-[11px] font-bold text-white bg-slate-900/80 px-2.5 py-1 rounded-md backdrop-blur-md">
                  {currentImage?.type ? currentImage.type.toUpperCase() : 'SURFACE DETAIL'}
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {galleryItems.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {galleryItems.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105'
                        : 'border-slate-200 hover:border-blue-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Virtual Tour & Specs Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {product.documents?.tour360Url && (
                <a
                  href={product.documents.tour360Url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 transition"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>{t.view360}</span>
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                </a>
              )}

              {product.documents?.catalogWebLink && (
                <a
                  href={product.documents.catalogWebLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition shadow-xs"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'es' ? 'Catálogo Digital' : 'Digital Catalog'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>

            {/* Social Share Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>{t.shareProduct}:</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleShareEmail}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Email</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copiedLink ? (lang === 'es' ? '¡Copiado!' : 'Copied!') : (lang === 'es' ? 'Copiar Enlace' : 'Copy Link')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Commercial Details, Price Breakdown & Order Box (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div className="space-y-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-extrabold uppercase">
                  {product.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-mono text-[11px]">MODEL: <strong className="text-slate-800">{product.model || 'N/A'}</strong></span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-mono text-[11px]">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{product.availability || 'In Stock (Dallas Warehouse)'}</span>
                </span>
                {product.size && (
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {product.size}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                {description}
              </p>
            </div>

            {/* Pricing Matrix Card */}
            <div className="p-6 rounded-2xl bg-white border-2 border-blue-100 space-y-5 shadow-xl shadow-blue-900/5">
              <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">
                    {t.pricePerSqFt}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                      ${pricePerSqFt.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">/ sq ft</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">
                    {t.pricePerBox}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5 justify-end">
                    <span className="text-2xl font-bold text-slate-800">
                      ${pricePerBox.toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-slate-500">/ box</span>
                  </div>
                  <span className="text-[11px] text-blue-600 font-bold block">
                    ({sqFtPerBox} sq ft / box)
                  </span>
                </div>
              </div>

              {/* Real-time Order Quantity Calculator */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">{lang === 'es' ? 'Calcular por:' : 'Calculate order by:'}</span>
                  <div className="flex bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                    <button
                      onClick={() => setOrderUnit('box')}
                      className={`px-3 py-1 rounded-lg text-xs transition ${
                        orderUnit === 'box' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t.boxes}
                    </button>
                    <button
                      onClick={() => setOrderUnit('sqft')}
                      className={`px-3 py-1 rounded-lg text-xs transition ${
                        orderUnit === 'sqft' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t.sqFt}
                    </button>
                  </div>
                </div>

                {/* Input and Stepper */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center bg-slate-50 border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="px-3.5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-center bg-transparent text-slate-900 font-extrabold text-base focus:outline-hidden"
                    />
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3.5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs font-bold text-slate-600 uppercase">
                    {orderUnit === 'box' ? t.boxes : t.sqFt}
                  </span>
                </div>

                {/* Calculation Summary Bar */}
                <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>{lang === 'es' ? 'Equivalencia:' : 'Coverage:'}</span>
                    <span className="text-slate-900 font-bold">
                      {calculatedBoxes} {t.boxes} = {calculatedSqFt} sq ft
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1 border-t border-blue-200/60 font-semibold">
                    <span>{lang === 'es' ? 'Subtotal estimado:' : 'Estimated Subtotal:'}</span>
                    <span className="text-blue-700 font-extrabold text-sm">
                      ${calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </span>
                  </div>
                </div>

                {/* Commercial CTA Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => onAddToCart(product, calculatedBoxes, 'box')}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition active:scale-98"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t.addToCart} ({calculatedBoxes} {t.boxes})</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onRequestQuote(product, calculatedBoxes)}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t.requestQuote}</span>
                    </button>

                    <button
                      onClick={() => onRequestSample(product)}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <Box className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t.requestSample}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Texas Logistics Notice */}
            <div className="p-4 rounded-2xl bg-white border border-blue-200 flex items-start gap-3 text-xs shadow-xs">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5 font-bold">
                  {lang === 'es' ? 'Recolección en Dallas o Flete a Todo Texas' : 'Dallas Warehouse Pickup or Texas Freight'}
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  {lang === 'es'
                    ? 'Disponible para entrega inmediata desde bodega Dallas, TX (recolección sin costo) o flete comercial a pie de obra.'
                    : 'Available for immediate warehouse pickup in Dallas, TX or commercial jobsite freight across Texas.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: TECHNICAL SPECIFICATIONS */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="max-w-5xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                US Architectural Standards & Lab Data
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {t.techSpecsTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'es'
                  ? 'Especificaciones técnicas verificadas para proyectos comerciales y residenciales en Estados Unidos.'
                  : 'Verified technical specifications and lab-tested metrics for commercial and luxury residential applications.'}
              </p>
            </div>

            {/* Specifications Matrix Table with Dedicated Icons and Dynamic Variations */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm">
              {(() => {
                // Extract variation level for dynamic icon
                const extractVariationLevel = (text?: string, fallback?: string): 1 | 2 | 3 | 4 => {
                  const combined = `${text || ''} ${fallback || ''}`;
                  const match = combined.match(/(?:V|v)\s*([1-4])/) || combined.match(/\b([1-4])\b/);
                  if (match) {
                    const num = parseInt(match[1], 10);
                    if (num >= 1 && num <= 4) return num as 1 | 2 | 3 | 4;
                  }
                  return 4;
                };

                const shadeTier = extractVariationLevel(product.specs.shadeVariation);
                const randomFacesTier = extractVariationLevel(product.specs.randomFaces, product.specs.shadeVariation);

                // Dynamic monochrome (blanco y negro) icon specifically for Caras Aleatorias
                const renderRandomFacesMonochromeIcon = (level: 1 | 2 | 3 | 4) => {
                  const palettes = {
                    1: ['#1e293b', '#1e293b', '#1e293b', '#1e293b'],
                    2: ['#0f172a', '#64748b', '#0f172a', '#64748b'],
                    3: ['#000000', '#475569', '#94a3b8', '#0f172a'],
                    4: ['#000000', '#334155', '#94a3b8', '#ffffff'],
                  };
                  const colors = palettes[level] || palettes[4];

                  return (
                    <div 
                      className="w-5 h-5 rounded-xs p-0.5 bg-white border border-slate-400 grid grid-cols-2 gap-0.5 shadow-2xs" 
                      title="Caras Aleatorias (Blanco y Negro)"
                    >
                      <span className="rounded-3xs border border-slate-300/40" style={{ backgroundColor: colors[0] }} />
                      <span className="rounded-3xs border border-slate-300/40" style={{ backgroundColor: colors[1] }} />
                      <span className="rounded-3xs border border-slate-300/40" style={{ backgroundColor: colors[2] }} />
                      <span className="rounded-3xs border border-slate-300/40" style={{ backgroundColor: colors[3] }} />
                    </div>
                  );
                };

                // Specialized PEI Icon with "PEI" lettering inside the shield
                const renderPeiIcon = () => (
                  <div className="relative w-5 h-5 flex items-center justify-center select-none" title="Clasificación PEI">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600 fill-blue-50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <text 
                        x="12" 
                        y="14.2" 
                        textAnchor="middle" 
                        fill="#1d4ed8" 
                        fontSize="7" 
                        fontWeight="900" 
                        fontFamily="system-ui, -apple-system, sans-serif" 
                        stroke="none"
                        letterSpacing="-0.5px"
                      >
                        PEI
                      </text>
                    </svg>
                  </div>
                );

                const specRows = [
                  {
                    icon: <Component className="w-4 h-4 text-blue-600" />,
                    label: t.material,
                    value: product.specs.material,
                  },
                  {
                    icon: <Maximize2 className="w-4 h-4 text-blue-600" />,
                    label: t.edgeType,
                    value: product.specs.edgeType,
                  },
                  {
                    icon: <Sparkles className="w-4 h-4 text-blue-600" />,
                    label: t.finish,
                    value: product.specs.finish,
                  },
                  {
                    icon: <Palette className="w-4 h-4 text-blue-600" />,
                    label: t.shadeVariation,
                    value: product.specs.shadeVariation,
                  },
                  {
                    icon: renderRandomFacesMonochromeIcon(randomFacesTier),
                    label: t.randomFaces,
                    value: product.specs.randomFaces,
                    isVariation: true,
                    tier: randomFacesTier,
                  },
                  {
                    icon: renderPeiIcon(),
                    label: t.peiRating,
                    value: product.specs.peiRating,
                  },
                  {
                    icon: <Printer className="w-4 h-4 text-blue-600" />,
                    label: t.printingTechnology,
                    value: product.specs.printingTechnology,
                  },
                  {
                    icon: <Snowflake className="w-4 h-4 text-blue-600" />,
                    label: t.frostResistant,
                    value: product.specs.frostResistant,
                  },
                  {
                    icon: <Droplets className="w-4 h-4 text-blue-600" />,
                    label: t.waterResistant,
                    value: product.specs.waterResistant,
                  },
                  {
                    icon: <Droplet className="w-4 h-4 text-blue-600" />,
                    label: t.waterAbsorption,
                    value: product.specs.waterAbsorption,
                  },
                  {
                    icon: <Shield className="w-4 h-4 text-blue-600" />,
                    label: t.wearResistance,
                    value: product.specs.wearResistance,
                  },
                  {
                    icon: <Footprints className="w-4 h-4 text-blue-600" />,
                    label: t.slipResistance,
                    value: product.specs.slipResistance,
                  },
                  {
                    icon: <Home className="w-4 h-4 text-blue-600" />,
                    label: t.residentialUse,
                    value: product.specs.residentialUse,
                  },
                  {
                    icon: <Building2 className="w-4 h-4 text-blue-600" />,
                    label: t.commercialUse,
                    value: product.specs.commercialUse,
                  },
                  {
                    icon: <Home className="w-4 h-4 text-blue-600" />,
                    label: t.indoorApplication,
                    value: product.specs.indoorApplication,
                  },
                  {
                    icon: <Sun className="w-4 h-4 text-blue-600" />,
                    label: t.outdoorApplication,
                    value: product.specs.outdoorApplication,
                  },
                  {
                    icon: <LayoutGrid className="w-4 h-4 text-blue-600" />,
                    label: t.wallApplication,
                    value: product.specs.wallApplication,
                  },
                  {
                    icon: <Footprints className="w-4 h-4 text-blue-600" />,
                    label: t.floorApplication,
                    value: product.specs.floorApplication,
                  },
                ];

                return (
                  <>
                    {specRows
                      .filter(item => item.value)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 text-xs hover:bg-blue-50/40 transition gap-2"
                        >
                          <div className="flex items-center gap-3 sm:w-1/2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-200/60 flex items-center justify-center shrink-0">
                              {item.icon}
                            </div>
                            <span className="font-bold text-slate-700 tracking-wide">
                              {item.label}
                            </span>
                          </div>

                          <div className="sm:w-1/2 flex items-center justify-start sm:justify-end gap-2 pl-11 sm:pl-0">
                            <span className="font-semibold text-slate-900 leading-relaxed text-right">
                              {item.value}
                            </span>
                          </div>
                        </div>
                      ))}

                    {/* Custom Specs if any */}
                    {product.specs.customSpecs?.map((cs, idx) => (
                      <div
                        key={`cs-${idx}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 text-xs hover:bg-blue-50/40 transition gap-2"
                      >
                        <div className="flex items-center gap-3 sm:w-1/2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-200/60 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-bold text-slate-700 tracking-wide">
                            {lang === 'es' ? cs.labelEs : cs.labelEn}
                          </span>
                        </div>
                        <div className="sm:w-1/2 flex items-center justify-start sm:justify-end pl-11 sm:pl-0">
                          <span className="font-semibold text-slate-900 text-right">{cs.value}</span>
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* SECTION 5: PACKAGING AND LOGISTICS */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                US Standard Measures & Freight
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {t.packagingTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'es'
                  ? 'Medidas en pulgadas, pies cuadrados y libras para logística en Estados Unidos.'
                  : 'Standard US measurements (inches, sq ft, lbs) for streamlined freight and warehousing.'}
              </p>
            </div>

            {/* Two Column Layout: Box Information vs Pallet Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box Information */}
              <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm hover:border-blue-200 transition">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl flex items-center justify-center shadow-2xs">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      {t.boxInformation}
                    </h3>
                    <p className="text-[11px] text-slate-500">Unidad de despacho y venta minorista</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs divide-y divide-slate-100">
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                        <Boxes className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{t.piecesPerBox}</span>
                    </div>
                    <strong className="text-slate-900 font-extrabold">{product.packaging.piecesPerBox ?? '—'} pcs</strong>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{t.sqFtPerBox}</span>
                    </div>
                    <strong className="text-slate-900 font-extrabold">{product.packaging.sqFtPerBox ?? '—'} sq ft</strong>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                        <Scale className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{t.weightLbsPerBox}</span>
                    </div>
                    <strong className="text-slate-900 font-extrabold">{product.packaging.weightLbsPerBox ?? '—'} lbs</strong>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                        <Ruler className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{t.boxDimensions}</span>
                    </div>
                    <strong className="text-slate-900 font-extrabold">{product.packaging.boxDimensions ?? '—'}</strong>
                  </div>
                </div>
              </div>

              {/* Pallet Information */}
              <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm hover:border-blue-200 transition">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl flex items-center justify-center shadow-2xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      {t.palletInformation}
                    </h3>
                    <p className="text-[11px] text-slate-500">Unidad logística para transporte y mayoreo</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs divide-y divide-slate-100">
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{t.piecesPerPallet}</span>
                    </div>
                    <strong className="text-slate-900 font-extrabold">{product.packaging.piecesPerPallet ?? '—'} boxes</strong>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{t.sqFtPerPallet}</span>
                    </div>
                    <strong className="text-slate-900 font-extrabold">{product.packaging.sqFtPerPallet ?? '—'} sq ft</strong>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                        <Scale className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{t.weightLbsPerPallet}</span>
                    </div>
                    <strong className="text-slate-900 font-extrabold">{product.packaging.weightLbsPerPallet ?? '—'} lbs</strong>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                        <Ruler className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{t.palletDimensions}</span>
                    </div>
                    <strong className="text-slate-900 font-extrabold">{product.packaging.palletDimensions ?? '—'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-3 max-w-7xl mx-auto w-full">
            <span className="text-sm font-bold">{title} ({activeImageIndex + 1}/{galleryItems.length})</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoomActive(!zoomActive)}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-300"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg text-white font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <img
              src={currentImage?.url}
              alt={title}
              className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                zoomActive ? 'scale-150 cursor-grab' : 'scale-100'
              }`}
            />
          </div>

          {galleryItems.length > 1 && (
            <div className="flex justify-center gap-2 pt-3 overflow-x-auto max-w-2xl mx-auto">
              {galleryItems.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 rounded border transition ${
                    activeImageIndex === idx ? 'border-blue-500 scale-105' : 'border-slate-700 opacity-60'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* YOUTUBE VIDEO MODAL */}
      {videoModalOpen && embedVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 bg-slate-900/80 text-white rounded-full hover:bg-red-600 transition"
            >
              ✕
            </button>
            <iframe
              src={embedVideoUrl}
              title="Product Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* QR CODE MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <QrIcon className="w-4 h-4 text-blue-600" />
                <span>{lang === 'es' ? 'Código QR del Producto' : 'Product QR Code'}</span>
              </span>
              <button onClick={() => setQrModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl inline-block shadow-inner mx-auto border border-slate-200">
              <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
              <p className="text-xs text-blue-600 font-mono font-bold">SKU: {product.sku}</p>
              <p className="text-xs text-slate-500 pt-1 leading-relaxed">
                {lang === 'es'
                  ? 'Escanea con tu teléfono para acceder a la ficha digital en obra o tienda.'
                  : 'Scan with your smartphone to view digital specifications on jobsite.'}
              </p>
            </div>

            <button
              onClick={() => {
                const link = document.createElement('a');
                link.download = `${product.sku}-qr-code.png`;
                link.href = qrDataUrl;
                link.click();
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/20"
            >
              {lang === 'es' ? 'Descargar Imagen QR' : 'Download QR Image'}
            </button>
          </div>
        </div>
      )}

      {/* MOBILE FULLSCREEN FLOATING BAR */}
      {!isFullscreen && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden animate-in fade-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-blue-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                <Maximize className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight truncate">
                <p className="text-xs font-black truncate">{title}</p>
                <p className="text-[10px] text-blue-300 font-semibold">{lang === 'es' ? 'Abrir publicación en pantalla completa' : 'Open in fullscreen app mode'}</p>
              </div>
            </div>
            <button
              onClick={handleToggleFullscreen}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shrink-0 shadow-md shadow-blue-500/40 transition active:scale-95"
            >
              {lang === 'es' ? 'Ver Completa' : 'Fullscreen'}
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
