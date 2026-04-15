const CACHE_NAME = 'financas-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
]

// Instalar o service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto')
        return cache.addAll(urlsToCache)
      })
      .catch(err => console.log('Erro ao cachear:', err))
  )
  self.skipWaiting()
})

// Ativar o service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Interceptar requisições
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retornar do cache se encontrado
        if (response) {
          return response
        }
        
        // Caso contrário, fazer a requisição
        return fetch(event.request)
          .then(response => {
            // Cachear novas requisições
            if (!response || response.status !== 200) {
              return response
            }

            const responseToCache = response.clone()
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // Retornar página offline se necessário
            return new Response('Offline')
          })
      })
  )
})
