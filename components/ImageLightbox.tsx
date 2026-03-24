'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageLightboxProps {
    images: string[];
    initialIndex: number;
    title: string;
    onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex, title, onClose }: ImageLightboxProps) {
    const [current, setCurrent] = useState(initialIndex);
    const touchStartX = useRef<number | null>(null);

    const prev = useCallback(() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
    const next = useCallback(() => setCurrent(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose, prev, next]);

    // Touch swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 40) { // 40px threshold
            if (delta > 0) next(); else prev();
        }
        touchStartX.current = null;
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col" onClick={onClose}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <span className="text-white/60 text-sm font-medium">{current + 1} / {images.length}</span>
                <p className="text-white text-sm font-bold line-clamp-1 flex-1 text-center px-4">{title}</p>
                <button onClick={onClose} className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Main Image */}
            <div
                className="flex-1 flex items-center justify-center relative select-none"
                onClick={e => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Prev Arrow */}
                {images.length > 1 && (
                    <button
                        onClick={prev}
                        className="absolute left-2 md:left-6 z-10 p-3 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full text-white transition-all active:scale-90"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}

                {/* Image with slide animation */}
                <div className="w-full h-full flex items-center justify-center px-16 md:px-24">
                    <img
                        key={current}
                        src={images[current]}
                        alt={`${title} — image ${current + 1}`}
                        className="max-w-full max-h-[75vh] object-contain rounded-xl select-none animate-[fadeIn_0.25s_ease-out]"
                        draggable={false}
                        style={{ animation: 'fadeZoomIn 0.25s ease-out' }}
                    />
                </div>

                {/* Next Arrow */}
                {images.length > 1 && (
                    <button
                        onClick={next}
                        className="absolute right-2 md:right-6 z-10 p-3 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full text-white transition-all active:scale-90"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Thumbnails strip */}
            {images.length > 1 && (
                <div className="flex-shrink-0 px-4 pb-4" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-center gap-2 overflow-x-auto pb-1">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                                    idx === current ? 'border-[#8b5cf6] scale-110' : 'border-white/20 opacity-50 hover:opacity-80'
                                }`}
                            >
                                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain bg-white" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeZoomIn {
                    from { opacity: 0; transform: scale(0.97); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
