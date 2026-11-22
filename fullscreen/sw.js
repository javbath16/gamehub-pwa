/* ============================================
   GameHub PWA - Service Worker
   Versión: fullscreen  (display: fullscreen · orientation: landscape)
   ============================================
   Estrategias:
   - Precarga (install): se guardan en Cache Storage todos los archivos de la app.
   - Navegación (HTML): primero red, si falla se responde con index.html de la caché.
   - Recursos estáticos (CSS, JS, imágenes, fuentes): primero caché, si no está se
     descarga y se guarda (cache-first + runtime caching).
   Las cuatro versiones viven en el mismo dominio, por eso el nombre de la caché
   lleva el modo de display: así cada versión solo administra su propia caché.
*/

const PREFIJO_CACHE = 'gamehub-fullscreen-';
const CACHE_NAME = PREFIJO_CACHE + 'v1';

const ARCHIVOS_PRECACHE = [
    './',
    './index.html',
    './manifest.json',
    './img/hero-bg.jpg',
    './img/juego1.jpg',
    './img/juego2.jpg',
    './img/juego3.jpg',
    './img/juego4.jpg',
    './img/juego5.jpg',
    './img/juego6.jpg',
    './icons/apple-touch-icon.png',
    './icons/favicon-32.png',
    './icons/icon-128.png',
    './icons/icon-144.png',
    './icons/icon-152.png',
    './icons/icon-192.png',
    './icons/icon-384.png',
    './icons/icon-512.png',
    './icons/icon-72.png',
    './icons/icon-96.png',
    './icons/maskable-192.png',
    './icons/maskable-512.png',
    './css/estilos.css',
    './css/pwa.css',
    './vendor/fontawesome/LICENSE.txt',
    './vendor/fontawesome/webfonts/fa-brands-400.woff2',
    './vendor/fontawesome/webfonts/fa-regular-400.woff2',
    './vendor/fontawesome/webfonts/fa-solid-900.woff2',
    './vendor/fontawesome/webfonts/fa-v4compatibility.woff2',
    './vendor/fontawesome/css/all.min.css',
    './js/app.js',
    './js/pwa.js'
];

// ===== INSTALL: precarga de archivos =====
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARCHIVOS_PRECACHE))
            .then(() => self.skipWaiting())
    );
});

// ===== ACTIVATE: limpieza de cachés viejas de ESTA versión =====
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(nombres => Promise.all(
                nombres
                    .filter(n => n.startsWith(PREFIJO_CACHE) && n !== CACHE_NAME)
                    .map(n => caches.delete(n))
            ))
            .then(() => self.clients.claim())
    );
});

// ===== FETCH: responder desde la red o desde la caché =====
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    // Navegación (abrir la app / recargar): network-first con respaldo offline
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then(resp => {
                    const copia = resp.clone();
                    caches.open(CACHE_NAME).then(c => c.put('./index.html', copia));
                    return resp;
                })
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    // Recursos estáticos: cache-first
    event.respondWith(
        caches.match(req, { ignoreSearch: true }).then(enCache => {
            if (enCache) return enCache;
            return fetch(req).then(resp => {
                if (resp && resp.status === 200 && resp.type === 'basic') {
                    const copia = resp.clone();
                    caches.open(CACHE_NAME).then(c => c.put(req, copia));
                }
                return resp;
            });
        })
    );
});
