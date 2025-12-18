'use client';

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already in standalone mode
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        setIsStandalone(isStandaloneMode);

        if (isStandaloneMode) return;

        // Check for iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Check if user has dismissed it previously
            const hasDismissed = localStorage.getItem('pwa_banner_dismissed');
            if (!hasDismissed) {
                setIsVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Define the global install function
        (window as any).installEcoloopApp = async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    setDeferredPrompt(null);
                    setIsVisible(false);
                }
            } else if (isIOSDevice) {
                // For iOS, show a tooltip or instruction
                alert("To install Ecoloop: tap 'Share' then 'Add to Home Screen'");
            } else {
                // Fallback for when prompt isn't available (already installed or unsupported)
                alert("It looks like the app is already installed or your browser doesn't support automatic installation. Please check your browser menu to install.");
            }
        };

        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            delete (window as any).installEcoloopApp;
        };
    }, [deferredPrompt]);

    const handleInstallClick = () => {
        if ((window as any).installEcoloopApp) {
            (window as any).installEcoloopApp();
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwa_banner_dismissed', 'true');
    };

    if (isStandalone || !isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center gap-4">
                <div className="bg-[#0A7A3D] text-white p-3 rounded-xl shadow-lg">
                    <Download className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Install Ecoloop App</h3>
                    <p className="text-xs text-gray-500">Add to your home screen for easier access</p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            <button
                onClick={handleInstallClick}
                className="w-full mt-4 bg-[#0A7A3D] hover:bg-[#086331] text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
                Install Now
            </button>
        </div>
    );
}
