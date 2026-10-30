const CACHE = "martib-recipes-v3";
self.addEventListener("install", (event) =>
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(["/recipes/offline.html", "/recipes/manifest.webmanifest", "/recipes/icon-192.png", "/recipes/icon-512.png"])),
  ),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("martib-recipes-") && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin)
    return;
  if (url.pathname.startsWith("/api/") || url.pathname === "/recipes/login")
    return;
  if (/^\/_next\/data\/[^/]+\/recipes(?:\/(?:box|basket|add))?\.json$/.test(url.pathname)) {
    event.respondWith(fetch(event.request).then(async response => {
      if (response.ok) {
        const data = await response.clone().json();
        if (!data.pageProps?.__N_REDIRECT) {
          const cache = await caches.open(CACHE);
          await cache.put(event.request, response.clone());
        }
      }
      return response;
    }).catch(async () => (await caches.match(event.request)) || Response.error()));
    return;
  }
  if (
    event.request.mode === "navigate" &&
    (url.pathname === "/recipes" || url.pathname.startsWith("/recipes/"))
  ) {
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          if (response.ok && !response.redirected) {
            const c = await caches.open(CACHE);
            await c.put(event.request, response.clone());
          }
          return response;
        })
        .catch(
          async () =>
            (await caches.match(event.request)) ||
            (await caches.match("/recipes/offline.html")),
        ),
    );
    return;
  }
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/recipes/icon-")
  )
    event.respondWith(
      caches.match(event.request).then(
        (hit) =>
          hit ||
          fetch(event.request).then(async (r) => {
            if (r.ok) {
              const c = await caches.open(CACHE);
              await c.put(event.request, r.clone());
            }
            return r;
          }),
      ),
    );
});

// Warm only known recipe screens and immutable same-origin build assets.
self.addEventListener('message', event => {
  if (event.data?.type !== 'PRELOAD_RECIPES') return;
  event.waitUntil((async () => {
    const routes = ['/recipes', '/recipes/box', '/recipes/basket', '/recipes/add'];
    const assets = (Array.isArray(event.data.assets) ? event.data.assets : []).filter(value => {
      try { const url = new URL(value, self.location.origin); return url.origin === self.location.origin && url.pathname.startsWith('/_next/static/'); } catch { return false; }
    }).slice(0, 80);
    const cache = await caches.open(CACHE);
    const fetched = await Promise.all(routes.map(async url => {
      try {
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok || response.redirected) return false;
        const html = await response.clone().text();
        await cache.put(url, response);
        for (const match of html.matchAll(/(?:src|href)=["']([^"']*\/_next\/static\/[^"']+)["']/g)) {
          const asset = new URL(match[1], self.location.origin);
          if (asset.origin === self.location.origin && asset.pathname.startsWith('/_next/static/')) assets.push(asset.href);
        }
        return true;
      } catch { return false; }
    }));
    const assetResults = await Promise.all([...new Set(assets)].map(async url => {
      try {
        if (await cache.match(url)) return true;
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok || response.redirected) return false;
        await cache.put(url, response);
        return true;
      } catch { return false; }
    }));
    const ready = fetched.every(Boolean) && assetResults.every(Boolean);
    event.ports[0]?.postMessage({ ready });
  })());
});
