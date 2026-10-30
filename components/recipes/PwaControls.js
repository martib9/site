import { useEffect, useState } from 'react';
export default function PwaControls() {
  const [prompt, setPrompt] = useState(null), [installed, setInstalled] = useState(false), [offline, setOffline] = useState(false);
  useEffect(() => {
    setInstalled(matchMedia('(display-mode: standalone)').matches || Boolean(navigator.standalone));
    const available = event => { event.preventDefault(); setPrompt(event); };
    const done = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', available);
    window.addEventListener('appinstalled', done);
    let active = true;
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/recipes-sw.js', { scope: '/recipes' })
      .then(() => navigator.serviceWorker.ready).then(registration => {
        if (!active) return;
        const channel = new MessageChannel();
        channel.port1.onmessage = event => { if (active) setOffline(event.data?.ready === true); channel.port1.close(); };
        const assets = [...document.querySelectorAll('script[src],link[rel=stylesheet]')].map(el => el.src || el.href).concat(performance.getEntriesByType('resource').map(entry => entry.name));
        registration.active?.postMessage({ type: 'PRELOAD_RECIPES', assets }, [channel.port2]);
      }).catch(() => {});
    return () => { active = false; window.removeEventListener('beforeinstallprompt', available); window.removeEventListener('appinstalled', done); };
  }, []);
  return <div className="recipe-pwa-controls">
    {installed ? <p>Installed as an app</p> : prompt ? <button type="button" onClick={async () => { await prompt.prompt(); await prompt.userChoice; setPrompt(null); }}>Install Recipes</button> : <details><summary>Install Recipes</summary><p>On iPhone or iPad: Share → Add to Home Screen. On Android or desktop: use your browser’s Install app option.</p></details>}
    <small>{offline ? 'Ready for offline use on this device' : 'Offline pages prepare while connected'}</small>
  </div>;
}
