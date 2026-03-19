self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

// Basic fetch listener for PWA installability criteria
self.addEventListener('fetch', (event) => {
    // Optionally precache or handle varying logic here.
    // An empty fetch handler is enough to trigger the install prompt in some browsers,
    // though passing it directly to fetch() ensures content loads actively.
});
