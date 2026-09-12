const CACHE = "martib-recipes-v1";
self.addEventListener("install", (event) =>
  event.waitUntil(
    caches.open(CACHE).then((c) => c.add("/recipes/offline.html")),
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
