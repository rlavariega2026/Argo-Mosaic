import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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

createRoot(document.getElementById('root')!).render(<App />);
