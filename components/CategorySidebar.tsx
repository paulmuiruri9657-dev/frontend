'use client';

import React from 'react';
import Link from 'next/link';
import {
    Smartphone, Tv, Home as HomeIcon, Shirt, Gamepad2, Baby,
    ShoppingBag, Laptop, Car, Dumbbell, Sparkles, Grid3X3
} from 'lucide-react';
import { Category } from '@/types';

interface CategorySidebarProps {
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

export default function CategorySidebar({ categories }: CategorySidebarProps) {
    const displayCategories = categories?.length ? categories : defaultCategories;

    return (
        <div className="w-52 bg-white rounded-md shadow-sm hidden md:block h-full overflow-y-auto custom-scrollbar">
            <div className="py-2">
                {displayCategories.map((cat, idx) => {
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
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-50 hover:text-[#8b5cf6] text-gray-700 text-sm transition-colors group"
                        >
                            <span className="text-gray-500 group-hover:text-[#8b5cf6]">
                                {IconComponent ? (
                                    <IconComponent className="w-5 h-5" />
                                ) : (
                                    <span className="text-lg">{iconEmoji}</span>
                                )}
                            </span>
                            <span className="font-medium">{cat.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

