'use client';

import React, { useState } from 'react';
import { XCircle, Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

const faqs = [
    {
        q: 'Can I cancel an order after it has shipped?',
        a: 'Once an order has shipped, it cannot be cancelled. However, you can refuse the delivery when it arrives, or initiate a return after receiving it.'
    },
    {
        q: 'How long does it take to get a refund after cancellation?',
        a: 'Refunds for cancelled orders are processed within 3-5 business days. M-Pesa refunds are usually instant, while card refunds may take 5-7 business days to reflect.'
    },
    {
        q: 'Will I be charged for cancelling an order?',
        a: 'No, there are no cancellation fees. You will receive a full refund for any payment made.'
    },
    {
        q: 'Can I cancel part of my order?',
        a: 'Yes, if your order contains multiple items, you can cancel individual items before they ship. Go to My Orders, select the order, and cancel specific items.'
    }
];

export default function CancellationPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Order Cancellation</h1>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-[#8b5cf6]" />
                    Cancellation Policy
                </h2>

                <div className="space-y-4">
                    <p className="text-gray-600">
                        You can cancel your order <strong>before it ships</strong>. Once an order is shipped, cancellation is no longer possible, but you can return the item after delivery.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                            <h3 className="font-bold text-green-800">Can Cancel</h3>
                            <p className="text-sm text-green-600">Order Placed, Processing</p>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                            <h3 className="font-bold text-yellow-800">Contact Support</h3>
                            <p className="text-sm text-yellow-600">Ready to Ship</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <h3 className="font-bold text-red-800">Cannot Cancel</h3>
                            <p className="text-sm text-red-600">Shipped, Out for Delivery</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Cancel */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-[#8b5cf6]" />
                    How to Cancel an Order
                </h2>

                <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                            <h3 className="font-bold">Go to My Orders</h3>
                            <p className="text-gray-600 text-sm">Log in to your account and navigate to &quot;My Orders&quot; section.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                            <h3 className="font-bold">Find Your Order</h3>
                            <p className="text-gray-600 text-sm">Locate the order you want to cancel from your order list.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                            <h3 className="font-bold">Click Cancel Order</h3>
                            <p className="text-gray-600 text-sm">If eligible, you&apos;ll see a &quot;Cancel Order&quot; button. Click it to proceed.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                        <div>
                            <h3 className="font-bold">Select Reason & Confirm</h3>
                            <p className="text-gray-600 text-sm">Choose a cancellation reason and confirm. Your refund will be processed automatically.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-2">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg">
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                            >
                                <span className="font-medium">{faq.q}</span>
                                {openFaq === idx ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>
                            {openFaq === idx && (
                                <div className="px-4 pb-4 text-gray-600">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Need Help */}
            <div className="bg-gray-100 rounded-lg p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Unable to Cancel Online?</h2>
                <p className="text-gray-600 mb-6">Contact our support team for assistance with your cancellation</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/help/chat" className="bg-[#8b5cf6] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#7c3aed] transition-colors">
                        Chat with Us
                    </Link>
                    <a href="https://wa.me/254705424364" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-800 px-6 py-2 rounded-lg font-bold border border-gray-300 hover:bg-gray-50 transition-colors">
                        WhatsApp 0705424364
                    </a>
                </div>
            </div>
        </div>
    );
}

