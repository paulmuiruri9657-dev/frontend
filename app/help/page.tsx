'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, ChevronDown, ChevronUp, Search, Package, CreditCard, Truck, RotateCcw, Shield } from 'lucide-react';

const faqs = [
    {
        category: 'Orders',
        icon: Package,
        questions: [
            {
                q: 'How do I place an order?',
                a: 'Browse products, add items to your cart, and proceed to checkout. You can pay via M-Pesa, card, or cash on delivery.'
            },
            {
                q: 'Can I cancel my order?',
                a: 'Yes, you can cancel your order before it ships. Go to My Orders and click Cancel on the order you want to cancel.'
            },
            {
                q: 'How do I track my order?',
                a: 'Go to My Orders in your account. Click on any order to see its current status and tracking information.'
            }
        ]
    },
    {
        category: 'Payment',
        icon: CreditCard,
        questions: [
            {
                q: 'What payment methods do you accept?',
                a: 'We accept M-Pesa, Airtel Money, Visa, Mastercard, and Cash on Delivery (COD) for select areas.'
            },
            {
                q: 'Is it safe to pay online?',
                a: 'Yes! All transactions are encrypted with SSL technology. Your payment information is never stored on our servers.'
            }
        ]
    },
    {
        category: 'Delivery',
        icon: Truck,
        questions: [
            {
                q: 'How long does delivery take?',
                a: 'Delivery times vary: Nairobi (1-3 days), Major towns (3-5 days), Rural areas (5-7 days).'
            },
            {
                q: 'How much is shipping?',
                a: 'Shipping costs start from KSh 200 depending on your location and order size. Some items have free delivery.'
            }
        ]
    },
    {
        category: 'Returns & Refunds',
        icon: RotateCcw,
        questions: [
            {
                q: 'What is your return policy?',
                a: 'You can return most items within 7 days of delivery. Items must be unused and in original packaging.'
            },
            {
                q: 'How do I request a refund?',
                a: 'Initiate a return request from your order history. Once we receive and inspect the item, refunds are processed within 5-7 business days.'
            }
        ]
    },
    {
        category: 'Warranty',
        icon: Shield,
        questions: [
            {
                q: 'Do products come with warranty?',
                a: 'Many products include manufacturer warranty. Warranty details are displayed on each product page.'
            },
            {
                q: 'How do I claim warranty?',
                a: 'Contact our support team with your order details and proof of purchase. We will guide you through the warranty claim process.'
            }
        ]
    }
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero & Search - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4">
                <div className="bg-gradient-to-r from-[#8b5cf6] to-cyan-600 text-white py-12 md:py-16 px-4 md:rounded-lg">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4">Help Center</h1>
                        <p className="text-sm md:text-base text-white/95 text-center mb-6 md:mb-8">How can we help you today?</p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for help..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 text-sm md:text-base text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Get In Touch - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-10">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Get In Touch</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 md:p-6 text-center hover:shadow-md transition-shadow border border-purple-100">
                            <div className="bg-purple-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <Phone className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6]" />
                            </div>
                            <h3 className="font-bold text-sm md:text-base mb-2">Call Us</h3>
                            <a
                                href="https://wa.me/254705424364"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8b5cf6] font-bold text-sm md:text-base hover:underline"
                            >
                                0705424364
                            </a>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Mon-Sat: 8am - 6pm</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 md:p-6 text-center hover:shadow-md transition-shadow border border-purple-100">
                            <div className="bg-purple-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6]" />
                            </div>
                            <h3 className="font-bold text-sm md:text-base mb-2">Live Chat</h3>
                            <button className="text-[#8b5cf6] font-bold text-sm md:text-base hover:underline">Start Chat</button>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Available 24/7</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 md:p-6 text-center hover:shadow-md transition-shadow border border-purple-100">
                            <div className="bg-purple-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <Mail className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6]" />
                            </div>
                            <h3 className="font-bold text-sm md:text-base mb-2">Email Us</h3>
                            <a href="mailto:ecoloopke@gmail.com" className="text-[#8b5cf6] font-bold text-sm md:text-base hover:underline break-all">
                                ecoloopke@gmail.com
                            </a>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Reply within 24 hours</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Categories - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 pb-6 md:pb-8">
                <div className="space-y-4 md:space-y-6">
                    {filteredFaqs.map((category) => (
                        <div key={category.category} className="bg-white md:rounded-lg md:shadow-sm overflow-hidden">
                            <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100">
                                <category.icon className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6] flex-shrink-0" />
                                <h2 className="font-bold text-base md:text-lg">{category.category}</h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {category.questions.map((faq, idx) => {
                                    const key = `${category.category}-${idx}`;
                                    const isOpen = openFaq === key;

                                    return (
                                        <div key={idx}>
                                            <button
                                                onClick={() => setOpenFaq(isOpen ? null : key)}
                                                className="w-full flex items-center justify-between px-4 py-4 md:px-6 md:py-5 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-medium text-sm md:text-base text-gray-800 pr-4">{faq.q}</span>
                                                {isOpen ? (
                                                    <ChevronUp className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6] flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 md:h-6 md:w-6 text-gray-400 flex-shrink-0" />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="px-4 pb-4 md:px-6 md:pb-6 text-xs md:text-sm text-gray-600 leading-relaxed">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Still Need Help - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 pb-0 md:pb-8">
                <div className="bg-gradient-to-r from-[#8b5cf6] to-orange-400 px-4 py-10 md:px-8 md:py-12 md:rounded-lg text-white text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Still need help?</h2>
                    <p className="text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto">
                        Our customer support team is here to assist you
                    </p>
                    <a href="/contact" className="inline-block bg-white text-[#8b5cf6] px-8 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-gray-100 transition-all hover:shadow-lg">
                        Contact Support
                    </a>
                </div>
            </section>
        </div>
    );
}
