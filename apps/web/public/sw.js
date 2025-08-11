const CACHE_NAME = 'vehicle-tracker-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/login',
  '/dashboard',
  '/vehicles',
  '/manifest.json',
  '/favicon.ico',
  '/_next/static/css/',
  '/_next/static/js/',
];

const API_CACHE_PATTERNS = [
  /\/api\/vehicles/,
  /\/api\/dashboard/,
  /\/api\/auth/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS.filter(url => !url.includes('_next')));
      }),
      // Force activation of new service worker
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && 
                     cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => caches.delete(cacheName))
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // Skip non-GET requests
  if (method !== 'GET') return;

  // Skip cross-origin requests
  if (!url.startsWith(self.location.origin)) return;

  // Handle different types of requests
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirst(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(navigationHandler(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Check if URL is a static asset
function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('/static/') ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.ico') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.svg');
}

// Check if URL is an API request
function isAPIRequest(url) {
  return url.includes('/api/') || API_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

// Check if request is navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Cache first strategy - good for static assets
async function cacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first failed:', error);
    return new Response('Asset not available', { status: 503 });
  }
}

// Network first strategy - good for API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(
      JSON.stringify({ error: 'Network unavailable', offline: true }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Navigation handler - serve app shell for SPA routes
async function navigationHandler(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('Navigation failed, serving offline page:', error);
    
    const cache = await caches.open(STATIC_CACHE);
    const offlineResponse = await cache.match('/');
    
    return offlineResponse || new Response('App offline', { status: 503 });
  }
}

// Stale while revalidate - good for dynamic content
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Handle update available message
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        type: 'VERSION_INFO',
        version: CACHE_NAME,
        timestamp: new Date().toISOString()
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
      
    case 'PREFETCH_ROUTES':
      prefetchRoutes(payload.routes).then(() => {
        event.ports[0].postMessage({ type: 'ROUTES_PREFETCHED' });
      });
      break;
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Prefetch important routes
async function prefetchRoutes(routes = []) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  const prefetchPromises = routes.map(async (route) => {
    try {
      const response = await fetch(route);
      if (response.ok) {
        await cache.put(route, response);
      }
    } catch (error) {
      console.warn(`Failed to prefetch route: ${route}`, error);
    }
  });
  
  return Promise.all(prefetchPromises);
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  try {
    // Get queued requests from IndexedDB or localStorage
    const queuedRequests = await getQueuedRequests();
    
    for (const request of queuedRequests) {
      try {
        await fetch(request.url, request.options);
        await removeQueuedRequest(request.id);
      } catch (error) {
        console.error('Background sync failed for request:', request, error);
      }
    }
  } catch (error) {
    console.error('Background sync handler failed:', error);
  }
}

// Placeholder functions for offline queue (to be implemented with IndexedDB)
async function getQueuedRequests() {
  // Implement with IndexedDB
  return [];
}

async function removeQueuedRequest(id) {
  // Implement with IndexedDB
  console.log('Removing queued request:', id);
}

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: event.data ? JSON.parse(event.data.text()) : {},
    actions: [
      {
        action: 'update',
        title: 'Atualizar Agora',
        icon: '/icons/update.png'
      },
      {
        action: 'dismiss',
        title: 'Mais Tarde',
        icon: '/icons/dismiss.png'
      }
    ],
    requireInteraction: true,
    tag: 'app-update'
  };

  event.waitUntil(
    self.registration.showNotification('Rastreador Veicular', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { action, data } = event.notification;
  
  switch (action) {
    case 'update':
      event.waitUntil(
        clients.matchAll().then((clientList) => {
          if (clientList.length > 0) {
            clientList[0].postMessage({
              type: 'FORCE_UPDATE_REQUEST',
              data
            });
            clientList[0].focus();
          } else {
            clients.openWindow('/');
          }
        })
      );
      break;
      
    case 'dismiss':
      // Just close notification
      break;
      
    default:
      event.waitUntil(
        clients.matchAll().then((clientList) => {
          if (clientList.length > 0) {
            clientList[0].focus();
          } else {
            clients.openWindow('/');
          }
        })
      );
  }
});