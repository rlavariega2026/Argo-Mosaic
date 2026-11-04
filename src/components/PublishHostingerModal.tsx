import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  Globe, 
  Database, 
  FileCode, 
  Copy, 
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PublishHostingerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishHostingerModal: React.FC<PublishHostingerModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedShared, setCopiedShared] = useState(false);

  if (!isOpen) return null;

  const currentDevUrl = window.location.origin;
  const sharedUrl = window.location.origin.replace('-dev-', '-pre-');

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/hostinger-export');
      if (!res.ok) throw new Error('Error al generar el ZIP');
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
      console.error(err);
      alert('Error descargando el paquete. Por favor intenta de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = (text: string, isShared: boolean) => {
    navigator.clipboard.writeText(text);
    if (isShared) {
      setCopiedShared(true);
      setTimeout(() => setCopiedShared(false), 2000);
    } else {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-stone-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>¿Dónde ver el resultado y cómo publicar?</span>
              </h2>
              <span className="text-xs text-stone-400">
                Opciones para ver tu sitio en vivo y publicarlo en tu dominio propio
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-white bg-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: Live Cloud Preview (Working Right Now) */}
        <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Opción 1: Tu Aplicación Ya Está Publicada y Activa en Vivo</span>
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Esta plataforma ya está en línea y funcionando con servidor Express, base de datos persistente, catálogo, pasarela de pago y panel de administración en la siguiente dirección:
          </p>

          <div className="space-y-2 pt-1 font-mono text-xs">
            {/* Dev URL */}
            <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex items-center justify-between gap-3">
              <div className="truncate">
                <span className="text-[10px] text-stone-400 uppercase block font-sans">Enlace de tu aplicación:</span>
                <span className="text-blue-400 font-bold select-all truncate block">{currentDevUrl}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyToClipboard(currentDevUrl, false)}
                  className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs flex items-center gap-1"
                >
                  {copiedDev ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDev ? 'Copiado' : 'Copiar'}</span>
                </button>
                <a
                  href={currentDevUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Option 2: Hostinger Deployment Package (Download ZIP) */}
        <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-900/60 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Opción 2: Publicar en tu Hosting de Hostinger (Dominio propio)
            </h3>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Tal como solicitaste, preparamos un paquete completo de producción con <strong>Frontend React compilado + Backend PHP REST + Base de datos MySQL + Reglas .htaccess</strong> listo para subir a Hostinger con 1 clic:
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-400 bg-stone-950 p-3 rounded-lg border border-stone-800">
            <div>✓ index.html y assets compilados</div>
            <div>✓ database.sql (MySQL 8.0+)</div>
            <div>✓ api/config.php y endpoints PHP</div>
            <div>✓ Reglas .htaccess para Hostinger</div>
            <div>✓ Integración real con PayPal</div>
            <div>✓ Guía paso a paso de instalación</div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Generando archivo ZIP...' : 'Descargar ZIP Completo para Hostinger (Producción)'}</span>
            </button>
          </div>

          {/* 3 Step Installation Summary */}
          <div className="pt-2 border-t border-purple-900/40 text-xs space-y-1.5 text-stone-300">
            <strong className="text-purple-300 block text-[11px] uppercase font-mono">
              Cómo instalarlo en Hostinger en 3 sencillos pasos:
            </strong>
            <ol className="list-decimal list-inside space-y-1 text-stone-400 text-[11px]">
              <li>Entra a tu <strong>hPanel de Hostinger</strong> y sube el contenido del ZIP a la carpeta <code>public_html</code>.</li>
              <li>Crea una base de datos MySQL en Hostinger e importa el archivo <code>database.sql</code> en <strong>phpMyAdmin</strong>.</li>
              <li>Abre <code>api/config.php</code> y coloca el nombre de tu base de datos y contraseña. ¡Listo!</li>
            </ol>
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold"
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
