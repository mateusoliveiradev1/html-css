// Service Worker para cache e performance
const CACHE_NAME = 'html-css-course-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Recursos críticos para cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/exercise-styles.css',
    '/css/quiz-styles.css',
    '/js/script.js',
    '/js/quiz-system.js',
    '/js/exercise-navigation.js',
    '/favicon.ico'
];

// Recursos dinâmicos (exercícios, desafios)
const DYNAMIC_ASSETS = [
    '/ex001.html',
    '/ex002.html',
    '/d001.html',
    '/quiz.html'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache de recursos estáticos
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            // Pre-cache de alguns recursos dinâmicos
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('Service Worker: Pre-caching dynamic assets');
                return cache.addAll(DYNAMIC_ASSETS.slice(0, 2)); // Cache apenas os primeiros
            })
        ])
    );
    
    // Força a ativação imediata
    self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Remove caches antigos
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Assume controle imediato
    self.clients.claim();
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignora requisições não-HTTP
    if (!request.url.startsWith('http')) return;
    
    // Estratégia Cache First para recursos estáticos
    if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Estratégia Network First para HTML dinâmico
    if (request.destination === 'document') {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Estratégia Cache First para outros recursos
    event.respondWith(cacheFirst(request));
});

// Estratégia Cache First
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Cache apenas respostas válidas
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Cache first failed:', error);
        
        // Fallback para página offline se disponível
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Estratégia Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache a resposta se for válida
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network first failed, trying cache:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback para página principal
        return caches.match('/index.html');
    }
}

// Limpeza periódica do cache
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        cleanOldCache();
    }
});

async function cleanOldCache() {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Remove entradas antigas (mais de 50 itens)
    if (requests.length > 50) {
        const toDelete = requests.slice(0, requests.length - 50);
        await Promise.all(toDelete.map(request => cache.delete(request)));
        console.log(`Service Worker: Cleaned ${toDelete.length} old cache entries`);
    }
}

// Atualização em background
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Implementar sincronização em background se necessário
    console.log('Service Worker: Background sync triggered');
}