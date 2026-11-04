import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, Globe, ShieldCheck } from 'lucide-react';

interface PublishHostingerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PUBLIC_APP_URL = 'https://lavdigitalagency.com/Argo-Mosaic/argomosaic';
const EDITOR_URL = 'https://lavdigitalagency.com/Argo-Mosaic/';

export const PublishHostingerModal: React.FC<PublishHostingerModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(PUBLIC_APP_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('No fue posible copiar el enlace. Puedes seleccionarlo y copiarlo manualmente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-stone-100 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Publicación de Argo Mosaic</h2>
              <span className="text-xs text-stone-400">Dirección pública y estado del despliegue</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-white bg-stone-800" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <section className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Dirección pública de la tienda</h3>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed">
            Este es el enlace que debes compartir con tus clientes. La tienda pública se sirve desde la carpeta de Argo Mosaic en tu hosting; no utiliza la página principal de lavdigitalagency.com.
          </p>
          <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 space-y-3">
            <span className="text-[10px] text-stone-400 uppercase block font-sans">Enlace público</span>
            <a href={PUBLIC_APP_URL} target="_blank" rel="noreferrer" className="text-blue-400 font-bold text-sm break-all hover:underline">
              {PUBLIC_APP_URL}
            </a>
            <div className="flex flex-wrap gap-2">
              <button onClick={copyPublicUrl} className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs flex items-center gap-2">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar enlace público'}</span>
              </button>
              <a href={PUBLIC_APP_URL} target="_blank" rel="noreferrer" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir tienda pública</span>
              </a>
            </div>
          </div>
          <div className="text-xs text-stone-400">
            <span className="text-stone-300 font-semibold">Editor:</span>{' '}
            <a href={EDITOR_URL} className="text-blue-400 hover:underline">{EDITOR_URL}</a>
          </div>
        </section>

        <section className="p-5 rounded-xl bg-blue-950/20 border border-blue-900/50 space-y-3">
          <h3 className="text-sm font-bold text-white">¿Cómo se actualiza la publicación?</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            La publicación real se realiza mediante el despliegue automático del proyecto desde GitHub hacia Hostinger. Cuando los cambios llegan a la rama <strong>main</strong>, GitHub Actions compila la aplicación y copia los archivos a la carpeta de Argo Mosaic en el dominio.
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-400">
            <li>Se guardan los cambios del proyecto en GitHub, en la rama <code>main</code>.</li>
            <li>El flujo de despliegue compila React y transfiere el paquete de producción a Hostinger.</li>
            <li>La publicación se considera actualizada cuando el flujo termina correctamente y la tienda pública responde en el enlace indicado.</li>
          </ol>
          <p className="text-xs text-stone-400 leading-relaxed">
            No vuelvas a subir un ZIP, crear otra base de datos ni importar <code>database.sql</code> para las actualizaciones normales. La base de datos existente se conserva.
          </p>
        </section>

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
