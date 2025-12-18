'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, ChevronDown, ChevronUp } from 'lucide-react';

const Footer = () => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <footer
            className="relative text-white pb-5 text-xs bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('https://img.freepik.com/premium-photo/beautiful-public-park-with-green-grass-field-morning-light-created-with-generative-ai-technology_67092-7309.jpg')",
                backgroundAttachment: 'fixed' // Optional: Adds a nice parallax-like effect
            }}
        >
            {/* Subtle Gradient Overlay for Text Readability - Much Lighter now */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-3 md:px-4 pt-8 text-shadow-md">
                {/* Mobile Accordion Layout */}
                {/* Ultra-Compact Mobile Layout */}
                <div className="md:hidden mb-12">
                    {/* Floating Title */}
                    <div className="text-center mb-6">
                        <span className="text-white/90 text-[10px] uppercase tracking-[0.2em] font-light">Explore EcoLooP</span>
                    </div>

                    {/* Collapsible Sections - Transparent "Ghost" Style */}
                    <div className="space-y-4">
                        {/* Need Help */}
                        <div className="border-b border-white/20 pb-2">
                            <button
                                onClick={() => toggleSection('help')}
                                className="w-full flex items-center justify-between py-1 px-1"
                            >
                                <span className="font-bold text-sm uppercase tracking-wider text-white drop-shadow-lg">Need Help?</span>
                                {expandedSection === 'help' ? <ChevronUp className="h-4 w-4 text-white" /> : <ChevronDown className="h-4 w-4 text-white" />}
                            </button>
                            {expandedSection === 'help' && (
                                <ul className="grid grid-cols-2 gap-3 pt-3 px-1 text-xs text-white font-medium animate-fadeIn">
                                    <li><Link href="/help/chat" className="hover:text-[#8b5cf6] flex items-center shadow-black/50">Chat with us</Link></li>
                                    <li><Link href="/help" className="hover:text-[#8b5cf6] flex items-center shadow-black/50">Help Center</Link></li>
                                    <li><Link href="/contact" className="hover:text-[#8b5cf6] flex items-center shadow-black/50">Contact Us</Link></li>
                                    <li><Link href="tel:0705424364" className="text-white font-bold bg-[#8b5cf6]/90 px-3 py-1 rounded-full text-[10px] shadow-lg inline-block text-center">Call Us</Link></li>
                                </ul>
                            )}
                        </div>

                        {/* About EcoLooP */}
                        <div className="border-b border-white/20 pb-2">
                            <button
                                onClick={() => toggleSection('about')}
                                className="w-full flex items-center justify-between py-1 px-1"
                            >
                                <span className="font-bold text-sm uppercase tracking-wider text-white drop-shadow-lg">About EcoLooP</span>
                                {expandedSection === 'about' ? <ChevronUp className="h-4 w-4 text-white" /> : <ChevronDown className="h-4 w-4 text-white" />}
                            </button>
                            {expandedSection === 'about' && (
                                <ul className="grid grid-cols-2 gap-3 pt-3 px-1 text-xs text-white font-medium animate-fadeIn">
                                    <li><Link href="/about" className="hover:text-[#8b5cf6] shadow-black/50">About us</Link></li>
                                    <li><Link href="/careers" className="hover:text-[#8b5cf6] shadow-black/50">Careers</Link></li>
                                    <li><Link href="/express" className="hover:text-[#8b5cf6] shadow-black/50">Express</Link></li>
                                    <li><Link href="/terms" className="hover:text-[#8b5cf6] shadow-black/50">Terms</Link></li>
                                    <li><Link href="/privacy" className="hover:text-[#8b5cf6] shadow-black/50">Privacy</Link></li>
                                </ul>
                            )}
                        </div>

                        {/* Make Money */}
                        <div className="border-b border-white/20 pb-2">
                            <button
                                onClick={() => toggleSection('money')}
                                className="w-full flex items-center justify-between py-1 px-1"
                            >
                                <span className="font-bold text-sm uppercase tracking-wider text-white drop-shadow-lg">Make Money</span>
                                {expandedSection === 'money' ? <ChevronUp className="h-4 w-4 text-white" /> : <ChevronDown className="h-4 w-4 text-white" />}
                            </button>
                            {expandedSection === 'money' && (
                                <ul className="grid grid-cols-2 gap-3 pt-3 px-1 text-xs text-white font-medium animate-fadeIn">
                                    <li><Link href="/sell" className="hover:text-[#8b5cf6] shadow-black/50">Sell on EcoLooP</Link></li>
                                    <li><Link href="/vendor" className="hover:text-[#8b5cf6] shadow-black/50">Vendor Hub</Link></li>
                                    <li><Link href="/affiliate" className="hover:text-[#8b5cf6] shadow-black/50">Become Affiliate</Link></li>
                                    <li><Link href="/partner" className="hover:text-[#8b5cf6] shadow-black/50">Partnership</Link></li>
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Minimalist Connect Bar - Fully Transparent */}
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#8b5cf6] transition-all hover:scale-110"><Facebook className="h-5 w-5 drop-shadow-lg" /></a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#8b5cf6] transition-all hover:scale-110"><Twitter className="h-5 w-5 drop-shadow-lg" /></a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#8b5cf6] transition-all hover:scale-110"><Instagram className="h-5 w-5 drop-shadow-lg" /></a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#8b5cf6] transition-all hover:scale-110"><Youtube className="h-5 w-5 drop-shadow-lg" /></a>
                        </div>
                        <div className="flex gap-2 opacity-80">
                            <span className="text-white text-[10px] font-bold drop-shadow-md">VISA</span>
                            <span className="text-white text-[10px]">&bull;</span>
                            <span className="text-white text-[10px] font-bold drop-shadow-md">MASTERCARD</span>
                            <span className="text-white text-[10px]">&bull;</span>
                            <span className="text-[#25D366] text-[10px] font-bold drop-shadow-md">M-PESA</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Column 1 - Need Help */}
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wide text-gray-200">Need Help?</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><Link href="/help/chat" className="hover:underline hover:text-[#8b5cf6] transition-colors">Chat with us</Link></li>
                            <li><Link href="/help" className="hover:underline hover:text-[#8b5cf6] transition-colors">Help Center</Link></li>
                            <li><Link href="/contact" className="hover:underline hover:text-[#8b5cf6] transition-colors">Contact Us</Link></li>
                        </ul>
                        <div className="mt-4 p-3 bg-white/5 backdrop-blur-sm rounded border border-white/10">
                            <p className="font-bold text-gray-200">Call to Order</p>
                            <a
                                href="https://wa.me/254705424364"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8b5cf6] font-bold text-lg hover:text-[#7c3aed] transition-colors"
                            >
                                0705424364
                            </a>
                        </div>
                    </div>

                    {/* Column 2 - About EcoLooP */}
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wide text-gray-200">About EcoLooP</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><Link href="/about" className="hover:underline hover:text-[#8b5cf6] transition-colors">About us</Link></li>
                            <li><Link href="/careers" className="hover:underline hover:text-[#8b5cf6] transition-colors">Careers</Link></li>
                            <li><Link href="/express" className="hover:underline hover:text-[#8b5cf6] transition-colors">Express</Link></li>
                            <li><Link href="/terms" className="hover:underline hover:text-[#8b5cf6] transition-colors">Terms</Link></li>
                            <li><Link href="/privacy" className="hover:underline hover:text-[#8b5cf6] transition-colors">Privacy</Link></li>
                            <li><Link href="/cookies" className="hover:underline hover:text-[#8b5cf6] transition-colors">Cookies</Link></li>
                            <li><Link href="/flash-sales" className="hover:underline hover:text-[#8b5cf6] transition-colors">Flash Sales</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 - Make Money */}
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wide text-gray-200">Make Money</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><Link href="/sell" className="hover:underline hover:text-[#8b5cf6] transition-colors">Sell</Link></li>
                            <li><Link href="/vendor" className="hover:underline hover:text-[#8b5cf6] transition-colors">Vendor Hub</Link></li>
                            <li><Link href="/affiliate" className="hover:underline hover:text-[#8b5cf6] transition-colors">Affiliate</Link></li>
                            <li><Link href="/partner" className="hover:underline hover:text-[#8b5cf6] transition-colors">Partner</Link></li>
                        </ul>
                    </div>

                    {/* Column 4 - International */}
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wide text-gray-200">EcoLooP International</h3>
                        <div className="grid grid-cols-2 gap-2 text-gray-300">
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline hover:text-[#8b5cf6] transition-colors">Algeria</a></li>
                                <li><a href="#" className="hover:underline hover:text-[#8b5cf6] transition-colors">Egypt</a></li>
                                <li><a href="#" className="hover:underline hover:text-[#8b5cf6] transition-colors">Ghana</a></li>
                                <li><a href="#" className="hover:underline hover:text-[#8b5cf6] transition-colors">Ivory Coast</a></li>
                            </ul>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline hover:text-[#8b5cf6] transition-colors">Morocco</a></li>
                                <li><a href="#" className="hover:underline hover:text-[#8b5cf6] transition-colors">Nigeria</a></li>
                                <li><a href="#" className="hover:underline hover:text-[#8b5cf6] transition-colors">Senegal</a></li>
                                <li><a href="#" className="hover:underline hover:text-[#8b5cf6] transition-colors">Uganda</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 5 - Join Us & Payment */}
                    <div>
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wide text-gray-200">Join Us On</h3>
                        <div className="flex gap-3 mb-6">
                            <a href="#" className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-[#8b5cf6] transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-[#8b5cf6] transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-[#8b5cf6] transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-[#8b5cf6] transition-colors"><Youtube className="h-5 w-5" /></a>
                        </div>

                        <h3 className="font-bold text-sm mb-3 uppercase tracking-wide text-gray-200">Payment Methods</h3>
                        <div className="flex gap-2 flex-wrap">
                            <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded text-gray-200 text-[10px] font-bold border border-white/10">VISA</div>
                            <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded text-gray-200 text-[10px] font-bold border border-white/10">MASTERCARD</div>
                            <div className="bg-green-600/30 text-green-400 border border-green-500/50 px-2 py-1 rounded text-[10px] font-bold">M-PESA</div>
                            <div className="bg-red-600/30 text-red-400 border border-red-500/50 px-2 py-1 rounded text-[10px] font-bold">AIRTEL</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Compact on Mobile */}
                <div className="border-t border-white/10 pt-4 text-center text-gray-400 text-[10px] md:text-xs">
                    <p>&copy; {new Date().getFullYear()} EcoLooP Ke. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
