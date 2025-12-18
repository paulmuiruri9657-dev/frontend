'use client';

import React from 'react';
import {
    LayoutDashboard, Package, TrendingUp, BarChart3, Settings,
    ShoppingBag, Truck, MessageSquare, DollarSign, Users
} from 'lucide-react';
import Link from 'next/link';

const businessTools = [
    { icon: LayoutDashboard, title: 'Dashboard', desc: 'Complete overview of business performance', color: 'blue' },
    { icon: Package, title: 'Product Management', desc: 'Add, edit and manage product listings', color: 'purple' },
    { icon: ShoppingBag, title: 'Order Management', desc: 'Track and fulfill orders efficiently', color: 'green' }
];

const analyticsTools = [
    { icon: TrendingUp, title: 'Sales Analytics', desc: 'Detailed insights into sales and trends', color: 'orange' },
    { icon: BarChart3, title: 'Performance Reports', desc: 'Weekly and monthly summaries', color: 'cyan' },
    { icon: DollarSign, title: 'Financial Reports', desc: 'Track payments and earnings', color: 'yellow' }
];

const operationsTools = [
    { icon: Truck, title: 'Shipping Management', desc: 'Manage logistics and shipments', color: 'indigo' },
    { icon: MessageSquare, title: 'Customer Messages', desc: 'Respond to inquiries quickly', color: 'pink' }
];

export default function VendorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 md:py-16 px-4 md:rounded-lg">
                    <div className="max-w-4xl mx-auto text-center">
                        <LayoutDashboard className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6" />
                        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">EcoLooP Vendor Hub</h1>
                        <p className="text-sm md:text-xl text-white/95 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
                            Your all-in-one platform to manage and grow your business on EcoLooP
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
                            <a
                                href="/vendor"
                                target="_blank"
                                className="bg-white text-blue-600 px-6 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-gray-100 transition-all hover:shadow-lg"
                            >
                                Access Vendor Hub
                            </a>
                            <Link
                                href="/sell"
                                className="border-2 border-white text-white px-6 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-white/10 transition-all"
                            >
                                Become a Seller
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Management Tools - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-10">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                        <Users className="h-6 w-6 md:h-7 md:w-7 inline mr-2 text-blue-600" />
                        Business Management
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {businessTools.map((feature, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 md:p-6 border border-blue-100 hover:shadow-md transition-shadow">
                                <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-blue-600 mb-3 md:mb-4" />
                                <h3 className="font-bold text-base md:text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Analytics & Insights - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-0 md:py-4">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-6 md:px-8 md:py-8 md:rounded-lg">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                        <BarChart3 className="h-6 w-6 md:h-7 md:w-7 inline mr-2 text-orange-600" />
                        Analytics & Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {analyticsTools.map((feature, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 md:p-6 border border-orange-100 hover:shadow-md transition-shadow">
                                <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-orange-600 mb-3 md:mb-4" />
                                <h3 className="font-bold text-base md:text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Operations - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-8">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                        <Truck className="h-6 w-6 md:h-7 md:w-7 inline mr-2 text-indigo-600" />
                        Operations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {operationsTools.map((feature, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 md:p-6 border border-indigo-100 hover:shadow-md transition-shadow">
                                <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-indigo-600 mb-3 md:mb-4" />
                                <h3 className="font-bold text-base md:text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dashboard Preview - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-0 md:py-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-6 md:px-8 md:py-8 md:rounded-lg">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Dashboard Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-green-100">
                            <p className="text-xs md:text-sm text-green-600 mb-1">Today&apos;s Orders</p>
                            <p className="text-xl md:text-2xl font-bold text-green-700">24</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100">
                            <p className="text-xs md:text-sm text-blue-600 mb-1">Pending Shipments</p>
                            <p className="text-xl md:text-2xl font-bold text-blue-700">8</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-orange-100">
                            <p className="text-xs md:text-sm text-orange-600 mb-1">Week Revenue</p>
                            <p className="text-xl md:text-2xl font-bold text-orange-700">45K</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-purple-100">
                            <p className="text-xs md:text-sm text-purple-600 mb-1">Rating</p>
                            <p className="text-xl md:text-2xl font-bold text-purple-700">4.8/5</p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-center text-xs md:text-sm">
                        Sample dashboard view. Access your real dashboard by logging into Vendor Hub.
                    </p>
                </div>
            </section>

            {/* Training Resources - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-8">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Training & Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-base md:text-lg mb-2">📚 Seller Academy</h3>
                            <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                                Free courses on product photography, pricing, and customer service.
                            </p>
                            <a href="#" className="text-blue-600 font-semibold text-xs md:text-sm hover:underline">Start Learning →</a>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-base md:text-lg mb-2">📊 Best Practices</h3>
                            <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                                Tips from top sellers on how to increase sales and ratings.
                            </p>
                            <a href="#" className="text-blue-600 font-semibold text-xs md:text-sm hover:underline">Read Tips →</a>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-base md:text-lg mb-2">🎯 Success Stories</h3>
                            <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                                Inspiring stories from sellers who grew their business on EcoLooP.
                            </p>
                            <a href="#" className="text-blue-600 font-semibold text-xs md:text-sm hover:underline">Read Stories →</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support CTA - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 pb-0 md:pb-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-10 md:px-8 md:py-12 md:rounded-lg text-white text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Need Help?</h2>
                    <p className="text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto">
                        Our seller support team is available Monday to Saturday, 8am - 6pm.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
                        <a href="/help" className="bg-white text-blue-600 px-6 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-gray-100 transition-all hover:shadow-lg">
                            Visit Help Center
                        </a>
                        <a href="/contact" className="border-2 border-white text-white px-6 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-white/10 transition-all">
                            Contact Support
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
