import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class AppErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ARGO MOSAIC rendering error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <section className="max-w-lg w-full rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
            <h1 className="text-xl font-bold mb-3">No se pudo mostrar esta pantalla</h1>
            <p className="text-sm text-slate-300 mb-6">La aplicación sigue disponible. Recarga para volver a intentarlo; si el problema continúa, revisa el último cambio guardado.</p>
            <button onClick={() => window.location.reload()} className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500">Recargar aplicación</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

// Register only this application's service worker under its subdirectory.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
    }).catch((err) => {
      console.error('ARGO MOSAIC service worker registration failed:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(<AppErrorBoundary><App /></AppErrorBoundary>);
