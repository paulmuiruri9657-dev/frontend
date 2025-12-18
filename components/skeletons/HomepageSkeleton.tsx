import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export function HomepageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-0 md:px-4 py-4 space-y-6">
            {/* Hero Section */}
            <div className="flex gap-4 h-[300px] md:h-[400px]">
                {/* Sidebar Skeleton (Desktop only) */}
                <div className="hidden md:block w-52 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm h-full p-4 space-y-3 border border-gray-100">
                        {[...Array(10)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                </div>

                {/* Carousel Skeleton */}
                <div className="flex-1 w-full bg-gray-100 rounded-lg animate-pulse"></div>
            </div>

            {/* Brands Section */}
            <div className="flex gap-4 overflow-hidden py-2 px-4 md:px-0">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-24 h-12 bg-white rounded-lg border border-gray-100 animate-pulse"></div>
                ))}
            </div>

            {/* Flash Sales & Deals Sections */}
            <div className="space-y-8">
                {/* Section 1 */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-4 md:px-0">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-2 md:px-0">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64">
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2 */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-4 md:px-0">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-2 md:px-0">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64">
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
