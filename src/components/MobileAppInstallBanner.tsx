import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download, Share2, PlusSquare, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface MobileAppInstallBannerProps {
  lang: Language;
}

export const MobileAppInstallBanner: React.FC<MobileAppInstallBannerProps> = ({ lang }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('argo_pwa_dismissed') === 'true';
  });
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (fullscreen app)
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isAppleDevice);

    // Capture Android / Chrome PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (isStandalone || dismissed) {
    return null; // Already running as a standalone full-screen app!
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDismissed(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('argo_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* Floating Bottom App Banner for Mobile Devices */}
      <aside aria-label="Instalar app móvil" className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-md border border-blue-200 text-slate-800 p-3.5 rounded-2xl shadow-2xl shadow-blue-900/15 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
              <span>{lang === 'es' ? 'Abrir como App Móvil' : 'Open as Fullscreen App'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold">PWA</span>
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {lang === 'es'
                ? 'Pantalla completa sin barra de navegador (iOS & Android)'
                : 'Fullscreen experience without browser bar'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Instalar' : 'Install'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* iOS Safari Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase font-mono text-blue-600 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>Instalar en iPhone / iPad (iOS)</span>
              </span>
              <button onClick={() => setShowIosGuide(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Para abrir <strong>ARGO MOSAIC</strong> en pantalla completa sin barra de navegación:
            </p>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">1</span>
                <span>Toca el botón <strong>Compartir</strong> en la barra inferior de Safari (ícono cuadrado con flecha <Share2 className="w-3.5 h-3.5 inline text-blue-600" />).</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">2</span>
                <span>Desliza hacia abajo y selecciona <strong>&quot;Agregar a pantalla de inicio&quot;</strong> (ícono <PlusSquare className="w-3.5 h-3.5 inline text-blue-600" />).</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">3</span>
                <span>Toca <strong>&quot;Agregar&quot;</strong> en la esquina superior derecha.</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              ¡Listo! Se creará el ícono oficial de ARGO MOSAIC y abrirá como App nativa en pantalla completa.
            </p>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
