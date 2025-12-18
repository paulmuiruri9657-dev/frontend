'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, X, Sliders } from 'lucide-react';
import { api } from '@/lib/api';
import { Product, ProductFilters } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [sortBy, setSortBy] = useState('-createdAt');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const brandParam = searchParams.get('brand');
                const filters: ProductFilters = {
                    search: query || undefined,
                    sort: (searchParams.get('sort') as any) || '-createdAt',
                    page: parseInt(searchParams.get('page') || '1', 10),
                    limit: 30,
                    brand: brandParam ? brandParam.split(',') : undefined,
                    location: searchParams.get('location') || undefined,
                    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
                    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
                    inStock: searchParams.get('inStock') === 'true' ? true : undefined
                };

                const response = await api.getProducts(filters);
                setProducts(response.data || []);
                setPagination(response.pagination);
            } catch (error) {
                console.error('Error searching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, searchParams]);

    const handleSort = (newSort: string) => {
        setSortBy(newSort);
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newSort);
        router.push(`/search?${params.toString()}`);
    };

    const removeFilter = (filterType: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (filterType === 'brand' && value) {
            const brands = params.get('brand')?.split(',').filter(b => b !== value) || [];
            if (brands.length > 0) {
                params.set('brand', brands.join(','));
            } else {
                params.delete('brand');
            }
        } else {
            params.delete(filterType);
        }

        router.push(`/search?${params.toString()}`);
    };

    // Get active filters for chips
    const activeFilters: Array<{ type: string; label: string; value?: string }> = [];

    const brands = searchParams.get('brand')?.split(',').filter(b => b) || [];
    brands.forEach(brand => {
        activeFilters.push({ type: 'brand', label: brand, value: brand });
    });

    const location = searchParams.get('location');
    if (location) {
        activeFilters.push({ type: 'location', label: `Location: ${location}` });
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
        const label = minPrice && maxPrice
            ? `KSh ${parseInt(minPrice).toLocaleString()} - ${parseInt(maxPrice).toLocaleString()}`
            : minPrice
                ? `Min: KSh ${parseInt(minPrice).toLocaleString()}`
                : `Max: KSh ${parseInt(maxPrice!).toLocaleString()}`;
        activeFilters.push({ type: minPrice ? 'minPrice' : 'maxPrice', label });
    }

    if (searchParams.get('inStock') === 'true') {
        activeFilters.push({ type: 'inStock', label: 'In Stock' });
    }

    if (loading) {
        return (
            <div className="flex gap-6">
                {/* Sidebar Skeleton */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <Skeleton className="h-[600px] w-full rounded-lg" />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-6">
            {/* Filter Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <FilterSidebar />
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
                        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="font-bold text-lg">Filters</h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <FilterSidebar onFilterChange={() => setShowMobileFilters(false)} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
                {/* Search Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                            {query ? `Search results for "${query}"` : 'All Products'}
                        </h1>
                        <p className="text-gray-600 mt-1.5 text-sm">{pagination.total} products found</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-sm hover:shadow active:scale-95"
                        >
                            <Sliders className="h-4 w-4 text-gray-700" />
                            <span className="text-gray-700">Filters</span>
                        </button>

                        <span className="text-sm text-gray-600 hidden sm:inline font-medium">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value)}
                            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] transition-all duration-150 shadow-sm cursor-pointer"
                        >
                            <option value="-createdAt">Newest</option>
                            <option value="popular">Popularity</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                </div>

                {/* Active Filter Chips */}
                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {activeFilters.map((filter, index) => (
                            <button
                                key={index}
                                onClick={() => removeFilter(filter.type, filter.value)}
                                className="group flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-purple-100/80 text-[#8b5cf6] px-3.5 py-1.5 rounded-full text-sm font-medium hover:from-purple-100 hover:to-purple-200 transition-all duration-150 shadow-sm hover:shadow border border-purple-200/50 hover:border-orange-300/50 active:scale-95"
                            >
                                <span>{filter.label}</span>
                                <X className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-150" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Results */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} variant="compact" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            {query ? 'No products found' : 'Start your search'}
                        </h2>
                        <p className="text-gray-500">
                            {query
                                ? 'Try different keywords or browse our categories'
                                : 'Enter a search term to find products'
                            }
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        onPageChange={(page) => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('page', page.toString());
                            router.push(`/search?${params.toString()}`);
                        }}
                        className="mt-8"
                    />
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <Suspense fallback={
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            }>
                <SearchContent />
            </Suspense>
        </div>
    );
}

