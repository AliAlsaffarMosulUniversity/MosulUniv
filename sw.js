/* Service worker — يحفظ واجهة التطبيق للعمل بدون إنترنت */
const VERSION = 'uom-v2';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'data.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // بيانات الجامعة: من الشبكة دائماً (التطبيق يحفظ نسخته بنفسه)
  if (url.pathname.includes('/wp-json/')) return;
  // ملفات التطبيق: من الذاكرة أولاً ثم التحديث في الخلفية
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r.ok) caches.open(VERSION).then(c => c.put(req, r.clone())); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  // الخطوط والصور: من الذاكرة إن وُجدت
  if (url.hostname.includes('fonts.g') || /\.(png|jpe?g|webp)$/i.test(url.pathname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(VERSION + '-media').then(c => c.put(req, cp)); }
      return r;
    }).catch(() => hit)));
  }
});
