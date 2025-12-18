'use client';

import React, { useState } from 'react';
import { MapPin, Store, Truck, Users, Shield, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

const benefits = [
    { icon: MapPin, title: 'Local Presence', desc: 'Become the face of EcoLooP in your community' },
    { icon: Store, title: 'Pick-up Point', desc: 'Customers can collect orders from your location' },
    { icon: DollarSign, title: 'Extra Income', desc: 'Earn money from pickups and order assistance' },
    { icon: Users, title: 'Community Impact', desc: 'Help your neighbors access e-commerce' }
];

const requirements = [
    'A physical business location (shop, office, etc.)',
    'Available during business hours (at least 10am-6pm)',
    'Basic smartphone with WhatsApp',
    'Secure storage space for parcels',
    'Good customer service skills',
    'Valid ID and business permit (if applicable)'
];

const faqs = [
    { q: 'What is an EcoLooP Partner?', a: 'An EcoLooP Partner operates a pickup point where customers can collect their orders. You also help customers place orders and provide e-commerce services to your community.' },
    { q: 'How much can I earn?', a: 'Earnings depend on the volume of pickups and orders in your area. Partners typically earn KSh 10,000-50,000+ per month through commissions on pickups and order assistance.' },
    { q: 'Is there any fee to join?', a: 'No joining fee! We provide training and support materials at no cost. You just need to meet the requirements and pass the verification process.' },
    { q: 'What areas are you looking for partners?', a: 'We\'re actively recruiting partners in underserved areas across all 47 counties, especially in towns where customers have limited delivery access.' }
];

export default function PartnerPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        county: '',
        town: '',
        address: '',
        businessType: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your interest! Our partnerships team will contact you within 3 business days.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4">
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white py-12 md:py-16 px-4 md:rounded-lg">
                    <div className="max-w-4xl mx-auto text-center">
                        <MapPin className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6" />
                        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">EcoLooP Partner Program</h1>
                        <p className="text-sm md:text-xl text-white/95 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
                            Bring e-commerce to your community. Become an EcoLooP pickup point and earn extra income!
                        </p>
                        <a href="#apply" className="inline-block bg-white text-purple-600 px-8 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-gray-100 transition-all hover:shadow-lg">
                            Apply to Be a Partner
                        </a>
                    </div>
                </div>
            </section>

            {/* Benefits - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-10">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Partner Benefits</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-3 md:p-6 text-center border border-purple-100">
                                <benefit.icon className="h-8 w-8 md:h-10 md:w-10 text-purple-600 mx-auto mb-2 md:mb-4" />
                                <h3 className="font-bold text-sm md:text-base mb-1 md:mb-2">{benefit.title}</h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-tight">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-0 md:py-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-6 md:px-8 md:py-8 md:rounded-lg">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">How the Partnership Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <Truck className="h-7 w-7 md:h-8 md:w-8 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-base md:text-lg mb-2">Receive Parcels</h3>
                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                EcoLooP delivers orders to your location. You securely store them until customers collect.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <Users className="h-7 w-7 md:h-8 md:w-8 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-base md:text-lg mb-2">Serve Customers</h3>
                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                Help customers collect orders, make returns, and even place new orders.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <DollarSign className="h-7 w-7 md:h-8 md:w-8 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-base md:text-lg mb-2">Get Paid</h3>
                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                Earn commissions on every pickup and order placed through your point.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Requirements - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-6 md:py-8">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Requirements to Join</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {requirements.map((req, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-white rounded-lg p-3 md:p-4 border border-purple-100">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs md:text-sm">✓</span>
                                </div>
                                <span className="text-gray-700 text-xs md:text-sm leading-relaxed">{req}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application Form - Edge to Edge on Mobile */}
            <section id="apply" className="px-0 md:px-4 py-0 md:py-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-6 md:px-8 md:py-8 md:rounded-lg">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Apply for Partnership</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {/* Contact Information */}
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Business Details */}
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">County *</label>
                            <select
                                required
                                value={formData.county}
                                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select county</option>
                                <option value="nairobi">Nairobi</option>
                                <option value="mombasa">Mombasa</option>
                                <option value="kisumu">Kisumu</option>
                                <option value="nakuru">Nakuru</option>
                                <option value="eldoret">Uasin Gishu</option>
                                <option value="kiambu">Kiambu</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Town/Area *</label>
                            <input
                                type="text"
                                required
                                value={formData.town}
                                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                            <select
                                required
                                value={formData.businessType}
                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select business type</option>
                                <option value="retail">Retail Shop</option>
                                <option value="pharmacy">Pharmacy</option>
                                <option value="electronics">Electronics Store</option>
                                <option value="cyber">Cyber Café</option>
                                <option value="mpesa">M-Pesa Agent</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Physical Address *</label>
                            <textarea
                                required
                                rows={2}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Building name, street, landmark"
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-lg hover:bg-purple-700 transition-all hover:shadow-lg"
                            >
                                Submit Partnership Application
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
                                        <ChevronUp className="h-5 w-5 md:h-6 md:w-6 text-purple-600 flex-shrink-0" /> :
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
