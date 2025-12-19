"use client";

import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Set initial state
        setIsOffline(!navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none flex justify-center">
            <div className="bg-gray-900/90 text-white px-5 py-3 rounded-full shadow-xl backdrop-blur-sm flex items-center gap-3 border border-white/10 pointer-events-auto">
                <WifiOff className="h-4 w-4 text-red-400" />
                <span className="text-sm font-medium">You’re offline — showing saved content</span>
            </div>
        </div>
    );
}
