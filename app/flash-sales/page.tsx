'use client';

import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function FlashSalesPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [endsAt, setEndsAt] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const response = await api.getFlashSales();
                setProducts(response.data || []);
                setEndsAt(response.endsAt);
            } catch (error) {
                console.error('Error fetching flash sales:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlashSales();
    }, []);

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
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [endsAt]);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Skeleton */}
                <Skeleton className="w-full h-48 rounded-lg mb-6" />

                {/* Grid Skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-purple-500 rounded-lg p-8 text-white mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Zap className="h-12 w-12 fill-yellow-300 text-yellow-300" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Flash Sales</h1>
                            <p className="text-white/80 mt-1">Limited time offers at unbeatable prices!</p>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="text-center">
                        <p className="text-white/80 mb-2">Ends in:</p>
                        <div className="flex gap-2">
                            <div className="bg-black/30 backdrop-blur px-4 py-3 rounded-lg">
                                <span className="text-3xl font-mono font-bold">{formatNumber(timeLeft.hours)}</span>
                                <p className="text-xs text-white/60">HOURS</p>
                            </div>
                            <span className="text-3xl font-bold self-center">:</span>
                            <div className="bg-black/30 backdrop-blur px-4 py-3 rounded-lg">
                                <span className="text-3xl font-mono font-bold">{formatNumber(timeLeft.minutes)}</span>
                                <p className="text-xs text-white/60">MINS</p>
                            </div>
                            <span className="text-3xl font-bold self-center">:</span>
                            <div className="bg-black/30 backdrop-blur px-4 py-3 rounded-lg">
                                <span className="text-3xl font-mono font-bold">{formatNumber(timeLeft.seconds)}</span>
                                <p className="text-xs text-white/60">SECS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} variant="compact" />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Flash Sales Right Now</h2>
                    <p className="text-gray-500">Check back later for amazing deals!</p>
                </div>
            )}
        </div>
    );
}

