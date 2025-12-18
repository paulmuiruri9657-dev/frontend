'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton';
import {
    Search, Filter, X, ChevronDown, ChevronUp, Grid, List,
    TrendingUp, DollarSign, MapPin, Star, Package, User
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

interface Filters {
    search: string;
    priceMin: string;
    priceMax: string;
    brands: string[];
    categories: string[];
    locations: string[];
    condition: string[];
    minRating: number;
    inStockOnly: boolean;
    sort: string;
}

function OfficialStoreContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToCart } = useCartStore();

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [filters, setFilters] = useState<Filters>({
        search: searchParams.get('q') || '',
        priceMin: '',
        priceMax: '',
        brands: [],
        categories: [],
        locations: [],
        condition: [],
        minRating: 0,
        inStockOnly: false,
        sort: 'newest'
    });

    // Available filter options
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [availableLocations, setAvailableLocations] = useState<string[]>([]);

    // Filter panel state
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        price: true,
        brand: true,
        category: false,
        location: false,
        condition: false,
        rating: false
    });

    // Fetch products and extract filter options
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await api.getProducts({ limit: 1000 }); // Get all for deep filtering
                const allProducts = response.data || [];
                setProducts(allProducts);

                // Extract unique values for filters
                const brands = [...new Set(allProducts.map((p: Product) => p.brand))].filter(Boolean).sort();
                const locations = [...new Set(allProducts.map((p: Product) => p.location))].filter(Boolean).sort();

                setAvailableBrands(brands as string[]);
                setAvailableLocations(locations as string[]);

            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Deep search and filter function
    const applyFiltersAndSearch = useCallback(() => {
        let result = [...products];

        // Live search across multiple fields
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(product => {
                const searchableFields = [
                    product.title,
                    product.brand,
                    product.description,
                    product.location || '',
                    product.seller?.name || '',
                ].map(field => (field || '').toLowerCase());

                return searchableFields.some(field => field.includes(searchLower));
            });
        }

        // Price range filter
        if (filters.priceMin) {
            result = result.filter(p => p.price >= parseFloat(filters.priceMin));
        }
        if (filters.priceMax) {
            result = result.filter(p => p.price <= parseFloat(filters.priceMax));
        }

        // Brand filter
        if (filters.brands.length > 0) {
            result = result.filter(p => filters.brands.includes(p.brand));
        }

        // Location filter
        if (filters.locations.length > 0) {
            result = result.filter(p => filters.locations.includes(p.location || ''));
        }

        // Condition filter
        if (filters.condition.length > 0) {
            result = result.filter(p => filters.condition.includes(p.condition));
        }

        // Rating filter
        if (filters.minRating > 0) {
            result = result.filter(p => p.rating >= filters.minRating);
        }

        // Stock filter
        if (filters.inStockOnly) {
            result = result.filter(p => p.stock > 0);
        }

        // Sort
        switch (filters.sort) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                result.sort((a, b) => b.sold - a.sold);
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        setFilteredProducts(result);
        setTotalPages(Math.ceil(result.length / 30));
        setPage(1);
    }, [products, filters]);

    // Apply filters whenever they change
    useEffect(() => {
        applyFiltersAndSearch();
    }, [applyFiltersAndSearch]);

    // Paginated products
    const displayedProducts = filteredProducts.slice((page - 1) * 30, page * 30);

    // Toggle filter section
    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            search: '',
            priceMin: '',
            priceMax: '',
            brands: [],
            categories: [],
            locations: [],
            condition: [],
            minRating: 0,
            inStockOnly: false,
            sort: 'newest'
        });
    };

    // Get active filter count
    const activeFilterCount =
        (filters.priceMin ? 1 : 0) +
        (filters.priceMax ? 1 : 0) +
        filters.brands.length +
        filters.locations.length +
        filters.condition.length +
        (filters.minRating > 0 ? 1 : 0) +
        (filters.inStockOnly ? 1 : 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                {/* Skeleton Hero */}
                <div className="relative h-48 bg-gray-900/10 animate-pulse mb-6"></div>

                <div className="max-w-7xl mx-auto px-4">
                    {/* Skeleton Toolbar */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex gap-4 animate-pulse">
                        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
                    </div>

                    <div className="flex gap-6">
                        {/* Skeleton Sidebar */}
                        <div className="hidden lg:block w-80 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-md p-6 h-[600px] animate-pulse"></div>
                        </div>

                        {/* Skeleton Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Hero Section */}
            <div className="text-white relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://wallpaperbat.com/img/160564-hd-nature-wallpaper.jpg"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-blue-900/80"></div>
                </div>

                {/* Floating Light Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-60 animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                            }}
                        ></div>
                    ))}
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-4 md:py-6">
                    <h1 className="text-2xl md:text-3xl font-black mb-4 text-center drop-shadow-lg">
                        EcoLooP Official Store
                    </h1>

                    {/* Live Search Bar */}
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, brand, location, seller, description..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 border-2 border-white/50 focus:border-white focus:outline-none focus:ring-4 focus:ring-white/20 text-lg shadow-2xl transition-all"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* CSS for particle animation */}
                <style jsx>{`
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0) translateX(0);
                            opacity: 0.3;
                        }
                        25% {
                            transform: translateY(-20px) translateX(10px);
                            opacity: 0.6;
                        }
                        50% {
                            transform: translateY(-40px) translateX(-10px);
                            opacity: 0.8;
                        }
                        75% {
                            transform: translateY(-20px) translateX(15px);
                            opacity: 0.6;
                        }
                    }
                    .animate-float {
                        animation: float linear infinite;
                    }
                `}</style>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Toolbar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed] transition-colors font-semibold"
                        >
                            <Filter className="h-5 w-5" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-white text-[#8b5cf6] px-2 py-0.5 rounded-full text-sm font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <div className="text-sm text-gray-600 font-semibold">
                            {filteredProducts.length.toLocaleString()} products found
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Sort */}
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#8b5cf6] focus:outline-none font-semibold text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                            <option value="popular">Most Popular</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                            >
                                <Grid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Filter Sidebar */}
                    {filterPanelOpen && (
                        <div className="w-80 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">Filters</h2>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[#8b5cf6] hover:text-[#7c3aed] font-semibold"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6 border-b pb-4">
                                    <button
                                        onClick={() => toggleSection('price')}
                                        className="flex items-center justify-between w-full mb-3 font-semibold"
                                    >
                                        <span className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Price Range
                                        </span>
                                        {expandedSections.price ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </button>
                                    {expandedSections.price && (
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={filters.priceMin}
                                                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                                                className="w-full px-3 py-2 border rounded-lg focus:border-[#8b5cf6] focus:outline-none"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={filters.priceMax}
                                                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                                                className="w-full px-3 py-2 border rounded-lg focus:border-[#8b5cf6] focus:outline-none"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Brands */}
                                <div className="mb-6 border-b pb-4">
                                    <button
                                        onClick={() => toggleSection('brand')}
                                        className="flex items-center justify-between w-full mb-3 font-semibold"
                                    >
                                        <span>Brands ({availableBrands.length})</span>
                                        {expandedSections.brand ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </button>
                                    {expandedSections.brand && (
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {availableBrands.slice(0, 15).map(brand => (
                                                <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-1 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.brands.includes(brand)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFilters(prev => ({ ...prev, brands: [...prev.brands, brand] }));
                                                            } else {
                                                                setFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }));
                                                            }
                                                        }}
                                                        className="rounded border-gray-300 text-[#8b5cf6] focus:ring-[#8b5cf6]"
                                                    />
                                                    <span className="text-sm">{brand}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="mb-6 border-b pb-4">
                                    <button
                                        onClick={() => toggleSection('location')}
                                        className="flex items-center justify-between w-full mb-3 font-semibold"
                                    >
                                        <span className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Location
                                        </span>
                                        {expandedSections.location ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </button>
                                    {expandedSections.location && (
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {availableLocations.map(location => (
                                                <label key={location} className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-1 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.locations.includes(location)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFilters(prev => ({ ...prev, locations: [...prev.locations, location] }));
                                                            } else {
                                                                setFilters(prev => ({ ...prev, locations: prev.locations.filter(l => l !== location) }));
                                                            }
                                                        }}
                                                        className="rounded border-gray-300 text-[#8b5cf6] focus:ring-[#8b5cf6]"
                                                    />
                                                    <span className="text-sm">{location}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Condition */}
                                <div className="mb-6 border-b pb-4">
                                    <button
                                        onClick={() => toggleSection('condition')}
                                        className="flex items-center justify-between w-full mb-3 font-semibold"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Condition
                                        </span>
                                        {expandedSections.condition ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </button>
                                    {expandedSections.condition && (
                                        <div className="space-y-2">
                                            {['new', 'used', 'refurbished'].map(condition => (
                                                <label key={condition} className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-1 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.condition.includes(condition)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFilters(prev => ({ ...prev, condition: [...prev.condition, condition] }));
                                                            } else {
                                                                setFilters(prev => ({ ...prev, condition: prev.condition.filter(c => c !== condition) }));
                                                            }
                                                        }}
                                                        className="rounded border-gray-300 text-[#8b5cf6] focus:ring-[#8b5cf6]"
                                                    />
                                                    <span className="text-sm capitalize">{condition}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="mb-6 border-b pb-4">
                                    <button
                                        onClick={() => toggleSection('rating')}
                                        className="flex items-center justify-between w-full mb-3 font-semibold"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Star className="h-5 w-5" />
                                            Rating
                                        </span>
                                        {expandedSections.rating ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </button>
                                    {expandedSections.rating && (
                                        <div className="space-y-2">
                                            {[4, 3, 2, 1].map(rating => (
                                                <button
                                                    key={rating}
                                                    onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${filters.minRating === rating
                                                        ? 'bg-[#8b5cf6] text-white'
                                                        : 'hover:bg-purple-50'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-1">
                                                        {rating}+ <Star className="h-4 w-4 fill-current" />
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* In Stock Only */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStockOnly}
                                        onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                                        className="rounded border-gray-300 text-[#8b5cf6] focus:ring-[#8b5cf6]"
                                    />
                                    <span className="font-semibold">In Stock Only</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Products Grid/List */}
                    <div className="flex-1">
                        {displayedProducts.length > 0 ? (
                            <>
                                <div className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                                        : 'space-y-4'
                                }>
                                    {displayedProducts.map(product => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            variant="compact"
                                            onAddToCart={async () => {
                                                await addToCart(product._id, 1);
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center gap-2">
                                        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${p === page
                                                    ? 'bg-[#8b5cf6] text-white'
                                                    : 'bg-white hover:bg-purple-50'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl">
                                <Search className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-[#8b5cf6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7c3aed] transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OfficialStorePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8b5cf6] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 font-semibold">Loading Official Store...</p>
                </div>
            </div>
        }>
            <OfficialStoreContent />
        </Suspense>
    );
}
