/**
 * VAS - Service Worker (sw.js)
 * GitHub Pages 上の静的アセットのみをキャッシュする。
 * GAS への API 呼び出し(POST)は常にネットワークへ素通しする。
 */

const CACHE_VERSION = "vas-cache-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./entry.html",
  "./ledger.html",
  "./receipts.html",
  "./settings.html",
  "./categories.html",
  "./reports.html",
  "./css/style.css",
  "./js/app.js",
  "./js/api.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // POSTなどGET以外、または他オリジン(GAS API等)は素通し(キャッシュしない)
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // 静的アセット: cache-first、なければネットワークから取得しキャッシュに追加
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => cached);
    })
  );
});
