'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, CreditCard, CheckCircle, ChevronRight, ArrowLeft, Truck, Shield, Phone, Smartphone } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

type Step = 1 | 2 | 3;

const COUNTIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Machakos', 'Meru', 'Kakamega'];

export default function CheckoutPage() {
    const { cart } = useCartStore();
    const [step, setStep] = useState<Step>(1);
    const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');

    // Step 1 — Shipping
    const [shipping, setShipping] = useState({ firstName: '', lastName: '', phone: '', address: '', county: '', notes: '' });

    // Step 2 — Payment
    const [payMethod, setPayMethod] = useState<'mpesa' | 'card' | 'cod'>('mpesa');
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);

    const goTo = (next: Step, dir: 'forward' | 'back') => {
        setAnimDir(dir);
        setTimeout(() => setStep(next), 50);
    };

    const handlePlaceOrder = async () => {
        setPlacing(true);
        await new Promise(r => setTimeout(r, 1800)); // Simulate API call
        setPlacing(false);
        setPlaced(true);
    };

    const formatCard = (v: string) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    const formatExpiry = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

    if (placed) {
        return (
            <div className="min-h-screen bg-[#f1f1f2] flex items-center justify-center px-4">
                <div className="bg-white rounded-[32px] shadow-2xl p-12 text-center max-w-lg w-full">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="h-14 w-14 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-3">Order Placed! 🎉</h1>
                    <p className="text-gray-500 mb-8">Your order is confirmed and will be delivered to <strong>{shipping.county}</strong>. You'll receive an SMS update shortly.</p>
                    <Link href="/" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-4 rounded-2xl font-black text-lg hover:shadow-lg transition-all">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const stepValid = {
        1: shipping.firstName && shipping.lastName && shipping.phone && shipping.address && shipping.county,
        2: payMethod === 'mpesa' ? mpesaPhone.length >= 10 : payMethod === 'cod' ? true : card.number && card.expiry && card.cvv && card.name,
    };

    return (
        <div className="min-h-screen bg-[#f1f1f2] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cart" className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900">Secure Checkout</h1>
                    <Shield className="h-5 w-5 text-green-500 ml-auto" />
                </div>

                {/* Step Progress */}
                <div className="flex items-center gap-2 mb-8">
                    {[{ n: 1, label: 'Shipping', icon: <MapPin className="h-4 w-4" /> }, { n: 2, label: 'Payment', icon: <CreditCard className="h-4 w-4" /> }, { n: 3, label: 'Review', icon: <CheckCircle className="h-4 w-4" /> }].map(({ n, label, icon }, i) => (
                        <React.Fragment key={n}>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${step >= n ? 'bg-[#8b5cf6] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                {icon} {label}
                            </div>
                            {i < 2 && <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Panels */}
                <div className={`transition-all duration-300 ease-out ${animDir === 'forward' ? 'animate-[slideInRight_0.3s_ease-out]' : 'animate-[slideInLeft_0.3s_ease-out]'}`}>

                    {/* STEP 1: Shipping */}
                    {step === 1 && (
                        <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><Truck className="h-5 w-5 text-[#8b5cf6]" /> Delivery Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="First Name" value={shipping.firstName} onChange={v => setShipping({ ...shipping, firstName: v })} />
                                <Field label="Last Name" value={shipping.lastName} onChange={v => setShipping({ ...shipping, lastName: v })} />
                            </div>
                            <Field label="Phone Number" value={shipping.phone} onChange={v => setShipping({ ...shipping, phone: v })} type="tel" icon={<Phone className="h-4 w-4 text-gray-400" />} />
                            <Field label="Delivery Address" value={shipping.address} onChange={v => setShipping({ ...shipping, address: v })} />
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">County</label>
                                <select
                                    value={shipping.county}
                                    onChange={e => setShipping({ ...shipping, county: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] bg-gray-50 text-sm"
                                >
                                    <option value="">Select County</option>
                                    {COUNTIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <Field label="Order Notes (Optional)" value={shipping.notes} onChange={v => setShipping({ ...shipping, notes: v })} />
                            <button
                                onClick={() => goTo(2, 'forward')}
                                disabled={!stepValid[1]}
                                className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-[0_8px_25px_rgba(139,92,246,0.4)] transition-all active:scale-95"
                            >
                                Continue to Payment <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Payment */}
                    {step === 2 && (
                        <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><CreditCard className="h-5 w-5 text-[#8b5cf6]" /> Payment Method</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'mpesa', label: 'M-PESA', icon: <Smartphone className="h-6 w-6" />, color: 'green' },
                                    { id: 'card', label: 'Card', icon: <CreditCard className="h-6 w-6" />, color: 'blue' },
                                    { id: 'cod', label: 'Cash on Delivery', icon: <Truck className="h-6 w-6" />, color: 'orange' },
                                ].map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setPayMethod(m.id as any)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${payMethod === m.id ? 'border-[#8b5cf6] bg-purple-50 text-[#8b5cf6]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        {m.icon} {m.label}
                                    </button>
                                ))}
                            </div>

                            {payMethod === 'mpesa' && (
                                <Field label="M-PESA Phone Number" value={mpesaPhone} onChange={setMpesaPhone} type="tel" placeholder="07XX XXX XXX" />
                            )}
                            {payMethod === 'card' && (
                                <div className="space-y-4">
                                    <Field label="Cardholder Name" value={card.name} onChange={v => setCard({ ...card, name: v })} />
                                    <Field label="Card Number" value={card.number} onChange={v => setCard({ ...card, number: formatCard(v) })} placeholder="1234 5678 9012 3456" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Expiry" value={card.expiry} onChange={v => setCard({ ...card, expiry: formatExpiry(v) })} placeholder="MM/YY" />
                                        <Field label="CVV" value={card.cvv} onChange={v => setCard({ ...card, cvv: v.slice(0, 4) })} type="password" placeholder="•••" />
                                    </div>
                                </div>
                            )}
                            {payMethod === 'cod' && (
                                <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-2xl p-4">
                                    <Truck className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium text-orange-700">Pay with cash when your order arrives. Please have the exact amount ready for the delivery agent.</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => goTo(1, 'back')} className="flex-shrink-0 px-5 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => goTo(3, 'forward')}
                                    disabled={!stepValid[2]}
                                    className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-[0_8px_25px_rgba(139,92,246,0.4)] transition-all active:scale-95"
                                >
                                    Review Order <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Review & Confirm */}
                    {step === 3 && (
                        <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-[#8b5cf6]" /> Review Your Order</h2>

                            {/* Shipping Summary */}
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Delivery To</p>
                                    <button onClick={() => goTo(1, 'back')} className="text-xs text-[#8b5cf6] font-bold hover:underline">Edit</button>
                                </div>
                                <p className="font-bold text-gray-900">{shipping.firstName} {shipping.lastName}</p>
                                <p className="text-sm text-gray-600">{shipping.address}, {shipping.county}</p>
                                <p className="text-sm text-gray-600">{shipping.phone}</p>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Payment</p>
                                    <button onClick={() => goTo(2, 'back')} className="text-xs text-[#8b5cf6] font-bold hover:underline">Edit</button>
                                </div>
                                <p className="font-bold text-gray-900 capitalize">
                                    {payMethod === 'mpesa' ? `M-PESA — ${mpesaPhone}` : payMethod === 'card' ? `Card ending in ${card.number.slice(-4)}` : 'Cash on Delivery'}
                                </p>
                            </div>

                            {/* Cart Items */}
                            {cart?.items?.map(item => (
                                <div key={item.product._id} className="flex items-center gap-4 border-b pb-4">
                                    <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                        <img src={item.product.images?.[0]} alt={item.product.title} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.product.title}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-black text-[#8b5cf6]">KSh {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}

                            {/* Total */}
                            <div className="flex justify-between items-end pt-2">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total</p>
                                    <p className="text-3xl font-black text-gray-900">KSh {cart?.total?.toLocaleString()}</p>
                                </div>
                                <p className="text-xs text-gray-400">VAT Included</p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => goTo(2, 'back')} className="flex-shrink-0 px-5 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={placing}
                                    className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:shadow-[0_8px_25px_rgba(139,92,246,0.4)] transition-all active:scale-95 disabled:opacity-60"
                                >
                                    {placing ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <><CheckCircle className="h-5 w-5" /> Place Order</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, type = 'text', icon, placeholder }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; icon?: React.ReactNode; placeholder?: string;
}) {
    return (
        <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
            <div className={`flex items-center gap-2 border border-gray-200 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-[#8b5cf6] focus-within:bg-white transition-all ${icon ? 'px-4' : ''}`}>
                {icon}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 font-medium text-sm placeholder-gray-300"
                    style={icon ? { paddingLeft: 0 } : {}}
                />
            </div>
        </div>
    );
}
