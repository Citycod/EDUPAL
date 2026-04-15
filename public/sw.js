self.addEventListener('push', (event) => {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const options = {
            body: data.body || "Your daily academic challenge is ready!",
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            tag: 'daily-question', // Prevents duplicate notifications scaling
            renotify: true, // Vibrates/notifies even if tag is the same
            data: {
                url: data.url || '/'
            },
            actions: [
                { action: 'open', title: 'Open EduPal' }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'EduPal 🔥', options)
        );
    } catch (e) {
        console.error('Push event error:', e);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    let urlToOpen = '/';
    if (event.notification.data && event.notification.data.url) {
        urlToOpen = event.notification.data.url;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // If a tab is already open, focus it and navigate
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(new URL('/', self.location.origin).href) && 'focus' in client) {
                    return client.focus().then((focusedClient) => {
                        return focusedClient.navigate(urlToOpen);
                    });
                }
            }
            // If no tab open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Basic fetch listener for PWA installability criteria
self.addEventListener('fetch', (event) => {
    // Keeping this to ensure PWA installability
});
