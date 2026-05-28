const CACHE_NAME = 'paola-panel-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/js/app.js',
  '/js/firebase.js',
  '/js/mobile-optimizations.js',
  '/js/performance-optimizer.js'
];

// Dominios que NO deben ser cacheados por el Service Worker (Firebase)
const EXCLUDED_HOSTS = [
  'firestore.googleapis.com',
  'firebaseinstallations.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Detectar si el recurso solicitado es una imagen
  const isImage = event.request.destination === 'image' || 
                  /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname);

  // 1. IGNORAR llamadas a Firebase (Auth/Firestore) y APIs externas que no sean imágenes
  if (EXCLUDED_HOSTS.some(host => url.hostname.includes(host)) || event.request.method !== 'GET') {
    return;
  }

  // 2. ESTRATEGIA: Network-First para navegación (SPA Routing)
  // Esto evita el error 404 al recargar rutas como /dashboard/clientes
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Si falla (offline), servimos la página de fallback personalizada
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // 3. ESTRATEGIA: Cache-First para Assets Estáticos e Imágenes de productos
  const isAsset = STATIC_ASSETS.includes(url.pathname) || 
                  url.pathname.startsWith('/css/') || 
                  url.pathname.startsWith('/js/') || 
                  url.pathname.startsWith('/img/') ||
                  isImage;

  if (isAsset) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchRes) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        });
      })
    );
  }
});