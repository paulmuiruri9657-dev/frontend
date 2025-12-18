'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => {
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4">
                <div className="bg-gradient-to-r from-[#8b5cf6] to-cyan-600 text-white py-12 md:py-16 px-4 md:rounded-lg">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Contact Us</h1>
                        <p className="text-sm md:text-base text-white/95 max-w-2xl mx-auto leading-relaxed">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 md:gap-8 px-0 md:px-4 py-6 md:py-8">
                {/* Contact Info - Stack on Mobile */}
                <div className="lg:col-span-1 space-y-0 md:space-y-6">
                    {/* Quick Contact Subsection */}
                    <div className="bg-white px-4 py-4 md:px-0 md:py-0 md:rounded-lg md:shadow-sm border-b md:border-0 border-gray-200">
                        <div className="bg-white md:rounded-lg md:shadow-sm p-4 md:p-6 mb-4 md:mb-0">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                                    <Phone className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm md:text-base mb-1">Call Us</h3>
                                    <a
                                        href="https://wa.me/254705424364"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#8b5cf6] font-bold text-base md:text-lg hover:text-[#7c3aed] transition-colors"
                                    >
                                        0705424364
                                    </a>
                                    <p className="text-gray-500 text-xs md:text-sm">Mon-Sat: 8am - 6pm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white px-4 py-4 md:px-0 md:py-0 md:rounded-lg md:shadow-sm border-b md:border-0 border-gray-200">
                        <div className="bg-white md:rounded-lg md:shadow-sm p-4 md:p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                                    <Mail className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm md:text-base mb-1">Email Us</h3>
                                    <a href="mailto:ecoloopke@gmail.com" className="text-[#8b5cf6] text-sm md:text-base hover:underline break-all">
                                        ecoloopke@gmail.com
                                    </a>
                                    <p className="text-gray-500 text-xs md:text-sm">We reply within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visit Us Subsection */}
                    <div className="bg-white px-4 py-4 md:px-0 md:py-0 md:rounded-lg md:shadow-sm border-b md:border-0 border-gray-200">
                        <div className="bg-white md:rounded-lg md:shadow-sm p-4 md:p-6 mb-4 md:mb-0">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm md:text-base mb-1">Head Office</h3>
                                    <p className="text-gray-600 text-xs md:text-sm">EcoLooP Ke</p>
                                    <p className="text-gray-600 text-xs md:text-sm">Mombasa Road, Nairobi</p>
                                    <p className="text-gray-600 text-xs md:text-sm">Kenya</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white px-4 py-4 md:px-0 md:py-0 md:rounded-lg md:shadow-sm border-b md:border-0 border-gray-200">
                        <div className="bg-white md:rounded-lg md:shadow-sm p-4 md:p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-[#8b5cf6]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm md:text-base mb-1">Working Hours</h3>
                                    <p className="text-gray-600 text-xs md:text-sm">Monday - Friday: 8am - 6pm</p>
                                    <p className="text-gray-600 text-xs md:text-sm">Saturday: 9am - 5pm</p>
                                    <p className="text-gray-600 text-xs md:text-sm">Sunday: 10am - 4pm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form - Edge to Edge on Mobile */}
                <div className="lg:col-span-2">
                    <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                        <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8">Send us a Message</h2>

                        {submitted ? (
                            <div className="text-center py-12">
                                <CheckCircle className="h-14 w-14 md:h-16 md:w-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                                <p className="text-sm md:text-base text-gray-600">We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Your Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Message Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent"
                                            placeholder="0712 345 678"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                            Subject *
                                        </label>
                                        <select
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="order">Order Inquiry</option>
                                            <option value="return">Returns & Refunds</option>
                                            <option value="payment">Payment Issue</option>
                                            <option value="delivery">Delivery Question</option>
                                            <option value="product">Product Question</option>
                                            <option value="seller">Seller Account</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                        Message *
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#8b5cf6] text-white py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-lg hover:bg-[#7c3aed] transition-all hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Send className="h-4 w-4 md:h-5 md:w-5" />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
