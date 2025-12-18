'use client';

import React from 'react';
import { Truck, Clock, MapPin, Package, Shield, Zap } from 'lucide-react';

export default function ExpressPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4">
                <div className="bg-gradient-to-r from-[#8b5cf6] via-purple-600 to-yellow-500 text-white py-12 md:py-16 px-4 md:rounded-lg">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                            <Zap className="h-8 w-8 md:h-12 md:w-12" />
                            <h1 className="text-2xl md:text-4xl font-bold">EcoLooP Express</h1>
                        </div>
                        <p className="text-sm md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed">
                            Lightning-fast delivery for when you need it most. Get your orders delivered in as little as 24 hours!
                        </p>
                    </div>
                </div>
            </section>

            {/* Speed Benefits - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-10">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Express Delivery Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 md:p-6 text-center border border-purple-100">
                            <div className="bg-purple-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <Clock className="h-6 w-6 md:h-8 md:w-8 text-[#8b5cf6]" />
                            </div>
                            <h3 className="font-bold text-base md:text-lg mb-2">Same Day Delivery</h3>
                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                Order before 12 PM and get your items delivered the same day in Nairobi.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 md:p-6 text-center border border-purple-100">
                            <div className="bg-purple-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <Truck className="h-6 w-6 md:h-8 md:w-8 text-[#8b5cf6]" />
                            </div>
                            <h3 className="font-bold text-base md:text-lg mb-2">24-Hour Delivery</h3>
                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                Next-day delivery available for orders placed across major towns in Kenya.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 md:p-6 text-center border border-purple-100">
                            <div className="bg-purple-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <Shield className="h-6 w-6 md:h-8 md:w-8 text-[#8b5cf6]" />
                            </div>
                            <h3 className="font-bold text-base md:text-lg mb-2">Guaranteed Delivery</h3>
                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                Your order delivered on time or you get compensation. That&apos;s our promise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-0 md:py-4">
                <div className="bg-gradient-to-r from-purple-50 to-yellow-50 px-4 py-6 md:px-8 md:py-8 md:rounded-lg">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">How EcoLooP Express Works</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-2 md:mb-3">
                                1
                            </div>
                            <h4 className="font-bold text-sm md:text-base mb-1 md:mb-2">Shop</h4>
                            <p className="text-gray-600 text-xs md:text-sm">Browse products with Express badge</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-2 md:mb-3">
                                2
                            </div>
                            <h4 className="font-bold text-sm md:text-base mb-1 md:mb-2">Checkout</h4>
                            <p className="text-gray-600 text-xs md:text-sm">Select Express delivery</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-2 md:mb-3">
                                3
                            </div>
                            <h4 className="font-bold text-sm md:text-base mb-1 md:mb-2">Track</h4>
                            <p className="text-gray-600 text-xs md:text-sm">Monitor in real-time</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-2 md:mb-3">
                                4
                            </div>
                            <h4 className="font-bold text-sm md:text-base mb-1 md:mb-2">Receive</h4>
                            <p className="text-gray-600 text-xs md:text-sm">Lightning fast!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coverage Areas - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-8">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Express Delivery Coverage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Same-Day Subsection */}
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 md:p-6 border border-purple-100">
                            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2 text-[#8b5cf6]">
                                <MapPin className="h-5 w-5 md:h-6 md:w-6" /> Same-Day Delivery
                            </h3>
                            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                                    Nairobi CBD
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                                    Westlands
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                                    Parklands
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                                    Kilimani
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                                    Upperhill
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                                    Eastleigh
                                </li>
                            </ul>
                        </div>

                        {/* Next-Day Subsection */}
                        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-lg p-4 md:p-6 border border-yellow-100">
                            <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2 text-yellow-600">
                                <Package className="h-5 w-5 md:h-6 md:w-6" /> Next-Day Delivery
                            </h3>
                            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                                    Greater Nairobi
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                                    Mombasa
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                                    Kisumu
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                                    Nakuru
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                                    Eldoret
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                                    Thika
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 pb-0 md:pb-8">
                <div className="bg-gradient-to-r from-[#8b5cf6] to-orange-400 px-4 py-10 md:px-8 md:py-12 md:rounded-lg text-white text-center">
                    <Zap className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6" />
                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ready for Express Delivery?</h2>
                    <p className="text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto">
                        Look for the Express badge when shopping and enjoy lightning-fast delivery!
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-white text-[#8b5cf6] px-8 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-gray-100 transition-all hover:shadow-lg"
                    >
                        Shop Express Items
                    </a>
                </div>
            </section>
        </div>
    );
}
