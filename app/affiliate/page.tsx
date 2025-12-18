'use client';

import React, { useState } from 'react';
import { Users, DollarSign, Clock, Share2, ChevronDown, ChevronUp } from 'lucide-react';

const benefits = [
    { icon: DollarSign, title: 'Earn Commissions', desc: 'Get up to 10% commission on every sale you refer' },
    { icon: Clock, title: 'Flexible Hours', desc: 'Work on your own schedule, part-time or full-time' },
    { icon: Share2, title: 'Easy Sharing', desc: 'Share product links via WhatsApp, social media, or in person' },
    { icon: Users, title: 'Build a Team', desc: 'Recruit other consultants and earn bonuses' }
];

const steps = [
    { step: 1, title: 'Register', desc: 'Sign up for free as a Sales Consultant' },
    { step: 2, title: 'Get Trained', desc: 'Complete our online training program' },
    { step: 3, title: 'Share & Sell', desc: 'Share products with your network' },
    { step: 4, title: 'Earn Money', desc: 'Get paid for every successful order' }
];

const faqs = [
    { q: 'How much can I earn?', a: 'Earnings depend on your sales. Top consultants earn over KSh 100,000 per month. Commission rates range from 5-10% depending on the product category.' },
    { q: 'Do I need any investment?', a: 'No! Joining is completely free. You don\'t need to buy or stock any products.' },
    { q: 'How do I get paid?', a: 'Commissions are paid weekly via M-Pesa once they exceed KSh 500.' },
    { q: 'Can I do this part-time?', a: 'Absolutely! Many of our top consultants started part-time while working other jobs.' }
];

export default function AffiliatePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        county: '',
        experience: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Application submitted! We\'ll contact you within 48 hours.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4">
                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-500 text-white py-12 md:py-16 px-4 md:rounded-lg">
                    <div className="max-w-4xl mx-auto text-center">
                        <Users className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6" />
                        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Become a Sales Consultant</h1>
                        <p className="text-sm md:text-xl text-white/95 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
                            Earn money by helping people shop on EcoLooP. No investment needed!
                        </p>
                        <a href="#apply" className="inline-block bg-white text-green-600 px-8 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-gray-100 transition-all hover:shadow-lg">
                            Apply Now - It&apos;s Free!
                        </a>
                    </div>
                </div>
            </section>

            {/* Benefits - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-10">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Why Become a Sales Consultant?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-green-50 to-white rounded-lg p-3 md:p-6 text-center border border-green-100">
                                <benefit.icon className="h-8 w-8 md:h-10 md:w-10 text-green-600 mx-auto mb-2 md:mb-4" />
                                <h3 className="font-bold text-sm md:text-base mb-1 md:mb-2">{benefit.title}</h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-tight">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-0 md:py-4">
                <div className="bg-gradient-to-r from-green-50 to-teal-50 px-4 py-6 md:px-8 md:py-8 md:rounded-lg">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">How It Works</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                        {steps.map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-2 md:mb-3">
                                    {item.step}
                                </div>
                                <h4 className="font-bold text-sm md:text-base mb-1 md:mb-2">{item.title}</h4>
                                <p className="text-gray-600 text-xs md:text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Earnings Calculator - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-8">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Potential Earnings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center max-w-3xl mx-auto">
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 md:p-6 border border-green-100">
                            <p className="text-gray-600 text-xs md:text-sm mb-2">10 sales/week</p>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">KSh 5,000+</p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">/month</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-100 to-emerald-50 rounded-lg p-4 md:p-6 border-2 border-green-500 shadow-md">
                            <p className="text-gray-600 text-xs md:text-sm mb-2">30 sales/week</p>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">KSh 25,000+</p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">/month</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 md:p-6 border border-green-100">
                            <p className="text-gray-600 text-xs md:text-sm mb-2">100 sales/week</p>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">KSh 100,000+</p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">/month</p>
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-xs md:text-sm mt-4 md:mt-6">
                        *Earnings vary based on products sold and commission rates (5-10%)
                    </p>
                </div>
            </section>

            {/* Application Form - Edge to Edge on Mobile */}
            <section id="apply" className="px-0 md:px-4 py-0 md:py-4">
                <div className="bg-gradient-to-r from-green-50 to-teal-50 px-4 py-6 md:px-8 md:py-8 md:rounded-lg">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Apply to Become a Consultant</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {/* Personal Information Subsection */}
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Location Details Subsection */}
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">County *</label>
                            <select
                                required
                                value={formData.county}
                                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select county</option>
                                <option value="nairobi">Nairobi</option>
                                <option value="mombasa">Mombasa</option>
                                <option value="kisumu">Kisumu</option>
                                <option value="nakuru">Nakuru</option>
                                <option value="eldoret">Uasin Gishu (Eldoret)</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Experience Section */}
                        <div className="md:col-span-2">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Sales Experience (Optional)</label>
                            <textarea
                                rows={3}
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                placeholder="Tell us about any sales or marketing experience you have"
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-lg hover:bg-green-700 transition-all hover:shadow-lg"
                            >
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* FAQs - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-8 pb-0 md:pb-8">
                <div className="bg-white md:rounded-lg md:shadow-sm">
                    <div className="px-4 py-6 md:px-8 md:py-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Frequently Asked Questions</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {faqs.map((faq, idx) => (
                            <div key={idx}>
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between px-4 py-4 md:px-8 md:py-5 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-sm md:text-base text-gray-900 pr-4">{faq.q}</span>
                                    {openFaq === idx ?
                                        <ChevronUp className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0" /> :
                                        <ChevronDown className="h-5 w-5 md:h-6 md:w-6 text-gray-400 flex-shrink-0" />
                                    }
                                </button>
                                {openFaq === idx && (
                                    <div className="px-4 pb-4 md:px-8 md:pb-6 text-xs md:text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
