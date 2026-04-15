import { supabase } from './supabase';

/**
 * Converts a base64 string to a Uint8Array. 
 * Needed for VAPID keys in push subscription.
 */
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Requests notification permission and subscribes the user to push notifications.
 * Sends the subscription to the backend.
 */
export async function subscribeUserToPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported in this browser.');
        return { success: false, error: 'NOT_SUPPORTED' };
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        // 1. Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            return { success: false, error: 'PERMISSION_DENIED' };
        }

        // 2. Subscribe
        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
        };

        const subscription = await registration.pushManager.subscribe(subscribeOptions);
        
        // 3. Send to backend
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return { success: false, error: 'NO_SESSION' };

        const res = await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ subscription })
        });

        if (res.ok) {
            localStorage.setItem('edupal_push_subscribed', 'true');
            return { success: true };
        } else {
            throw new Error('Failed to save subscription to server');
        }

    } catch (err: any) {
        console.error('Push subscription failed:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Checks if the user has already subscribed according to local storage or status.
 */
export async function getPushSubscriptionStatus() {
    if (!('Notification' in window)) return 'NOT_SUPPORTED';
    if (Notification.permission === 'denied') return 'DENIED';
    if (Notification.permission === 'granted') {
        const isSubscribedLocally = localStorage.getItem('edupal_push_subscribed');
        return isSubscribedLocally === 'true' ? 'GRANTED' : 'READY';
    }
    return 'DEFAULT'; // Not asked yet
}
