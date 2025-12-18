'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function TrendingPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await api.getTrendingProducts();
                setProducts(response.data || []);
            } catch (error) {
                console.error('Error fetching trending products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8b5cf6] mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="text-[#8b5cf6]">
                            <TrendingUp className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Trending Now
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base mt-1">
                                Discover the hottest products based on real-time engagement
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && products.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                showAddToCart={false}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-20">
                        <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No Trending Products Yet
                        </h3>
                        <p className="text-gray-500">
                            Check back soon for the hottest products!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
