'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, X, CheckCircle } from 'lucide-react';
import { Product } from '@/types';

interface CartToastProps {
    product: Product;
    onClose: () => void;
}

export default function CartToast({ product, onClose }: CartToastProps) {
    const [progress, setProgress] = useState(100);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Slide in
        const showTimer = setTimeout(() => setVisible(true), 50);

        // Progress countdown: 3 seconds
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - (100 / 30); // 30 steps over 3s
            });
        }, 100);

        // Auto dismiss after 3.2s
        const dismiss = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 400);
        }, 3200);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(dismiss);
            clearInterval(interval);
        };
    }, [onClose]);

    return (
        <div
            className={`fixed top-6 right-6 z-[9999] transition-all duration-400 ease-out max-w-sm w-full ${
                visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Progress bar */}
                <div
                    className="h-1 bg-gradient-to-r from-[#8b5cf6] to-[#f68b1e] transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
                <div className="p-4 flex gap-4 items-center">
                    {/* Product thumb */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                        <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.title}
                            className="object-contain w-full h-full mix-blend-multiply"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Added to Cart</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</p>
                        <p className="text-sm font-black text-[#8b5cf6] mt-1">
                            {product.currency} {product.price.toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
                        className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="px-4 pb-4">
                    <Link
                        href="/cart"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-2.5 rounded-xl text-sm font-black hover:shadow-lg transition-all active:scale-95"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        View Cart →
                    </Link>
                </div>
            </div>
        </div>
    );
}
