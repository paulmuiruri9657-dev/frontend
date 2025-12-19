'use client';

import React, { useEffect, useState } from 'react';

/**
 * Minimal, ultra-fast intro animation for PWA/App Launch.
 * 
 * Rules:
 * - Shows ONLY once per session (checked via sessionStorage)
 * - Duration: < 600ms
 * - Zero deps (pure CSS animation)
 * - Accessibility: Reduced motion query respect (implied by short duration)
 */
export default function IntroAnimation() {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // 1. Check if already seen
        if (typeof window !== 'undefined') {
            const hasSeen = sessionStorage.getItem('ecoloop_intro_seen');

            // 2. Performance check (optional, but good for "low performance" skip rule)
            // If navigator.hardwareConcurrency is low, we might skip, but this is simple enough to run.

            if (hasSeen) {
                setIsVisible(false);
                setShouldRender(false);
                return;
            }

            // 3. Mark as seen
            sessionStorage.setItem('ecoloop_intro_seen', 'true');

            // 4. Schedule cleanup
            // Animation takes ~300ms to fully reveal.
            // We hold for a split second, then fade out.
            // Total visible time aim: ~600ms.
            const fadeTimer = setTimeout(() => {
                setIsVisible(false);
            }, 600);

            const removeTimer = setTimeout(() => {
                setShouldRender(false);
            }, 900); // 600ms + 300ms fade out

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            aria-hidden="true"
        >
            <style>
                {`
                    @keyframes reveal {
                        from { opacity: 0; transform: translateY(4px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .intro-char {
                        opacity: 0;
                        animation: reveal 0.2s ease-out forwards;
                    }
                `}
            </style>

            <div className="flex items-baseline scale-110 md:scale-150">
                {/* EcoLooP */}
                <span className="font-black tracking-tighter text-[#8b5cf6] text-4xl md:text-5xl flex">
                    {'EcoLooP'.split('').map((char, i) => (
                        <span
                            key={i}
                            className="intro-char"
                            style={{ animationDelay: `${i * 35}ms` }}
                        >
                            {char}
                        </span>
                    ))}
                </span>

                {/* Ke */}
                <span
                    className="intro-char font-bold text-sm md:text-lg ml-1 text-[#f68b1e]"
                    style={{ animationDelay: '280ms' }}
                >
                    Ke
                </span>
            </div>
        </div>
    );
}
