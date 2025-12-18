'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Sparkles, Package } from 'lucide-react';
import { api } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface RecommendationsProps {
    type: 'trending' | 'personalized' | 'similar' | 'frequently-bought';
    productId?: string;
    title?: string;
    limit?: number;
}

export default function ProductRecommendations({ type, productId, title, limit = 12 }: RecommendationsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                let response;

                switch (type) {
                    case 'trending':
                        response = await api.getTrendingProducts();
                        break;
                    case 'personalized':
                        response = await api.getPersonalizedRecommendations();
                        break;
                    case 'similar':
                        if (productId) response = await api.getSimilarProducts(productId);
                        break;
                    case 'frequently-bought':
                        if (productId) response = await api.getFrequentlyBoughtTogether(productId);
                        break;
                }

                if (response?.data) {
                    setProducts(response.data.slice(0, limit));
                }
            } catch (error) {
                console.error('Failed to fetch recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [type, productId, limit]);

    if (loading) {
        return (
            <div className="py-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8b5cf6]"></div>
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    const getIcon = () => {
        switch (type) {
            case 'trending':
                return <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />;
            case 'personalized':
                return <Sparkles className="h-5 w-5 md:h-6 md:w-6" />;
            default:
                return <Package className="h-5 w-5 md:h-6 md:w-6" />;
        }
    };

    const getTitle = () => {
        if (title) return title;

        switch (type) {
            case 'trending':
                return 'Trending Now';
            case 'personalized':
                return 'Recommended For You';
            case 'similar':
                return 'Similar Products';
            case 'frequently-bought':
                return 'Frequently Bought Together';
            default:
                return 'You May Also Like';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="text-[#8b5cf6]">
                    {getIcon()}
                </div>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                    {getTitle()}
                </h2>
            </div>

            {/* Products Grid or Horizontal Scroll */}
            {type === 'trending' || type === 'personalized' ? (
                /* Horizontal Scroll for Trending Now */
                <div className="relative -mx-4 md:mx-0">
                    <div
                        className="flex gap-3 md:gap-4 overflow-x-auto px-4 md:px-0 pb-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#8b5cf6] scrollbar-track-gray-100 hover:scrollbar-thumb-[#7c3aed]"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#8b5cf6 #f3f4f6'
                        }}
                    >
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="flex-none w-[160px] sm:w-[180px] md:w-[200px] snap-start"
                            >
                                <ProductCard
                                    product={product}
                                    showAddToCart={false}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Scroll Indicator - Optional visual hint */}
                    <div className="flex justify-center gap-1 mt-3 md:hidden">
                        {Array.from({ length: Math.ceil(products.length / 2) }).map((_, i) => (
                            <div
                                key={i}
                                className="h-1 w-8 bg-gray-200 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            ) : (
                /* Grid layout for other types */
                <div className={`grid grid-cols-2 ${type === 'frequently-bought'
                    ? 'sm:grid-cols-2 md:grid-cols-4'
                    : 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                    } gap-3 md:gap-4`}>
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            showAddToCart={false}
                        />
                    ))}
                </div>
            )}

            {/* View More Link */}
            {type === 'trending' || type === 'personalized' ? (
                <div className="text-center mt-4 md:mt-6">
                    <Link
                        href={type === 'trending' ? '/trending' : '/recommended'}
                        className="text-[#8b5cf6] hover:text-[#7c3aed] font-medium text-sm md:text-base inline-block transition-colors"
                    >
                        View All →
                    </Link>
                </div>
            ) : null}
        </div>
    );
}
