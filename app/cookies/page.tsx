'use client';

import React, { useState } from 'react';
import { Cookie, Settings, Shield, BarChart } from 'lucide-react';

export default function CookiesPage() {
    const [preferences, setPreferences] = useState({
        essential: true,
        functional: true,
        analytics: false,
        marketing: false
    });

    const handleSave = () => {
        // Save preferences (would normally use localStorage or API)
        alert('Cookie preferences saved!');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Cookie Notice</h1>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <Cookie className="h-10 w-10 text-[#8b5cf6]" />
                    <div>
                        <h2 className="text-xl font-bold">We Use Cookies</h2>
                        <p className="text-gray-600">
                            To improve your experience on our website
                        </p>
                    </div>
                </div>

                <p className="text-gray-600 mb-6">
                    Cookies are small text files stored on your device that help us provide you with a better experience. This notice explains what cookies we use and how you can manage them.
                </p>

                <h3 className="text-lg font-bold mb-4">Types of Cookies We Use</h3>

                <div className="space-y-4">
                    {/* Essential Cookies */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Shield className="h-6 w-6 text-green-600" />
                                <div>
                                    <h4 className="font-bold">Essential Cookies</h4>
                                    <p className="text-sm text-gray-600">Required for the website to function properly</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-not-allowed">
                                <input
                                    type="checkbox"
                                    checked={true}
                                    disabled
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-green-600 rounded-full peer"></div>
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            These cookies are necessary for core functionality like security, session management, and accessibility. They cannot be disabled.
                        </p>
                    </div>

                    {/* Functional Cookies */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Settings className="h-6 w-6 text-blue-600" />
                                <div>
                                    <h4 className="font-bold">Functional Cookies</h4>
                                    <p className="text-sm text-gray-600">Remember your preferences and settings</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.functional}
                                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            These cookies remember your language, region, and other settings to provide a personalized experience.
                        </p>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <BarChart className="h-6 w-6 text-purple-600" />
                                <div>
                                    <h4 className="font-bold">Analytics Cookies</h4>
                                    <p className="text-sm text-gray-600">Help us improve our website</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.analytics}
                                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            These cookies collect anonymous information about how you use our website, helping us improve user experience.
                        </p>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Cookie className="h-6 w-6 text-orange-600" />
                                <div>
                                    <h4 className="font-bold">Marketing Cookies</h4>
                                    <p className="text-sm text-gray-600">Show you relevant advertisements</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.marketing}
                                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            These cookies track your browsing habits to show you personalized advertisements on our and other websites.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handleSave}
                        className="bg-[#8b5cf6] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#7c3aed] transition-colors"
                    >
                        Save Preferences
                    </button>
                    <button
                        onClick={() => setPreferences({ essential: true, functional: true, analytics: true, marketing: true })}
                        className="border border-gray-300 px-6 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                        Accept All
                    </button>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-lg font-bold mb-4">Managing Cookies in Your Browser</h3>
                <p className="text-gray-600 mb-4">
                    You can also manage cookies through your browser settings. Here&apos;s how to do it in popular browsers:
                </p>
                <ul className="space-y-2 text-gray-600">
                    <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                    <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                    <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                    <li>• <strong>Edge:</strong> Settings → Privacy, Search, and Services → Cookies</li>
                </ul>
                <p className="text-gray-600 mt-4">
                    Note that disabling certain cookies may affect website functionality.
                </p>
            </div>
        </div>
    );
}

