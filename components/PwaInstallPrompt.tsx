'use client';

import React, { useState, useEffect } from 'react';

export default function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches;
        // @ts-ignore
        const isStandaloneSafari = window.navigator.standalone === true;
        
        setIsStandalone(isStandaloneMatch || isStandaloneSafari);
        
        if (isStandaloneMatch || isStandaloneSafari) {
            return; // Don't show if already installed
        }

        // Check if device is iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(iosDevice);

        if (iosDevice) {
            // Show prompt for iOS after a slight delay since they don't get beforeinstallprompt
            const hasDismissed = localStorage.getItem('edupal_pwa_dismissed');
            if (!hasDismissed) {
                setTimeout(() => setShowPrompt(true), 3000);
            }
        }

        // Listen for the standard Android/Desktop install event
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            
            const hasDismissed = localStorage.getItem('edupal_pwa_dismissed');
            if (!hasDismissed) {
                setShowPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            // We've used the prompt, and can't use it again, drop it
            setDeferredPrompt(null);
        } else if (isIOS) {
            // Show iOS instructions modal
            alert("To install EduPal: Tap the 'Share' icon at the bottom of Safari, then tap 'Add to Home Screen'.");
            setShowPrompt(false);
            localStorage.setItem('edupal_pwa_dismissed', 'true');
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('edupal_pwa_dismissed', 'true');
    };

    if (!showPrompt || isStandalone) return null;

    return (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                    <span className="material-symbols-outlined">install_mobile</span>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Install EduPal App</h4>
                    <p className="text-xs text-slate-500 font-medium">Add to your home screen for faster access.</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleDismiss}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
                <button 
                    onClick={handleInstallClick}
                    className="bg-primary text-background-dark text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                    Install
                </button>
            </div>
        </div>
    );
}
