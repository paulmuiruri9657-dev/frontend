'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import { Product, Category, ProductFilters } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';

interface CategoryClientProps {
    initialData: {
        category: Category | null;
        products: Product[];
        brands: string[];
        pagination: { page: number; pages: number; total: number };
    };
    slug: string;
}

export default function CategoryClient({ initialData, slug }: CategoryClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { category, products, brands, pagination } = initialData;

    const [showFilters, setShowFilters] = useState(false);

    // Filter states initialized from URL params if present
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        searchParams.get('brand') ? searchParams.get('brand')!.split(',') : []
    );
    const [priceRange, setPriceRange] = useState({ 
        min: searchParams.get('minPrice') || '', 
        max: searchParams.get('maxPrice') || '' 
    });
    const [minRating, setMinRating] = useState<number | null>(
        searchParams.get('rating') ? parseFloat(searchParams.get('rating') as string) : null
    );
    const [sortBy, setSortBy] = useState((searchParams.get('sort') as string) || '-createdAt');

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (selectedBrands.length > 0) {
            params.set('brand', selectedBrands.join(','));
        }
        if (priceRange.min) params.set('minPrice', priceRange.min);
        if (priceRange.max) params.set('maxPrice', priceRange.max);
        if (minRating) params.set('rating', minRating.toString());
        if (sortBy !== '-createdAt') params.set('sort', sortBy);

        router.push(`/category/${slug}?${params.toString()}`);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setSelectedBrands([]);
        setPriceRange({ min: '', max: '' });
        setMinRating(null);
        setSortBy('-createdAt');
        router.push(`/category/${slug}`);
    };


    return (
        <div className="max-w-7xl mx-auto px-4 py-4">
            {/* SEO Breadcrumb Schema - Does not affect rendering */}
            {category && (
                <BreadcrumbSchema
                    items={[
                        { name: 'Home', url: 'https://ecoloop.co.ke' },
                        ...(category.breadcrumb?.map(crumb => ({
                            name: crumb.name,
                            url: `https://ecoloop.co.ke/category/${crumb.slug}`
                        })) || [{ name: category.name, url: `https://ecoloop.co.ke/category/${slug}` }])
                    ]}
                />
            )}

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-[#f68b1e]">Home</Link>
                <ChevronRight className="h-4 w-4" />
                {category?.breadcrumb?.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                        <Link href={`/category/${crumb.slug}`} className="hover:text-[#f68b1e]">
                            {crumb.name}
                        </Link>
                        {idx < (category.breadcrumb?.length || 0) - 1 && <ChevronRight className="h-4 w-4" />}
                    </React.Fragment>
                ))}
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{category?.name || 'Products'}</h1>
                <p className="text-gray-500">{pagination.total} products</p>
            </div>

            <div className="flex gap-6">
                {/* Filter Sidebar - Desktop */}
                <aside className="w-64 hidden lg:block">
                    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">Filters</h3>
                            <button onClick={clearFilters} className="text-sm text-[#f68b1e] hover:underline">
                                Clear all
                            </button>
                        </div>

                        {/* Brand Filter */}
                        {brands.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3">Brand</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {brands.map((brand) => (
                                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedBrands([...selectedBrands, brand]);
                                                    } else {
                                                        setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-[#f68b1e] focus:ring-[#f68b1e]"
                                            />
                                            <span className="text-sm">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Range */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-3">Price (KSh)</h4>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-3">Rating</h4>
                            <div className="space-y-2">
                                {[4, 3, 2, 1].map((rating) => (
                                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="rating"
                                            checked={minRating === rating}
                                            onChange={() => setMinRating(rating)}
                                            className="text-[#f68b1e] focus:ring-[#f68b1e]"
                                        />
                                        <span className="text-sm">{rating}+ Stars</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={applyFilters}
                            className="w-full bg-[#f68b1e] text-white py-2 rounded-lg font-bold hover:bg-[#e07e1b] transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    {/* Sort & Filter Mobile */}
                    <div className="flex items-center justify-between mb-4 bg-white rounded-lg shadow-sm p-3">
                        <button
                            onClick={() => setShowFilters(true)}
                            className="lg:hidden flex items-center gap-2 text-gray-700"
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                            Filters
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('sort', e.target.value);
                                    router.push(`/category/${slug}?${params.toString()}`);
                                }}
                                className="border border-gray-300 rounded px-3 py-1 text-sm"
                            >
                                <option value="-createdAt">Newest</option>
                                <option value="popular">Popularity</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>
                    </div>

                    {/* Products */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} showAddToCart={false} variant="compact" />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500">No products found</p>
                            <button onClick={clearFilters} className="mt-4 text-[#f68b1e] hover:underline">
                                Clear filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => (
                                <Link
                                    key={i + 1}
                                    href={`/category/${slug}?page=${i + 1}`}
                                    className={`px-4 py-2 rounded ${pagination.page === i + 1
                                        ? 'bg-[#f68b1e] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
                    <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-bold text-lg">Filters</h3>
                            <button onClick={() => setShowFilters(false)}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-4">
                            {/* Same filter content as desktop */}
                            {brands.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3">Brand</h4>
                                    <div className="space-y-2">
                                        {brands.map((brand) => (
                                            <label key={brand} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBrands.includes(brand)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedBrands([...selectedBrands, brand]);
                                                        } else {
                                                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                                        }
                                                    }}
                                                    className="rounded border-gray-300 text-[#f68b1e]"
                                                />
                                                <span className="text-sm">{brand}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={applyFilters}
                                className="w-full bg-[#f68b1e] text-white py-3 rounded-lg font-bold"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
