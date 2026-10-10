/** Keep the library's DOM texture aligned with our native scrolling viewport.
 * html-to-image does not preserve scrollTop. Capture only visible, bounded
 * blocks and composite them at their actual viewport positions instead.
 */
export function attachScrollingCapture(instance, main) {
  if (!main) return () => {};
  const capture = instance.capture;
  const original = capture.captureElement.bind(capture);
  let active = true, busy = false, pending = false;
  const refresh = async () => {
    if (!active) return;
    if (busy) { pending = true; return; }
    busy = true;
    try {
      const bounds = main.getBoundingClientRect();
      const dpr = capture.dpr;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bounds.width * dpr);
      canvas.height = Math.round(bounds.height * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx || !canvas.width || !canvas.height) return;
      ctx.scale(dpr, dpr);
      const blocks = [];
      const visit = (el, depth = 0) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height || rect.bottom < bounds.top || rect.top > bounds.bottom) return;
        if (depth < 8 && el.children.length && (rect.height > bounds.height || el.matches('.meal-list, .week-columns, .meal-section'))) {
          for (const child of el.children) visit(child, depth + 1);
        } else if (blocks.length < 40 && rect.height < bounds.height * 2) blocks.push(el);
      };
      for (const child of main.children) visit(child);
      for (const el of blocks) {
        if (!active) return;
        const rect = el.getBoundingClientRect();
        const image = await capture.captureToCanvas(el, rect.width, rect.height);
        if (image) ctx.drawImage(image, rect.left - bounds.left, rect.top - bounds.top, rect.width, rect.height);
      }
      if (active) {
        capture.cache.set(main, { canvas, w: canvas.width, h: canvas.height });
        instance.markChanged();
      }
    } catch (error) {
      // Keep navigation usable even if a particular DOM snapshot cannot render.
      console.warn('Recipe glass snapshot skipped.', error);
    } finally {
      busy = false;
      if (pending && active) { pending = false; refresh(); }
    }
  };
  capture.captureElement = (el, force) => el === main ? (force ? refresh() : Promise.resolve()) : original(el, force);
  refresh();
  return () => { active = false; };
}
