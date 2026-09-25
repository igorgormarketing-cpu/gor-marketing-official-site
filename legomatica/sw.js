const CACHE_NAME = 'brickmind-pwa-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './three.min.js',
  './OrbitControls.js',
  './audio_synth.js',
  './brick_engine_25parts.js',
  './MASTER_STYLE_HERO.jpg',
  './SCREEN_1_FARM_MAP.png',
  './SCREEN_2_CATALOG.jpg',
  './SCREEN_3_WORKTABLE.jpg',
  './SCREEN_4_WAREHOUSE.jpg',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(err => console.warn('Cache addAll error:', err)))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
