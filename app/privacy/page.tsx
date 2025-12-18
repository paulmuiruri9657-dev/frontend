'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Mail, Phone } from 'lucide-react';

const sections = [
    {
        id: 'introduction',
        title: '1. Introduction',
        content: 'EcoLooP Ke ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This privacy notice explains how we collect, use, and safeguard your information when you use our services.'
    },
    {
        id: 'collection',
        title: '2. Information We Collect',
        subsections: [
            {
                subtitle: 'Personal Information',
                bullets: [
                    'Name and contact details (email, phone number, address)',
                    'Account credentials',
                    'Payment information',
                    'Order history and preferences',
                    'Communication records'
                ]
            },
            {
                subtitle: 'Automatically Collected Information',
                bullets: [
                    'Device information and identifiers',
                    'IP address and location data',
                    'Browsing activity and interactions',
                    'Cookies and similar technologies'
                ]
            }
        ]
    },
    {
        id: 'usage',
        title: '3. How We Use Your Information',
        content: 'We use your information to:',
        bullets: [
            'Process and fulfill your orders',
            'Communicate with you about orders and services',
            'Personalize your shopping experience',
            'Improve our products and services',
            'Prevent fraud and enhance security',
            'Comply with legal obligations',
            'Send marketing communications (with your consent)'
        ]
    },
    {
        id: 'sharing',
        title: '4. Information Sharing',
        content: 'We may share your information with:',
        bullets: [
            'Delivery partners to fulfill orders',
            'Payment processors for transactions',
            'Service providers who assist our operations',
            'Sellers when you purchase their products',
            'Law enforcement when required bylaw'
        ],
        note: 'We do not sell your personal information to third parties.'
    },
    {
        id: 'security',
        title: '5. Data Security',
        content: 'We implement appropriate security measures to protect your data, including:',
        bullets: [
            'SSL encryption for data transmission',
            'Secure storage with access controls',
            'Regular security assessments',
            'Employee training on data protection'
        ]
    },
    {
        id: 'rights',
        title: '6. Your Rights',
        content: 'You have the right to:',
        bullets: [
            'Access your personal data',
            'Correct inaccurate data',
            'Request deletion of your data',
            'Opt-out of marketing communications',
            'Withdraw consent at any time'
        ]
    },
    {
        id: 'retention',
        title: '7. Data Retention',
        content: 'We retain your personal data for as long as necessary to fulfill the purposes outlined in this notice, unless a longer retention period is required by law.'
    },
    {
        id: 'children',
        title: "8. Children's Privacy",
        content: 'Our services are not intended for children under 18. We do not knowingly collect personal information from children.'
    },
    {
        id: 'updates',
        title: '9. Updates to This Notice',
        content: 'We may update this privacy notice periodically. We will notify you of significant changes via email or through our platform.'
    }
];

export default function PrivacyPage() {
    const [openSection, setOpenSection] = useState<string | null>('introduction');

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <section className="px-0 md:px-4">
                <div className="bg-gradient-to-r from-blue-900 to-cyan-700 text-white py-12 md:py-16 px-4 md:rounded-lg">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <Shield className="h-8 w-8 md:h-10 md:w-10" />
                            <h1 className="text-2xl md:text-4xl font-bold">Privacy Notice</h1>
                        </div>
                        <p className="text-sm md:text-base text-gray-200">Last updated: December 2024</p>
                        <p className="text-xs md:text-sm text-gray-300 mt-2">Your privacy and data security are our top priorities</p>
                    </div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="px-0 md:px-4 py-4 md:py-6">
                <div className="bg-white px-4 py-4 md:px-8 md:py-6 md:rounded-lg md:shadow-sm border-b md:border-b-0 border-gray-200">
                    <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4">Table of Contents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setOpenSection(section.id)}
                                className="text-left text-[#06b6d4] hover:underline py-1"
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
                                        <ChevronUp className="h-5 w-5 md:h-6 md:w-6 text-[#06b6d4] flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 md:h-6 md:w-6 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-4 md:px-8 md:pb-6 pt-0">
                                        {section.content && (
                                            <p className="text-xs md:text-sm text-gray-600 mb-3 leading-relaxed">
                                                {section.content}
                                            </p>
                                        )}
                                        {section.bullets && (
                                            <ul className="list-disc pl-5 md:pl-6 space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                                                {section.bullets.map((bullet, i) => (
                                                    <li key={i}>{bullet}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {section.subsections && (
                                            <div className="space-y-4">
                                                {section.subsections.map((sub, i) => (
                                                    <div key={i}>
                                                        <h4 className="font-semibold text-xs md:text-sm text-gray-800 mb-2">{sub.subtitle}</h4>
                                                        <ul className="list-disc pl-5 md:pl-6 space-y-1.5 text-xs md:text-sm text-gray-600">
                                                            {sub.bullets.map((bullet, j) => (
                                                                <li key={j}>{bullet}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {section.note && (
                                            <p className="mt-3 text-xs md:text-sm text-gray-600 bg-cyan-50 p-3 rounded-lg border-l-4 border-[#06b6d4]">
                                                <strong>Note:</strong> {section.note}
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
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-8 md:px-8 md:py-10 md:rounded-lg">
                    <h2 className="text-lg md:text-2xl font-bold text-center mb-3 md:mb-4">Data Protection Officer</h2>
                    <p className="text-xs md:text-sm text-gray-600 text-center mb-6 max-w-2xl mx-auto">
                        For privacy-related inquiries, contact our Data Protection Officer:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
                        <a href="mailto:ecoloopke@gmail.com" className="flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-medium text-xs md:text-sm hover:shadow-md transition-all border border-gray-200">
                            <Mail className="h-4 w-4" />
                            <span>ecoloopke@gmail.com</span>
                        </a>
                        <a href="https://wa.me/254705424364" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#06b6d4] text-white px-4 py-2.5 md:py-3 rounded-lg font-medium text-xs md:text-sm hover:bg-cyan-600 transition-all hover:shadow-md">
                            <Phone className="h-4 w-4" />
                            <span>WhatsApp Us</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
