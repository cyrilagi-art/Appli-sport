/* Service worker : l'appli fonctionne hors ligne après la première visite.
   Pour publier une nouvelle version, change VERSION (ou laisse le réseau faire : index.html est pris en priorité sur le réseau). */
const VERSION = "v1";
const CACHE = "seance-" + VERSION;
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("seance-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  const fonts = u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com";
  if (u.origin !== location.origin && !fonts) return;
  if (r.mode === "navigate") {
    // page : réseau d'abord (nouvelle version dès que connecté), cache en secours
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put("index.html", c)); return res; })
      .catch(() => caches.match("index.html")));
    return;
  }
  // reste : cache d'abord, rafraîchi en arrière-plan
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => { if (res && (res.ok || res.type === "opaque")) { const c = res.clone(); caches.open(CACHE).then(k => k.put(r, c)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
