'use client';

import React from 'react';
import { Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function ReturnPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Return & Refund Policy</h1>
                    <p className="text-blue-100">Your satisfaction is our priority</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Overview */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Return Policy Overview</h2>
                    <p className="text-gray-700 mb-4">
                        We want you to be completely satisfied with your purchase. If you're not happy with your order,
                        you can return it within <strong>30 days</strong> of delivery for a full refund or exchange.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                            <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900">30-Day Window</h3>
                                <p className="text-sm text-gray-600">Return within 30 days of delivery</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                            <Package className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Original Condition</h3>
                                <p className="text-sm text-gray-600">Unopened with tags attached</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                            <RefreshCw className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Full Refund</h3>
                                <p className="text-sm text-gray-600">Money back or exchange</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Eligibility */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        Return Eligibility
                    </h2>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>Item must be in original condition with all tags and packaging</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>Return must be initiated within 30 days of delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>Proof of purchase (order number) required</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>Item not damaged due to misuse or accident</span>
                        </li>
                    </ul>
                </div>

                {/* Non-Returnable Items */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <XCircle className="h-6 w-6 text-red-600" />
                        Non-Returnable Items
                    </h2>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">✗</span>
                            <span>Opened hygiene products (cosmetics, personal care items)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">✗</span>
                            <span>Perishable goods (food, flowers)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">✗</span>
                            <span>Customized or personalized items</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">✗</span>
                            <span>Downloadable software or digital products</span>
                        </li>
                    </ul>
                </div>

                {/* Return Process */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">How to Return an Item</h2>
                    <div className="space-y-4">
                        {[
                            { step: 1, title: 'Initiate Return', desc: 'Go to your order history and select the item you want to return' },
                            { step: 2, title: 'Select Reason', desc: 'Choose a reason for the return and provide any additional details' },
                            { step: 3, title: 'Submit Request', desc: 'Submit your return request and wait for approval (usually within 24-48 hours)' },
                            { step: 4, title: 'Pack & Ship', desc: 'Once approved, pack the item safely and ship it to the provided address' },
                            { step: 5, title: 'Receive Refund', desc: 'Refund will be processed within 5-7 business days after we receive the item' }
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Refund Information */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Refund Information</h2>
                    <div className="space-y-3 text-gray-700">
                        <p>
                            <strong>Refund Method:</strong> Refunds will be issued to the original payment method used for the purchase.
                        </p>
                        <p>
                            <strong>Processing Time:</strong> Please allow 5-7 business days for the refund to appear in your account after we receive and inspect the returned item.
                        </p>
                        <p>
                            <strong>Shipping Costs:</strong> Original shipping costs are non-refundable. Return shipping costs are the responsibility of the customer unless the return is due to our error.
                        </p>
                    </div>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
                    <p className="mb-4">Our customer service team is here to assist you with any return-related questions.</p>
                    <div className="space-y-2">
                        <p>📧 Email: returns@ecoloopke.com</p>
                        <p>📞 Phone: +254 700 123 456</p>
                        <p>⏰ Hours: Monday - Friday, 8AM - 6PM EAT</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
