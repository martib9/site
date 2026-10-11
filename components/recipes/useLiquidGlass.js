import { useEffect } from 'react';
import { attachScrollingCapture } from './glassCapture';

let initialization = Promise.resolve();

// The pinned library's own renderer, with CSS glass while loading / without WebGL.
export function useLiquidGlass(rootRef, page) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let instance, detachCapture, disposed = false, timer, generation = 0;
    const preference = matchMedia('(prefers-reduced-motion: reduce), (prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)');
    const stop = () => {
      generation++;
      root.removeAttribute('data-glass-ready');
      detachCapture?.();
      instance?.destroy();
      instance = null;
    };
    const start = () => {
      stop();
      if (preference.matches || document.hidden) return;
      const current = generation;
      initialization = initialization.then(async () => {
        try {
          if (disposed || current !== generation) return;
          await document.fonts.ready;
          const { LiquidGlass } = await import('@ybouane/liquidglass');
          if (disposed || current !== generation) return;
          const glassElements = [...root.children].filter(el => el.classList.contains('liquid-glass'));
          for (const el of glassElements) el.dataset.config = JSON.stringify({
            cornerRadius: parseFloat(getComputedStyle(el).borderTopLeftRadius),
            zRadius: 12, refraction: .55, chromAberration: .012,
            blurAmount: .38, opacity: el.classList.contains('recipes-nav') ? .7 : .88, edgeHighlight: .07, specular: .12,
            fresnel: .7, shadowOpacity: .12,
            brightness: document.documentElement.dataset.recipeTheme === 'dark' ? -.16 : -.035,
          });
          const next = await LiquidGlass.init({ root, glassElements });
          if (disposed || current !== generation) { next.destroy(); return; }
          instance = next;
          root.style.userSelect = "";
          root.style.webkitUserSelect = "";
          detachCapture = attachScrollingCapture(next, root.querySelector('.recipes-main'));
          root.setAttribute('data-glass-ready', 'true');
        } catch (error) {
          // An unavailable GPU must never prevent recipe navigation.
          if (current === generation) stop();
          console.warn('Recipe glass unavailable; using translucent CSS surfaces.', error);
        }
      });
    };
    const refresh = () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        if (!instance) return;
        // markChanged schedules shaders; captureElement(force) refreshes cached DOM.
        // The capture object is exposed by the pinned 1.0.3 library.
        if (content) instance.capture.captureElement(content, true);
        instance.markChanged();
      }, 140);
    };
    const content = root.querySelector('.recipes-main');
    const changes = new MutationObserver(refresh);
    if (content) changes.observe(content, { childList: true, subtree: true, characterData: true, attributes: true });
    const theme = new MutationObserver(start);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-recipe-theme'] });
    root.addEventListener('scroll', refresh, true);
    root.addEventListener('animationend', refresh);
    window.addEventListener('resize', refresh);
    root.addEventListener('input', refresh);
    root.addEventListener('change', refresh);
    preference.addEventListener('change', start);
    document.addEventListener('visibilitychange', start);
    start();
    return () => {
      disposed = true; clearTimeout(timer); stop(); changes.disconnect(); theme.disconnect();
      root.removeEventListener('scroll', refresh, true);
      root.removeEventListener('animationend', refresh);
      window.removeEventListener('resize', refresh);
      root.removeEventListener('input', refresh); root.removeEventListener('change', refresh);
      preference.removeEventListener('change', start); document.removeEventListener('visibilitychange', start);
    };
  }, [rootRef, page]);
}
