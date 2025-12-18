'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Sparkles, Eye } from 'lucide-react';

export default function EnhancementsTestPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Premium Visual Enhancements
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                    Testing all CSS-only visual improvements
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Sparkles className="h-4 w-4 text-[#8b5cf6]" />
                    <span>Futuristic • Premium • Enterprise-Grade</span>
                </div>
            </div>

            {/* Enhancement Showcase */}
            <div className="grid gap-8 mb-12">
                {/* Gradient Text */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h2 className="text-xl font-bold">Gradient Text Headings</h2>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                            Main Gradient Heading
                        </h3>
                        <h4 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Secondary Gradient Heading
                        </h4>
                        <p className="text-sm text-gray-600">Used in: Search, Cart, Wishlist, Sell pages</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h2 className="text-xl font-bold">Enhanced Buttons</h2>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-gradient-to-r from-[#8b5cf6] to-[#f7941d] text-white px-6 py-3 rounded-lg hover:from-[#7c3aed] hover:to-[#e8851c] transition-all duration-150 font-semibold shadow-md hover:shadow-lg active:scale-95">
                            Primary Button
                        </button>
                        <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 font-medium shadow-sm hover:shadow active:scale-95">
                            Secondary Button
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-150 active:scale-95">
                            Delete Button
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Features: Gradient backgrounds, shadow progression, active scale</p>
                </div>

                {/* Cards */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h2 className="text-xl font-bold">Enhanced Cards</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-150 p-4 border border-gray-100/50 hover:border-gray-200/80 hover:-translate-y-1 cursor-pointer">
                            <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg mb-3"></div>
                            <h3 className="font-semibold mb-2">Product Card</h3>
                            <p className="text-sm text-gray-600">Hover to see lift effect</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-150 p-4 border border-gray-100/50 hover:border-gray-200/80 hover:-translate-y-1 cursor-pointer">
                            <div className="w-full h-32 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg mb-3"></div>
                            <h3 className="font-semibold mb-2">Filter Card</h3>
                            <p className="text-sm text-gray-600">Enhanced shadows</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-150 p-4 border border-gray-100/50 hover:border-gray-200/80 hover:-translate-y-1 cursor-pointer">
                            <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg mb-3"></div>
                            <h3 className="font-semibold mb-2">Info Card</h3>
                            <p className="text-sm text-gray-600">Refined borders</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Features: Hover lift, shadow progression, refined borders</p>
                </div>

                {/* Filter Chips */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h2 className="text-xl font-bold">Filter Chips</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button className="group flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-purple-100/80 text-[#8b5cf6] px-3.5 py-1.5 rounded-full text-sm font-medium hover:from-purple-100 hover:to-purple-200 transition-all duration-150 shadow-sm hover:shadow border border-purple-200/50 hover:border-orange-300/50 active:scale-95">
                            <span>Electronics</span>
                            <span className="group-hover:rotate-90 transition-transform duration-150">×</span>
                        </button>
                        <button className="group flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-purple-100/80 text-[#8b5cf6] px-3.5 py-1.5 rounded-full text-sm font-medium hover:from-purple-100 hover:to-purple-200 transition-all duration-150 shadow-sm hover:shadow border border-purple-200/50 hover:border-orange-300/50 active:scale-95">
                            <span>KSh 1,000 - 50,000</span>
                            <span className="group-hover:rotate-90 transition-transform duration-150">×</span>
                        </button>
                        <button className="group flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-purple-100/80 text-[#8b5cf6] px-3.5 py-1.5 rounded-full text-sm font-medium hover:from-purple-100 hover:to-purple-200 transition-all duration-150 shadow-sm hover:shadow border border-purple-200/50 hover:border-orange-300/50 active:scale-95">
                            <span>Nairobi</span>
                            <span className="group-hover:rotate-90 transition-transform duration-150">×</span>
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Features: Gradient backgrounds, rotating X on hover, active scale</p>
                </div>

                {/* Form Elements */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h2 className="text-xl font-bold">Enhanced Form Elements</h2>
                    </div>
                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium mb-2">Text Input</label>
                            <input
                                type="text"
                                placeholder="Enhanced input field"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] transition-all duration-150 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Dropdown</label>
                            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] text-sm bg-white hover:border-gray-300 transition-all duration-150 cursor-pointer shadow-sm">
                                <option>Select an option</option>
                                <option>Option 1</option>
                                <option>Option 2</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Features: Refined borders, enhanced focus rings, shadow effects</p>
                </div>

                {/* Badges */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h2 className="text-xl font-bold">Enhanced Badges</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="bg-gradient-to-r from-[#8b5cf6] to-[#f7941d] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
                            -25% OFF
                        </div>
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                            Official Store
                        </div>
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                            ⚡ Flash Sale
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Features: Gradient backgrounds, enhanced shadows</p>
                </div>
            </div>

            {/* Navigation to Enhanced Pages */}
            <div className="bg-gradient-to-b from-gray-50/50 to-white rounded-xl shadow-lg border border-gray-100/50 p-8">
                <div className="flex items-center gap-2 mb-6">
                    <Eye className="h-6 w-6 text-[#8b5cf6]" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        View Enhanced Pages
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/search"
                        className="bg-white border border-gray-200 text-center py-4 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-sm hover:shadow active:scale-95 font-medium"
                    >
                        Search Page
                    </Link>
                    <Link
                        href="/cart"
                        className="bg-white border border-gray-200 text-center py-4 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-sm hover:shadow active:scale-95 font-medium"
                    >
                        Cart Page
                    </Link>
                    <Link
                        href="/wishlist"
                        className="bg-white border border-gray-200 text-center py-4 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-sm hover:shadow active:scale-95 font-medium"
                    >
                        Wishlist Page
                    </Link>
                    <Link
                        href="/sell"
                        className="bg-white border border-gray-200 text-center py-4 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-sm hover:shadow active:scale-95 font-medium"
                    >
                        Sell Page
                    </Link>
                </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#8b5cf6] hover:text-[#7c3aed] transition-colors duration-150 font-medium"
                >
                    ← Back to Homepage
                </Link>
            </div>
        </div>
    );
}

