'use client';

import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, Wallet, ChevronDown, ChevronUp, Shield, User } from 'lucide-react';
import Link from 'next/link';

const paymentMethods = [
    {
        name: 'M-Pesa',
        icon: '📱',
        description: 'Pay instantly using your M-Pesa mobile money account',
        steps: ['Select M-Pesa at checkout', 'Enter your phone number', 'Approve the payment prompt on your phone', 'Transaction completes instantly']
    },
    {
        name: 'Airtel Money',
        icon: '📲',
        description: 'Pay using Airtel Money for quick mobile payments',
        steps: ['Select Airtel Money at checkout', 'Enter your Airtel number', 'Approve via USSD or Airtel app', 'Payment confirms in seconds']
    },
    {
        name: 'Visa / Mastercard',
        icon: '💳',
        description: 'Secure card payments with 3D Secure verification',
        steps: ['Enter your card details', 'Complete 3D Secure verification', 'Payment processes securely', 'Receive confirmation email']
    },
    {
        name: 'Cash on Delivery',
        icon: '💵',
        description: 'Pay in cash when your order arrives (select areas)',
        steps: ['Choose Cash on Delivery', 'Prepare exact amount', 'Pay the delivery agent', 'Receive your order receipt']
    }
];

const accountFaqs = [
    {
        q: 'How do I create an account?',
        a: 'Click "Sign In" at the top of the page, then select "Create Account". Enter your email, phone number, and create a password. Verify via OTP sent to your phone.'
    },
    {
        q: 'I forgot my password. How do I reset it?',
        a: 'Click "Sign In", then "Forgot Password". Enter your email or phone number and we\'ll send you a reset link or OTP.'
    },
    {
        q: 'How do I update my account information?',
        a: 'Go to My Account > Profile Settings. You can update your name, email, phone number, and password. Some changes may require verification.'
    },
    {
        q: 'How do I add or change my delivery address?',
        a: 'Go to My Account > Address Book. You can add new addresses, edit existing ones, or set a default delivery address.'
    },
    {
        q: 'Is my payment information secure?',
        a: 'Yes! We use SSL encryption and never store your full card details. All card payments are processed through secure payment gateways with 3D Secure verification.'
    },
    {
        q: 'How do I delete my account?',
        a: 'Contact our support team to request account deletion. Note that this action is permanent and you will lose your order history and saved information.'
    }
];

export default function PaymentPage() {
    const [openMethod, setOpenMethod] = useState<number | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Payment & Account</h1>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-[#8b5cf6]" />
                    Payment Methods
                </h2>

                <div className="space-y-4">
                    {paymentMethods.map((method, idx) => (
                        <div key={method.name} className="border border-gray-200 rounded-lg">
                            <button
                                onClick={() => setOpenMethod(openMethod === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{method.icon}</span>
                                    <div>
                                        <h3 className="font-bold">{method.name}</h3>
                                        <p className="text-sm text-gray-600">{method.description}</p>
                                    </div>
                                </div>
                                {openMethod === idx ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>
                            {openMethod === idx && (
                                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                                    <h4 className="font-medium mb-2">How to pay with {method.name}:</h4>
                                    <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
                                        {method.steps.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Security */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-[#8b5cf6]" />
                    Payment Security
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-3xl mb-2">🔒</div>
                        <h3 className="font-bold text-green-800">SSL Encrypted</h3>
                        <p className="text-sm text-green-600">All transactions are encrypted</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="text-3xl mb-2">✓</div>
                        <h3 className="font-bold text-blue-800">3D Secure</h3>
                        <p className="text-sm text-blue-600">Extra verification for cards</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                        <div className="text-3xl mb-2">🛡️</div>
                        <h3 className="font-bold text-purple-800">Buyer Protection</h3>
                        <p className="text-sm text-purple-600">100% refund guarantee</p>
                    </div>
                </div>
            </div>

            {/* Account Management */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="h-6 w-6 text-[#8b5cf6]" />
                    Account Management
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Link href="/account" className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors">
                        <div className="text-2xl mb-2">👤</div>
                        <p className="text-sm font-medium">My Profile</p>
                    </Link>
                    <Link href="/orders" className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors">
                        <div className="text-2xl mb-2">📦</div>
                        <p className="text-sm font-medium">My Orders</p>
                    </Link>
                    <Link href="/wishlist" className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors">
                        <div className="text-2xl mb-2">❤️</div>
                        <p className="text-sm font-medium">Wishlist</p>
                    </Link>
                    <Link href="/account" className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors">
                        <div className="text-2xl mb-2">📍</div>
                        <p className="text-sm font-medium">Addresses</p>
                    </Link>
                </div>
            </div>

            {/* Account FAQs */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-xl font-bold mb-6">Account & Payment FAQs</h2>
                <div className="space-y-2">
                    {accountFaqs.map((faq, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg">
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                            >
                                <span className="font-medium">{faq.q}</span>
                                {openFaq === idx ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>
                            {openFaq === idx && (
                                <div className="px-4 pb-4 text-gray-600">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Need Help */}
            <div className="bg-gray-100 rounded-lg p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Payment Issues?</h2>
                <p className="text-gray-600 mb-6">Our support team can help with payment problems</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/help/chat" className="bg-[#8b5cf6] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#7c3aed] transition-colors">
                        Chat with Us
                    </Link>
                    <a href="https://wa.me/254705424364" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-800 px-6 py-2 rounded-lg font-bold border border-gray-300 hover:bg-gray-50 transition-colors">
                        WhatsApp 0705424364
                    </a>
                </div>
            </div>
        </div>
    );
}

