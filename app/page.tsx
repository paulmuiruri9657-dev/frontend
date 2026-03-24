'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Sparkles, ChevronRight } from 'lucide-react';
import CategorySidebar from '@/components/CategorySidebar';
import HeroCarousel from '@/components/HeroCarousel';
import FlashSalesSection from '@/components/FlashSalesSection';
import CategoriesGridSection from '@/components/CategoriesGridSection';
import DealSection from '@/components/DealSection';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';
// Lazy load recommendations to improve initial load time
import dynamic from 'next/dynamic';
const ProductRecommendations = dynamic(() => import('@/components/ProductRecommendations'), {
    loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg my-8"></div>,
    ssr: false // Load on client side only for better TTI
});
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { Product, Category } from '@/types';
import { HomepageSkeleton } from '@/components/skeletons/HomepageSkeleton';

export default function Home() {
    const { addToCart } = useCartStore();
    const { user } = useAuth();
    const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
    const [flashSaleEndsAt, setFlashSaleEndsAt] = useState<string | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [homepageGroups, setHomepageGroups] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [topBrands, setTopBrands] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [flashSalesRes, productsRes, categoriesRes, brandsRes, homepageCatRes] = await Promise.all([
                    api.getFlashSales(),
                    api.getProducts({ limit: 50, sort: '-createdAt' }), // Sort by newest first
                    api.getCategories({ level: 0 }),
                    api.getBrands(),
                    api.getHomepageCategories()
                ]);

                setFlashSaleProducts(flashSalesRes.data || []);
                setFlashSaleEndsAt(flashSalesRes.endsAt);
                setAllProducts(productsRes.data || []);
                setHomepageGroups(homepageCatRes.data || []);
                setCategories(categoriesRes.data || []);

                // Get top 16 brands by product count
                const brands = brandsRes.data || [];
                const top16 = brands.slice(0, 16).map((b: any) => b.brand);
                setTopBrands(top16);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = async (product: Product) => {
        await addToCart(product._id, 1);
    };

    if (loading) {
        if (loading) {
            return <HomepageSkeleton />;
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-0 md:px-4">
            {/* Hero Section */}
            <div className="flex gap-0 md:gap-4 px-0 md:px-0">
                {/* Categories Sidebar - Hidden on mobile */}
                <div className="hidden md:block">
                    <CategorySidebar categories={categories} />
                </div>

                {/* Main Slider - Full width on mobile */}
                <div className="flex-1 w-full min-w-0">
                    <HeroCarousel />
                </div>
            </div>


            {/* Top Brands Section - Relocated & Enhanced */}
            {
                topBrands.length > 0 && (
                    <div className="max-w-7xl mx-auto px-0 md:px-4 my-0">


                        {/* Horizontal Scroll - Ultra Compact on Mobile */}
                        <div className="bg-transparent md:bg-white md:rounded-lg md:shadow-sm p-0 md:p-6 md:border md:border-gray-100">
                            <div className="relative group">
                                <div className="flex gap-0 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-0 md:px-0 py-1 md:pb-2 scrollbar-hide cursor-grab active:cursor-grabbing"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {/* All Brands - First Item */}
                                    <Link
                                        href="/brands"
                                        className="flex-shrink-0 snap-start flex items-center justify-center border-r border-t border-b border-gray-200 bg-black text-white p-2 md:p-6 hover:bg-gray-900 transition-all duration-300 min-w-[70px] md:min-w-[140px] h-9 md:h-auto group/card z-10"
                                    >
                                        <span className="text-[9px] md:text-sm font-black transition-colors text-center truncate w-full uppercase tracking-tighter">
                                            All Brands
                                        </span>
                                    </Link>

                                    {topBrands.map((brand) => (
                                        <Link
                                            key={brand}
                                            href={`/brand/${encodeURIComponent(brand)}`}
                                            className="flex-shrink-0 snap-start flex items-center justify-center border-r border-t border-b border-gray-200 bg-white p-2 md:p-6 hover:bg-purple-50 transition-all duration-300 min-w-[70px] md:min-w-[140px] h-9 md:h-auto group/card"
                                        >
                                            <span className="text-[9px] md:text-sm font-bold text-gray-700 group-hover/card:text-[#8b5cf6] transition-colors text-center truncate w-full">
                                                {brand}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Flash Sales Section */}
            {
                flashSaleProducts.length > 0 && (
                    <FlashSalesSection
                        products={flashSaleProducts}
                        endsAt={flashSaleEndsAt}
                        onAddToCart={handleAddToCart}
                    />
                )
            }



            {/* Top Selling Items */}
            {
                allProducts.length > 0 && (
                    <DealSection
                        title="Top Selling Items"
                        products={allProducts}
                        seeAllLink="/category/all"
                        onAddToCart={handleAddToCart}
                    />
                )
            }

            {/* Category-based Groups - Show all categories with products */}
            {
                homepageGroups.map((group) => {
                    if (!group.products || group.products.length === 0) return null;

                    return (
                        <DealSection
                            key={group.category._id}
                            title={`${group.category.name} Category`}
                            products={group.products}
                            category={group.category}
                            onAddToCart={handleAddToCart}
                        />
                    );
                })
            }

            {/* EcoLooP Official Banner */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-none md:rounded-lg shadow-lg p-3 md:p-4 text-white relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                            <Sparkles className="h-4 w-4" />
                            Official Store
                        </div>
                        <h2 className="text-xl md:text-2xl font-black">EcoLooP Official</h2>
                    </div>
                    <a
                        href="/official-store"
                        className="bg-white text-purple-600 px-6 py-2 rounded-xl font-bold hover:bg-purple-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                    >
                        Shop Now →
                    </a>
                </div>
            </div>



            {/* Personalized Recommendations (Signed-in only) */}
            {user && <ProductRecommendations type="personalized" limit={12} />}

            {/* Trending Products (Visible to all) */}
            <ProductRecommendations type="trending" limit={12} />
        </div>
    );
}
