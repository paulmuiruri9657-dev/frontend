import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export function BrandCardSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center p-3 h-28 bg-white border border-gray-100 rounded-lg">
            {/* Monogram Circle */}
            <Skeleton className="w-10 h-10 rounded-full mb-2" />

            {/* Name Line */}
            <Skeleton className="h-3 w-20 mb-1.5" />

            {/* Count Badge */}
            <Skeleton className="h-4 w-8 rounded-md" />
        </div>
    );
}
