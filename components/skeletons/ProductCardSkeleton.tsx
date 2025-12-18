import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 md:p-3 space-y-3 h-full">
            {/* Image Placeholder */}
            <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content */}
            <div className="space-y-2">
                {/* Title */}
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />

                {/* Price */}
                <div className="pt-1">
                    <Skeleton className="h-5 w-1/3" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 pt-1">
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
}
