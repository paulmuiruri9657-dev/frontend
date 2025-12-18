'use client';

import React, { useState } from 'react';
import { RotateCcw, Package, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Truck } from 'lucide-react';
import Link from 'next/link';

const returnableItems = [
    'Electronics (unopened or defective)',
    'Fashion items (with tags attached)',
    'Home & Kitchen items',
    'Books & Stationery',
    'Toys & Games'
];

const nonReturnableItems = [
    'Perishable goods (food, flowers)',
    'Personal care items (opened)',
    'Underwear & swimwear',
    'Customized/personalized items',
    'Downloaded software'
];

const faqs = [
    {
        q: 'How long do I have to return an item?',
        a: 'You have 7 days from the delivery date to initiate a return. Some items may have extended return windows during special promotions.'
    },
    {
        q: 'Do I have to pay for return shipping?',
        a: 'If the return is due to a defect or our error, return shipping is free. For change-of-mind returns, a pickup fee may apply.'
    },
    {
        q: 'How long does a refund take?',
        a: 'Once we receive and inspect the returned item, refunds are processed within 5-7 business days. M-Pesa refunds are faster, usually within 24-48 hours.'
    },
    {
        q: 'Can I exchange instead of returning?',
        a: 'Yes! For size/color exchanges, you can request an exchange during the return process. Subject to stock availability.'
    },
    {
        q: 'What if my item arrives damaged?',
        a: 'Report damaged items within 24 hours of delivery with photos. We will arrange a free return pickup and send a replacement or refund.'
    }
];

export default function ReturnsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Returns & Refunds</h1>

            {/* Return Policy Overview */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <RotateCcw className="h-6 w-6 text-[#8b5cf6]" />
                    Return Policy
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800">
                        <strong>7-Day Returns:</strong> Return most items within 7 days of delivery for a full refund.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" /> Returnable Items
                        </h3>
                        <ul className="space-y-2">
                            {returnableItems.map((item, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                                    <span className="text-green-500">✓</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" /> Non-Returnable Items
                        </h3>
                        <ul className="space-y-2">
                            {nonReturnableItems.map((item, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                                    <span className="text-red-500">✗</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* How to Return */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Package className="h-6 w-6 text-[#8b5cf6]" />
                    How to Return an Item
                </h2>

                <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                            <h3 className="font-bold">Request a Return</h3>
                            <p className="text-gray-600 text-sm">Go to My Orders, find your order, and click &quot;Request Return&quot;.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                            <h3 className="font-bold">Select Return Reason</h3>
                            <p className="text-gray-600 text-sm">Choose why you&apos;re returning (wrong item, defective, changed mind, etc.).</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                            <h3 className="font-bold">Choose Return Method</h3>
                            <p className="text-gray-600 text-sm">Schedule a pickup or drop off at a nearby pickup station.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                        <div>
                            <h3 className="font-bold">Pack the Item</h3>
                            <p className="text-gray-600 text-sm">Use original packaging if possible. Include all accessories and tags.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                        <div>
                            <h3 className="font-bold">Receive Refund</h3>
                            <p className="text-gray-600 text-sm">Once we receive & inspect the item, your refund will be processed.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-[#8b5cf6]" />
                    Refund Timeline
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3 font-bold">Payment Method</th>
                                <th className="text-left p-3 font-bold">Refund Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="p-3">M-Pesa</td>
                                <td className="p-3 text-green-600 font-medium">24-48 hours</td>
                            </tr>
                            <tr>
                                <td className="p-3">Airtel Money</td>
                                <td className="p-3">24-48 hours</td>
                            </tr>
                            <tr>
                                <td className="p-3">Credit/Debit Card</td>
                                <td className="p-3">5-7 business days</td>
                            </tr>
                            <tr>
                                <td className="p-3">EcoLooP Store Credit</td>
                                <td className="p-3 text-green-600 font-medium">Instant</td>
                            </tr>
                        </tbody>
                    </table>
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
                <h2 className="text-xl font-bold mb-4">Need Help with a Return?</h2>
                <p className="text-gray-600 mb-6">Our support team is here to assist you</p>
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

