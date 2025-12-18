import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Images */}
                    <div className="space-y-4">
                        <Skeleton className="w-full aspect-square rounded-xl" />
                        <div className="grid grid-cols-4 gap-4">
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="aspect-square rounded-lg" />
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-6">
                        {/* Title & Brand */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-3/4" />
                        </div>

                        {/* Rating */}
                        <Skeleton className="h-4 w-32" />

                        {/* Price */}
                        <div className="py-4 border-y border-gray-100">
                            <Skeleton className="h-10 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
