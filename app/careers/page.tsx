'use client';

import React from 'react';
import { Briefcase, MapPin, Clock, ChevronRight, Users, Rocket, Heart, Globe, Target, Award } from 'lucide-react';
import Link from 'next/link';

const jobOpenings = [
    { title: 'Software Engineer', department: 'Technology', location: 'Nairobi, Kenya', type: 'Full-time', description: 'Join our engineering team to build scalable e-commerce solutions.' },
    { title: 'Product Manager', department: 'Product', location: 'Nairobi, Kenya', type: 'Full-time', description: 'Drive product strategy and roadmap for our marketplace.' },
    { title: 'Customer Service Representative', department: 'Operations', location: 'Nairobi, Kenya', type: 'Full-time', description: 'Help customers with their orders and inquiries.' },
    { title: 'Logistics Coordinator', department: 'Logistics', location: 'Mombasa, Kenya', type: 'Full-time', description: 'Oversee delivery operations and optimize logistics.' },
    { title: 'Marketing Manager', department: 'Marketing', location: 'Nairobi, Kenya', type: 'Full-time', description: 'Lead marketing campaigns and brand initiatives.' },
    { title: 'Data Analyst', department: 'Technology', location: 'Remote', type: 'Full-time', description: 'Analyze data to drive business decisions and growth.' }
];

const benefits = [
    { icon: Heart, title: 'Health Insurance', desc: 'Comprehensive medical cover for you and your family' },
    { icon: Rocket, title: 'Career Growth', desc: 'Clear paths for advancement and skill development' },
    { icon: Users, title: 'Great Team', desc: 'Work with talented people from diverse backgrounds' },
    { icon: Globe, title: 'Impact', desc: 'Make a difference in millions of lives across Africa' },
    { icon: Target, title: 'Flexibility', desc: 'Work-life balance with flexible arrangements' },
    { icon: Award, title: 'Recognition', desc: 'Performance bonuses and achievement awards' }
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero - Edge to Edge */}
            <section className="px-0 md:px-4">
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white py-16 md:py-20 px-4 md:rounded-lg">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Join EcoLooP Ke</h1>
                        <p className="text-base md:text-xl text-white/95 leading-relaxed">
                            Be part of Africa's leading e-commerce revolution. We're looking for talented individuals to help us shape the future of online shopping.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 py-8 md:py-10">
                <div className="bg-white px-4 py-8 md:px-8 md:py-10 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Why Work With Us?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-3 md:p-6 text-center border border-purple-100">
                                <benefit.icon className="h-8 w-8 md:h-10 md:w-10 text-[#8b5cf6] mx-auto mb-2 md:mb-4" />
                                <h3 className="font-bold text-xs md:text-base mb-1 md:mb-2">{benefit.title}</h3>
                                <p className="text-gray-600 text-[10px] md:text-sm leading-tight">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Openings - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 pb-8">
                <div className="bg-white px-4 py-6 md:px-8 md:py-8 md:rounded-lg md:shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Open Positions ({jobOpenings.length})</h2>
                    <div className="space-y-3 md:space-y-4">
                        {jobOpenings.map((job, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow border border-gray-200">
                                <div className="flex flex-col gap-3 md:gap-4">
                                    <div>
                                        <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1">{job.title}</h3>
                                        <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">{job.description}</p>
                                        <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
                                            <span className="flex items-center gap-1 text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                                                <Briefcase className="h-3 w-3 md:h-4 md:w-4" /> {job.department}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                                                <MapPin className="h-3 w-3 md:h-4 md:w-4" /> {job.location}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                                                <Clock className="h-3 w-3 md:h-4 md:w-4" /> {job.type}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="flex items-center justify-center gap-1 bg-[#8b5cf6] text-white px-4 py-2 md:py-2.5 rounded-lg font-semibold text-sm hover:bg-[#7c3aed] transition-all hover:shadow-md w-full md:w-auto">
                                        Apply Now <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA - Edge to Edge on Mobile */}
            <section className="px-0 md:px-4 pb-0 md:pb-8">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-10 md:px-8 md:py-12 md:rounded-lg text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Don't See the Right Role?</h2>
                    <p className="text-sm md:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
                        Send us your CV and we'll keep you in mind for future opportunities.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-[#8b5cf6] text-white px-8 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-[#7c3aed] transition-all hover:shadow-lg"
                    >
                        Send Your CV
                    </Link>
                </div>
            </section>
        </div>
    );
}
