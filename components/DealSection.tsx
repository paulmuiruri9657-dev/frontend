'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Product, Category } from '@/types';
import ProductCard from './ProductCard';
import { CARD_STYLES } from '@/lib/card-styles';

interface DealSectionProps {
    title: string;
    products: Product[];
    category?: Category;
    bgColor?: string;
    seeAllLink?: string;
    onAddToCart?: (product: Product) => void;
}

export default function DealSection({
    title,
    products,
    category,
    bgColor = 'bg-white',
    seeAllLink,
    onAddToCart
}: DealSectionProps) {
    if (!products || products.length === 0) {
        return null;
    }

    const link = seeAllLink || (category ? `/category/${category.slug}` : '#');

    return (
        <div className={`${bgColor} rounded-none md:rounded-lg shadow-sm overflow-hidden mx-0 md:mx-0`}>
            {/* Header */}
            <div className="flex items-center justify-between px-2 md:px-4 py-3 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-800">{title}</h2>
                <Link
                    href={link}
                    className="text-[#8b5cf6] font-semibold text-sm hover:underline flex items-center gap-1"
                >
                    See All <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Horizontal Scroll Products */}
            <div className="relative p-2 md:p-4">
                <div
                    className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#8b5cf6] scrollbar-track-gray-100 hover:scrollbar-thumb-[#7c3aed] -mx-2 md:mx-0 px-2 md:px-0"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#8b5cf6 #f3f4f6'
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className={`flex-none ${CARD_STYLES.compact.width} snap-start`}
                        >
                            <ProductCard
                                product={product}
                                onAddToCart={onAddToCart}
                                showAddToCart={false}
                                variant="compact"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

