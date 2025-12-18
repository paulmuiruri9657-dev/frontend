'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { CARD_STYLES } from '@/lib/card-styles';

interface FlashSalesSectionProps {
    products: Product[];
    endsAt?: string | null;
    onAddToCart?: (product: Product) => void;
}

export default function FlashSalesSection({ products, endsAt, onAddToCart }: FlashSalesSectionProps) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!endsAt) return;

        const calculateTimeLeft = () => {
            const endTime = new Date(endsAt).getTime();
            const now = Date.now();
            const difference = endTime - now;

            if (difference <= 0) {
                return { hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                hours: Math.floor(difference / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endsAt]);

    if (!products || products.length === 0) {
        return null;
    }

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="bg-gradient-to-r from-red-600 to-purple-500 rounded-none md:rounded-lg shadow-lg overflow-hidden mx-0 md:mx-0">
            {/* Header */}
            <div className="flex items-center justify-between px-2 md:px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                        <span className="text-white font-bold text-lg">Flash Sales</span>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-1">
                        <span className="text-white/80 text-sm">Time Left:</span>
                        <div className="flex gap-1">
                            <span className="bg-black text-white px-2 py-1 rounded font-mono text-sm font-bold">
                                {formatNumber(timeLeft.hours)}
                            </span>
                            <span className="text-white font-bold">:</span>
                            <span className="bg-black text-white px-2 py-1 rounded font-mono text-sm font-bold">
                                {formatNumber(timeLeft.minutes)}
                            </span>
                            <span className="text-white font-bold">:</span>
                            <span className="bg-black text-white px-2 py-1 rounded font-mono text-sm font-bold">
                                {formatNumber(timeLeft.seconds)}
                            </span>
                        </div>
                    </div>
                </div>

                <Link
                    href="/flash-sales"
                    className="text-white font-semibold hover:underline flex items-center gap-1"
                >
                    See All →
                </Link>
            </div>

            {/* Products Scroll */}
            <div className="bg-white p-2 md:p-4">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {products.slice(0, 10).map((product) => (
                        <div key={product._id} className={`flex-none ${CARD_STYLES.flash.width} snap-start`}>
                            <ProductCard
                                product={product}
                                onAddToCart={onAddToCart}
                                showAddToCart={false}
                                variant="flash"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
