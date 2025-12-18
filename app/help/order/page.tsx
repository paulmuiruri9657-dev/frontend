'use client';

import React, { useState } from 'react';
import { Package, Search, MapPin, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const orderStatuses = [
    { status: 'Order Placed', icon: Package, description: 'Your order has been received' },
    { status: 'Processing', icon: Clock, description: 'We are preparing your order' },
    { status: 'Shipped', icon: Truck, description: 'Your order is on the way' },
    { status: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully' }
];

export default function OrderPage() {
    const [orderId, setOrderId] = useState('');
    const [trackingResult, setTrackingResult] = useState<null | 'found' | 'not_found'>(null);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId.trim()) {
            // Simulate tracking - in real app this would call API
            setTrackingResult(orderId.length > 5 ? 'found' : 'not_found');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Place & Track Order</h1>

            {/* Track Order Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Search className="h-6 w-6 text-[#8b5cf6]" />
                    Track Your Order
                </h2>

                <form onSubmit={handleTrack} className="flex gap-4 mb-6">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter your Order ID (e.g., ORD-123456)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                    />
                    <button
                        type="submit"
                        className="bg-[#8b5cf6] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#7c3aed] transition-colors"
                    >
                        Track
                    </button>
                </form>

                {trackingResult === 'found' && (
                    <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                        <h3 className="font-bold text-green-800 mb-4">Order Found: {orderId}</h3>
                        <div className="flex justify-between items-center">
                            {orderStatuses.map((item, idx) => (
                                <div key={item.status} className="flex flex-col items-center text-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx <= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs mt-2 font-medium">{item.status}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-4">
                            <strong>Estimated Delivery:</strong> December 15, 2024
                        </p>
                    </div>
                )}

                {trackingResult === 'not_found' && (
                    <div className="border border-red-200 bg-red-50 rounded-lg p-6 flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-red-800">Order Not Found</h3>
                            <p className="text-red-600 text-sm">
                                We couldn&apos;t find an order with ID &quot;{orderId}&quot;. Please check the ID and try again.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* How to Place an Order */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Package className="h-6 w-6 text-[#8b5cf6]" />
                    How to Place an Order
                </h2>

                <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                            <h3 className="font-bold">Browse & Add to Cart</h3>
                            <p className="text-gray-600 text-sm">Search or browse products, then click &quot;Add to Cart&quot; for items you want.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                            <h3 className="font-bold">Review Your Cart</h3>
                            <p className="text-gray-600 text-sm">Click the cart icon to review items, update quantities, or remove products.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                            <h3 className="font-bold">Checkout</h3>
                            <p className="text-gray-600 text-sm">Click &quot;Checkout&quot;, enter your delivery address, and select payment method.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                        <div>
                            <h3 className="font-bold">Complete Payment</h3>
                            <p className="text-gray-600 text-sm">Pay via M-Pesa, Card, or choose Cash on Delivery. You&apos;ll receive a confirmation.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Where to Find Order ID */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-[#8b5cf6]" />
                    Where to Find Your Order ID
                </h2>
                <ul className="space-y-2 text-gray-600">
                    <li>• Check your <strong>order confirmation email</strong></li>
                    <li>• Check your <strong>SMS notifications</strong></li>
                    <li>• Log in to your account and go to <strong>My Orders</strong></li>
                    <li>• The Order ID format is: <code className="bg-gray-100 px-2 py-1 rounded">ORD-XXXXXX</code></li>
                </ul>
            </div>

            {/* Need More Help */}
            <div className="bg-gray-100 rounded-lg p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Need More Help?</h2>
                <p className="text-gray-600 mb-6">Our support team is ready to assist you</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/help/chat" className="bg-[#8b5cf6] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#7c3aed] transition-colors">
                        Chat with Us
                    </Link>
                    <Link href="/contact" className="bg-white text-gray-800 px-6 py-2 rounded-lg font-bold border border-gray-300 hover:bg-gray-50 transition-colors">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}

