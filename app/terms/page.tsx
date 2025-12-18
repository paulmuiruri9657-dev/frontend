'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Mail, Phone } from 'lucide-react';

const sections = [
    {
        id: 'introduction',
        title: '1. Introduction',
        content: 'Welcome to EcoLooP Ke. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms.'
    },
    {
        id: 'account',
        title: '2. Account Registration',
        content: 'To use certain features of our Service, you must register for an account.',
        bullets: [
            'Provide accurate, current, and complete information',
            'Maintain and promptly update your account information',
            'Keep your password secure and confidential',
            'Notify us immediately of any unauthorized access',
            'Be responsible for all activities under your account'
        ]
    },
    {
        id: 'ordering',
        title: '3. Ordering and Payment',
        content: 'When you place an order, you are making an offer to purchase products. All orders are subject to:',
        bullets: [
            'Product availability',
            'Payment verification',
            'Price accuracy verification',
            'Our acceptance of your order'
        ],
        note: 'We accept payment via M-Pesa, Airtel Money, Visa, Mastercard, and Cash on Delivery in select areas.'
    },
    {
        id: 'pricing',
        title: '4. Pricing and Availability',
        content: 'All prices are shown in Kenyan Shillings (KSh) and include applicable VAT. Prices may change without notice. We reserve the right to cancel orders affected by pricing errors.'
    },
    {
        id: 'delivery',
        title: '5. Delivery',
        content: 'We aim to deliver within the estimated timeframes. However, delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery.'
    },
    {
        id: 'returns',
        title: '6. Returns and Refunds',
        content: 'You may return most items within 7 days of delivery, provided they are:',
        bullets: [
            'Unused and in original condition',
            'In original packaging with all tags attached',
            'Accompanied by proof of purchase'
        ],
        note: 'Certain items like perishables, personal care products, and customized items cannot be returned.'
    },
    {
        id: 'intellectual',
        title: '7. Intellectual Property',
        content: 'All content on this website, including logos, text, graphics, and software, is the property of EcoLooP Ke and protected by intellectual property laws.'
    },
    {
        id: 'liability',
        title: '8. Limitation of Liability',
        content: 'EcoLooP Ke shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.'
    },
    {
        id: 'governing',
        title: '9. Governing Law',
        content: 'These terms shall be governed by and construed in accordance with the laws of Kenya. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kenya.'
    },
    {
        id: 'changes',
        title: '10. Changes to Terms',
        content: 'We reserve the right to modify these terms at any time. Changes will be effective when posted on this page. Continued use of the service constitutes acceptance of modified terms.'
    }
];

export default function TermsPage() {
    const [openSection, setOpenSection] = useState<string | null>('introduction');

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <section className="px-0 md:px-4">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 md:py-16 px-4 md:rounded-lg">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <FileText className="h-8 w-8 md:h-10 md:w-10" />
                            <h1 className="text-2xl md:text-4xl font-bold">Terms and Conditions</h1>
                        </div>
                        <p className="text-sm md:text-base text-gray-300">Last updated: December 2024</p>
                    </div>
                </div>
            </section>

            {/* Table of Contents - Mobile Optimized */}
            <section className="px-0 md:px-4 py-4 md:py-6">
                <div className="bg-white px-4 py-4 md:px-8 md:py-6 md:rounded-lg md:shadow-sm border-b md:border-b-0 border-gray-200">
                    <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4">Table of Contents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setOpenSection(section.id)}
                                className="text-left text-[#8b5cf6] hover:underline py-1"
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Collapsible Sections */}
            <section className="px-0 md:px-4 pb-8">
                <div className="bg-white md:rounded-lg md:shadow-sm">
                    {sections.map((section, index) => {
                        const isOpen = openSection === section.id;
                        const isLast = index === sections.length - 1;

                        return (
                            <div key={section.id} className={`border-b ${isLast ? 'border-b-0' : 'border-gray-200'}`}>
                                <button
                                    onClick={() => setOpenSection(isOpen ? null : section.id)}
                                    className="w-full flex items-center justify-between px-4 py-4 md:px-8 md:py-5 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="font-bold text-sm md:text-lg text-gray-900">{section.title}</h3>
                                    {isOpen ? (
                                        <ChevronUp className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6] flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 md:h-6 md:w-6 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-4 md:px-8 md:pb-6 pt-0">
                                        <p className="text-xs md:text-sm text-gray-600 mb-3 leading-relaxed">
                                            {section.content}
                                        </p>
                                        {section.bullets && (
                                            <ul className="list-disc pl-5 md:pl-6 space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                                                {section.bullets.map((bullet, i) => (
                                                    <li key={i}>{bullet}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {section.note && (
                                            <p className="mt-3 text-xs md:text-sm text-gray-600 bg-purple-50 p-3 rounded-lg border-l-4 border-[#8b5cf6]">
                                                {section.note}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Contact Section */}
            <section className="px-0 md:px-4 pb-0 md:pb-8">
                <div className="bg-gradient-to-r from-purple-50 to-cyan-50 px-4 py-8 md:px-8 md:py-10 md:rounded-lg">
                    <h2 className="text-lg md:text-2xl font-bold text-center mb-3 md:mb-4">Have Questions?</h2>
                    <p className="text-xs md:text-sm text-gray-600 text-center mb-6 max-w-2xl mx-auto">
                        If you have questions about these Terms, please contact us:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
                        <a href="mailto:ecoloopke@gmail.com" className="flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-medium text-xs md:text-sm hover:shadow-md transition-all border border-gray-200">
                            <Mail className="h-4 w-4" />
                            <span>ecoloopke@gmail.com</span>
                        </a>
                        <a href="https://wa.me/254705424364" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#8b5cf6] text-white px-4 py-2.5 md:py-3 rounded-lg font-medium text-xs md:text-sm hover:bg-[#7c3aed] transition-all hover:shadow-md">
                            <Phone className="h-4 w-4" />
                            <span>WhatsApp Us</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
