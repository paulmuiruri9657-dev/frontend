'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Rocket, Shield, Users, Globe, Award, ChevronRight, Target, Lightbulb, Clock, Cpu, Leaf, RefreshCw, Zap, Lock } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                        Redefining Commerce
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
                        Building Africa's most trusted digital marketplace, one connection at a time.
                    </p>
                </div>
            </section>

            {/* Stats Section (New) */}
            <section className="bg-white py-12 border-b border-gray-100 relative z-20 -mt-8 mx-4 md:mx-12 rounded-2xl shadow-xl">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-[#8b5cf6]">10K+</div>
                            <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">Verified Products</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-[#8b5cf6]">47</div>
                            <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">Counties Served</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-[#8b5cf6]">99%</div>
                            <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">Satisfaction Rate</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-[#8b5cf6]">24/7</div>
                            <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">AI Live Chat</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story / Timeline Section */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-[#8b5cf6] uppercase tracking-wider mb-3">Our Journey</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">From Vision to Reality</h3>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#8b5cf6] to-purple-200 hidden md:block opacity-30"></div>

                        <div className="space-y-16">
                            {/* 2023 Milestone */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 group">
                                <div className="hidden md:block w-5 h-5 bg-[#8b5cf6] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ring-4 ring-purple-100 z-10 transition-all group-hover:scale-125 group-hover:ring-purple-200"></div>

                                <div className="w-full md:w-5/12 text-right pr-8 md:pr-0 self-center order-1 md:order-1 animate-in slide-in-from-left-8 duration-700">
                                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                                        <div className="flex items-center justify-end gap-3 mb-4 text-[#8b5cf6]">
                                            <Lightbulb className="h-6 w-6" />
                                            <span className="text-2xl font-black">2023</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-3">The Inception</h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            Development of EcoLooP Ke began with a bold vision: to create a seamless, trustworthy, and efficient e-commerce platform tailored for the modern African consumer. Rigorous planning and architectural design set the foundation for a robust system.
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full md:w-5/12 order-2 md:order-2 pl-8 md:pl-0"></div>
                            </div>

                            {/* 2024 Milestone */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 group">
                                <div className="hidden md:block w-5 h-5 bg-[#8b5cf6] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ring-4 ring-purple-100 z-10 transition-all group-hover:scale-125 group-hover:ring-purple-200"></div>

                                <div className="w-full md:w-5/12 order-2 md:order-1"></div>
                                <div className="w-full md:w-5/12 text-left pl-8 md:pl-0 self-center order-1 md:order-2 animate-in slide-in-from-right-8 duration-700 delay-200">
                                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                                        <div className="flex items-center gap-3 mb-4 text-[#8b5cf6]">
                                            <Target className="h-6 w-6" />
                                            <span className="text-2xl font-black">2024 - 2025</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-3">Development & Refinement</h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            Years of intensive coding, user testing, and feature implementation. We focused on building unique features like expert verification, real-time chat, and a mobile-first experience to solve real user pain points.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Launch Milestone */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 group">
                                <div className="hidden md:block w-5 h-5 bg-green-500 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ring-4 ring-green-100 z-10 transition-all group-hover:scale-125 group-hover:ring-green-200 shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>

                                <div className="w-full md:w-5/12 text-right pr-8 md:pr-0 self-center order-1 md:order-1 animate-in slide-in-from-left-8 duration-700 delay-300">
                                    <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow text-white transform hover:-translate-y-1">
                                        <div className="flex items-center justify-end gap-3 mb-4 text-white">
                                            <Rocket className="h-6 w-6" />
                                            <span className="text-2xl font-black">December 2025</span>
                                        </div>
                                        <h4 className="text-xl font-bold mb-3">Official Launch</h4>
                                        <p className="text-purple-100 leading-relaxed">
                                            EcoLooP Ke officially goes live, marking a new era in digital retail. We open our doors to millions, delivering on our promise of quality, speed, and trust.
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full md:w-5/12 order-2 md:order-2 pl-8 md:pl-0"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Innovation Section (New) */}
            <section className="py-24 px-4 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-in slide-in-from-left-8 duration-700">
                            <h2 className="text-sm font-bold text-[#8b5cf6] uppercase tracking-wider mb-3">Human-Centric Approach</h2>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                We're not just moving products; we're building relationships. Our platform combines technology with dedicated human teams to ensure safety and trust.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-[#8b5cf6]">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Expert Manual Verification</h4>
                                        <p className="text-gray-500 text-sm">Rigorous manual background checks by our compliance team ensure you're dealing with verified, trustworthy sellers.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-[#8b5cf6]">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">24/7 Security Operations</h4>
                                        <p className="text-gray-500 text-sm">Our vigilant security team monitors transactions around the clock, intervening instantly to prevent potential fraud.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-[#8b5cf6]">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Curated Collections</h4>
                                        <p className="text-gray-500 text-sm">Hand-picked selections by our merchandising experts to bring you the best quality products at competitive prices.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative animate-in slide-in-from-right-8 duration-700 delay-200">
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-50 blur-3xl"></div>
                            <div className="relative bg-gray-900 rounded-2xl p-8 shadow-2xl text-white">
                                <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">admin_console_v2.0</span>
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex justify-between text-green-400">
                                        <span>$ admin_verify_seller(id_7782)</span>
                                        <span>[APPROVED]</span>
                                    </div>
                                    <div className="flex justify-between text-blue-400">
                                        <span>$ staff_review_payment()</span>
                                        <span>[VERIFIED]</span>
                                    </div>
                                    <div className="flex justify-between text-purple-400">
                                        <span>$ logistics_team_dispatch()</span>
                                        <span>[CONFIRMED]</span>
                                    </div>
                                    <div className="pl-4 text-gray-500 text-xs mt-4">
                                        // Team active and monitoring <br />
                                        // 24/7 Human Support Online
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sustainability (New) */}
            <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
                        <Leaf className="h-4 w-4" /> The EcoLooP Promise
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Circularity is in our DNA</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
                        The "Eco" in EcoLooP isn't just a name. It's our commitment to a sustainable future through the circular economy.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left">
                            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600">
                                <RefreshCw className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Refurbished Excellence</h3>
                            <p className="text-gray-500 leading-relaxed">Giving high-quality electronics a second life. We rigorously test and grade pre-owned devices, reducing e-waste while offering you premium tech for less.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left">
                            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600">
                                <Users className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Community Empowered</h3>
                            <p className="text-gray-500 leading-relaxed">Empowering local repair shops and small-scale technicians by integrating them into our supply chain for warranty and repairs.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left">
                            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600">
                                <Globe className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Paperless Operations</h3>
                            <p className="text-gray-500 leading-relaxed">From digital receipts to optimized logistics that reduce carbon footprint, every step of our process is designed with the planet in mind.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-sm font-bold text-[#8b5cf6] uppercase tracking-wider mb-3">Leadership</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">Meet Our Founder</h3>

                    <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 max-w-3xl mx-auto">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                                <img
                                    src="/images/founder.jpg"
                                    alt="Eng. Paul Muiruri"
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        <div className="mt-16">
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">Eng. Paul Muiruri</h4>
                            <p className="text-[#8b5cf6] font-medium mb-6">Founder & CEO</p>

                            <div className="max-w-2xl mx-auto">
                                <p className="text-gray-600 leading-relaxed italic text-lg opacity-90">
                                    "We didn't just want to build another shop. We initiated this project in 2023 with a singular mission: to engineer an ecosystem where trust is built into the code itself. EcoLooP Ke represents the convergence of advanced technology and human-centric design."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission / Values Grid */}
            <section className="py-24 px-4 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#8b5cf6] transition-colors duration-300">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="text-xl font-bold mb-4">Unwavering Trust</h4>
                            <p className="text-gray-400 leading-relaxed">
                                Security isn't an afterthought. From our verified seller badges to our manual expert inspections, we prioritize your safety above all else.
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#8b5cf6] transition-colors duration-300">
                                <Award className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="text-xl font-bold mb-4">Premium Quality</h4>
                            <p className="text-gray-400 leading-relaxed">
                                We curate the best. Whether it's a refurbished iPhone or a new fashion piece, excellence is the standard we refuse to compromise on.
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#8b5cf6] transition-colors duration-300">
                                <Globe className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="text-xl font-bold mb-4">Pan-African Vision</h4>
                            <p className="text-gray-400 leading-relaxed">
                                Started in Kenya, built for the continent. We are creating digital infrastructure to empower millions of authentic African entrepreneurs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white text-center px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Join the Future of Commerce</h2>
                    <p className="text-xl text-purple-100 mb-10">
                        Be part of the revolution. Whether you're buying or selling, your journey starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register" className="px-8 py-4 bg-white text-[#7c3aed] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                            Create Account
                        </Link>
                        <Link href="/sell" className="px-8 py-4 bg-purple-900/30 text-white font-bold rounded-xl hover:bg-purple-900/50 transition-all backdrop-blur-sm border border-white/20">
                            Start Selling
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
