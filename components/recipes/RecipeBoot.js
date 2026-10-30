import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
let warming;
export function useRecipeBoot() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    warming ||= Promise.allSettled([
      ...['/recipes', '/recipes/box', '/recipes/basket', '/recipes/add', '/recipes/view'].map(path => router.prefetch(path)),
      import('@ybouane/liquidglass'), document.fonts.ready,
      new Promise(resolve => { const image = new Image(); image.onload = image.onerror = resolve; image.src = '/recipes/icon-192.png'; }),
    ]);
    // Asset failures or a stalled network must not trap a usable cached app.
    const timeout = setTimeout(() => { if (active) setReady(true); }, 5000);
    warming.then(() => { if (active) { clearTimeout(timeout); setReady(true); } });
    return () => { active = false; clearTimeout(timeout); };
  }, [router]);
  return ready;
}
export default function RecipeBoot({ error, retry }) {
  return <div className="recipe-boot" role="status" aria-live="polite">
    <div className="recipe-boot-glass"><img src="/recipes/icon-192.png" alt="" width="64" height="64" />
      <h1>{error ? 'Your kitchen is taking a moment' : 'Getting your kitchen ready'}</h1>
      <p>{error || 'Preparing your recipes, week and basket…'}</p>
      {!error && <div className="recipe-boot-track" aria-hidden="true"><span /></div>}
      {error && <button type="button" onClick={retry}>Try again</button>}
    </div>
  </div>;
}
