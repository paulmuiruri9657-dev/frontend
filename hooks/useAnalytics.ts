'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

export const useAnalytics = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hasTrackedInstall = useRef(false);

    // Track Page Views
    useEffect(() => {
        // Avoid double counting on strict mode rewrites if possible, but debounce is better
        const url = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

        // Simple 500ms debounce could be added here if rapid route changes happen
        // For now we trust Next.js navigation stability

        const trackView = async () => {
            try {
                await api.post('/analytics/track', {
                    eventType: 'page_view',
                    url: window.location.href,
                    path: pathname,
                    deviceInfo: {
                        deviceType: getDeviceType(),
                        os: navigator.platform,
                        browser: navigator.userAgent
                    }
                });
            } catch (e) {
                // Silently fail
            }
        };

        trackView();
    }, [pathname, searchParams]);

    // Track PWA Installs
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleInstall = async () => {
                if (hasTrackedInstall.current) return;
                hasTrackedInstall.current = true;

                try {
                    await api.post('/analytics/track', {
                        eventType: 'pwa_install',
                        deviceInfo: {
                            deviceType: getDeviceType(),
                            os: navigator.platform,
                            browser: navigator.userAgent
                        }
                    });
                } catch (e) {
                    // Silently fail
                }
            };

            window.addEventListener('appinstalled', handleInstall);
            return () => window.removeEventListener('appinstalled', handleInstall);
        }
    }, []);
};

// Helper
const getDeviceType = () => {
    if (typeof navigator === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)os|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};
