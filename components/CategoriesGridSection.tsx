'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Smartphone, Tv, Home as HomeIcon, Shirt, Gamepad2, Baby,
    ShoppingBag, Laptop, Car, Dumbbell, Sparkles, Grid3X3
} from 'lucide-react';
import { Category } from '@/types';

interface CategoriesGridSectionProps {
    categories?: Category[];
}

const defaultCategories = [
    { name: 'Phones & Tablets', slug: 'phones-tablets', icon: Smartphone },
    { name: 'Electronics', slug: 'electronics', icon: Tv },
    { name: 'Home & Office', slug: 'home-office', icon: HomeIcon },
    { name: 'Health & Beauty', slug: 'health-beauty', icon: Sparkles },
    { name: 'Fashion', slug: 'fashion', icon: Shirt },
    { name: 'Supermarket', slug: 'supermarket', icon: ShoppingBag },
    { name: 'Computing', slug: 'computing', icon: Laptop },
    { name: 'Gaming', slug: 'gaming', icon: Gamepad2 },
    { name: 'Baby Products', slug: 'baby-products', icon: Baby },
    { name: 'Sporting Goods', slug: 'sporting-goods', icon: Dumbbell },
    { name: 'Automobile', slug: 'automobile', icon: Car },
    { name: 'Other Categories', slug: 'other', icon: Grid3X3 },
];

export default function CategoriesGridSection({ categories }: CategoriesGridSectionProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const displayCategories = categories?.length ? categories : defaultCategories;
    const totalPages = Math.ceil(displayCategories.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCategories = displayCategories.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    if (!displayCategories || displayCategories.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-none md:rounded-lg shadow-sm overflow-hidden">
            {/* Ultra-Compact Header */}
            <div className="flex items-center justify-between px-2 md:px-6 py-1.5 md:py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                <h2 className="font-bold text-xs md:text-2xl text-gray-900">Shop by Category</h2>
                <Link
                    href="/categories"
                    className="text-[#8b5cf6] font-semibold text-[10px] md:text-base hover:underline flex items-center gap-0.5"
                >
                    All <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                </Link>
            </div>

            {/* Ultra-Compact Categories Grid */}
            <div className="p-1.5 md:p-6">
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-1.5 md:gap-4">
                    {currentCategories.map((cat, idx) => {
                        const IconComponent = 'icon' in cat && typeof cat.icon !== 'string'
                            ? cat.icon
                            : null;
                        const iconEmoji = 'icon' in cat && typeof cat.icon === 'string'
                            ? cat.icon
                            : null;

                        return (
                            <Link
                                key={idx}
                                href={`/category/${cat.slug}`}
                                className="flex flex-col items-center justify-center border border-gray-200 md:border-2 rounded md:rounded-lg p-1.5 md:p-6 hover:border-[#8b5cf6] hover:bg-purple-50 hover:shadow-lg transition-all duration-200 group bg-white"
                            >
                                <div className="text-gray-600 group-hover:text-[#8b5cf6] mb-1 md:mb-3 transition-colors">
                                    {IconComponent ? (
                                        <IconComponent className="w-5 h-5 md:w-12 md:h-12" />
                                    ) : (
                                        <span className="text-xl md:text-5xl">{iconEmoji}</span>
                                    )}
                                </div>
                                <span className="font-semibold text-[9px] md:text-sm text-gray-800 group-hover:text-[#8b5cf6] text-center leading-tight transition-colors">
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Ultra-Compact Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 md:gap-2 mt-2 md:mt-6">
                        {/* Previous Button */}
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-0.5 px-1.5 py-1 md:px-3 md:py-2 rounded md:rounded-lg font-semibold text-[10px] md:text-sm transition-all ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-300 md:border-2 text-gray-700 hover:border-[#8b5cf6] hover:bg-purple-50 hover:text-[#8b5cf6]'
                                }`}
                        >
                            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="hidden md:inline">Previous</span>
                        </button>

                        {/* Compact Page Numbers */}
                        <div className="flex gap-0.5 md:gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    className={`w-6 h-6 md:w-10 md:h-10 rounded md:rounded-lg font-bold text-[10px] md:text-sm transition-all ${currentPage === page
                                        ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white shadow'
                                        : 'bg-white border border-gray-300 md:border-2 text-gray-700 hover:border-[#8b5cf6] hover:bg-purple-50 hover:text-[#8b5cf6]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-0.5 px-1.5 py-1 md:px-3 md:py-2 rounded md:rounded-lg font-semibold text-[10px] md:text-sm transition-all ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-300 md:border-2 text-gray-700 hover:border-[#8b5cf6] hover:bg-purple-50 hover:text-[#8b5cf6]'
                                }`}
                        >
                            <span className="hidden md:inline">Next</span>
                            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
