// Service Worker for Ramazan İmsakiye PWA
const CACHE_NAME = 'imsakiye-v16';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './game.js',
    './embedded_data.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Amiri:wght@400;700&display=swap',
    'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css'
];

// Install: Cache all assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Cache-first strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                // Cache new successful requests
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => {
                // Offline fallback
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes('/ramazan-imsakiye/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SCHEDULE_PRAYERS') {
        const { city, days } = event.data;
        scheduleNotifications(city, days);
    }
});

async function scheduleNotifications(city, days) {
    if (!('showTrigger' in Notification.prototype)) {
        console.log('Notification Triggers API is not supported in this browser.');
        return; // Fallback is already handled in foreground app via setInterval
    }

    try {
        const nowMs = Date.now();

        days.forEach(day => {
            if (!day || !day.date) return;
            const y = parseInt(day.date.substring(0, 4));
            const m = parseInt(day.date.substring(5, 7)) - 1;
            const d = parseInt(day.date.substring(8, 10));

            const prayers = [
                { name: 'İmsak', time: day.fajr },
                { name: 'Öğle', time: day.dhuhr },
                { name: 'İkindi', time: day.asr },
                { name: 'Akşam', time: day.maghrib },
                { name: 'Yatsı', time: day.isha }
            ];

            prayers.forEach(p => {
                if (!p.time) return;
                const [h, min] = p.time.split(':').map(Number);
                const targetTime = new Date(y, m, d, h, min, 0).getTime();

                // Only schedule future notifications
                if (targetTime > nowMs) {
                    self.registration.showNotification(`Ezan Vakti: ${p.name}`, {
                        body: `${city} için ${p.name} vakti girdi (${p.time}).`,
                        icon: 'icons/icon-192.png',
                        badge: 'icons/icon-192.png',
                        tag: `prayer-notif-${day.date}-${p.name}`,
                        showTrigger: new TimestampTrigger(targetTime)
                    }).catch(err => console.error('Error scheduling:', err));
                }
            });
        });

    } catch (e) {
        console.error('Failed to schedule notifications', e);
    }
}
