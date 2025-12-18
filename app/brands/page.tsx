'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import { Search, ArrowUpAZ, ArrowDownAZ, LayoutGrid, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BrandCardSkeleton } from '@/components/skeletons/BrandCardSkeleton';

interface BrandData {
    brand: string;
    count: number;
}

export default function BrandsPage() {
    const router = useRouter();
    const [brands, setBrands] = useState<BrandData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'count'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await api.getBrands();
                setBrands(response.data || []);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    const processedBrands = useMemo(() => {
        let result = [...brands];

        // Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(b => b.brand.toLowerCase().includes(lowerQuery));
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc'
                    ? a.brand.localeCompare(b.brand)
                    : b.brand.localeCompare(a.brand);
            } else {
                return sortOrder === 'asc'
                    ? a.count - b.count
                    : b.count - a.count;
            }
        });

        return result;
    }, [brands, searchQuery, sortBy, sortOrder]);

    const toggleSort = (key: 'name' | 'count') => {
        if (sortBy === key) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc'); // Default to ascending for new sort key
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                {/* Skeleton Header */}
                <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                            <div className="h-10 w-48 bg-gray-100 rounded animate-pulse" />
                            <div className="h-10 w-full md:w-64 bg-gray-100 rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Skeleton Grid */}
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <BrandCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Professional Header - No Fluff */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        {/* Title & Stats */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <LayoutGrid className="h-5 w-5 text-gray-700" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-gray-900 leading-tight">Official Stores</h1>
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                                    {processedBrands.length} Brands
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Find a brand..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-md text-sm transition-all outline-none placeholder:text-gray-400 font-medium"
                                />
                            </div>

                            {/* Sort Buttons */}
                            <button
                                onClick={() => toggleSort('name')}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-semibold transition-colors ${sortBy === 'name'
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                            >
                                {sortOrder === 'asc' ? <ArrowUpAZ className="h-3.5 w-3.5" /> : <ArrowDownAZ className="h-3.5 w-3.5" />}
                                Name
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* High Density Grid */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                {processedBrands.length > 0 ? (
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                        {processedBrands.map((brandData) => {
                            // Generate a consistent generic gradient based on brand name length
                            const nameLength = brandData.brand.length;
                            const hue = (nameLength * 37) % 360;

                            return (
                                <div
                                    key={brandData.brand}
                                    onClick={() => router.push(`/brand/${encodeURIComponent(brandData.brand)}`)}
                                    className="group relative flex flex-col items-center justify-center p-3 h-28 bg-white border border-gray-100 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                                >
                                    {/* Monogram / Logo Placeholder */}
                                    <div
                                        className="w-10 h-10 mb-2 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
                                        style={{ backgroundColor: `hsl(${hue}, 65%, 45%)` }}
                                    >
                                        {brandData.brand.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Brand Name */}
                                    <h3 className="text-xs font-bold text-gray-800 text-center leading-tight line-clamp-2 px-1 group-hover:text-black">
                                        {brandData.brand}
                                    </h3>

                                    {/* Count Badge */}
                                    <div className="mt-1.5 px-1.5 py-0.5 bg-gray-50 rounded text-[9px] font-semibold text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600 transition-colors">
                                        {brandData.count}
                                    </div>

                                    {/* Active Indicator */}
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <AlertCircle className="h-10 w-10 mb-3 opacity-20" />
                        <p className="text-sm font-medium">No brands match "{searchQuery}"</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-xs font-bold text-[#0A7A3D] hover:underline"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
