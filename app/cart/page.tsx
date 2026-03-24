'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';
import ProductRecommendations from '@/components/ProductRecommendations';
import ProductCard from '@/components/ProductCard';
import { CartItem } from '@/types';

export default function CartPage() {
    const { cart, loading, fetchCart, updateQuantity, removeFromCart, clearCart } = useCartStore();
    const { recentlyViewed } = useRecentlyViewedStore();
    const [isClient, setIsClient] = useState(false); // Used to wait for hydration for Zustand

    useEffect(() => {
        setIsClient(true);
        fetchCart();
    }, [fetchCart]);

    if (loading && !cart) {
        return (
            <div className="min-h-screen bg-[#f1f1f2] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8b5cf6] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold animate-pulse">Setting up your cart...</p>
                </div>
            </div>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="min-h-screen bg-[#f1f1f2] py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4">
                
                {isEmpty ? (
                    // Empty Cart State
                    <div className="flex items-center justify-center mb-16 mt-8">
                        <div className="bg-white rounded-[32px] shadow-sm p-12 text-center max-w-lg w-full transform transition-all border border-gray-100">
                            <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <ShoppingBag className="h-12 w-12 text-[#8b5cf6]" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-3">Your cart is empty!</h2>
                            <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your cart yet. Let's find something special for you!</p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white px-8 py-4 rounded-2xl font-black text-lg hover:shadow-[0_10px_20px_rgba(139,92,246,0.3)] transition-all active:scale-95 w-full block"
                            >
                                <ArrowLeft className="h-6 w-6" />
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Populated Cart State
                    <>
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
                                <p className="text-gray-500 mt-1 font-medium">{cart?.items?.length || 0} {(cart?.items?.length || 0) === 1 ? 'item' : 'items'} in your bag</p>
                            </div>
                            <button
                                onClick={() => clearCart()}
                                className="text-gray-400 hover:text-red-500 flex items-center gap-2 text-sm font-bold transition-colors group bg-white px-4 py-2 rounded-xl border border-gray-200"
                            >
                                <Trash2 className="h-5 w-5 group-hover:animate-bounce text-red-400" />
                                Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Cart Items List */}
                            <div className="lg:col-span-8 space-y-6">
                                {cart.items.map((item: CartItem) => (
                                    <div
                                        key={item.product._id}
                                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 transition-all hover:shadow-md group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                                        <Link
                                            href={`/product/${item.product.slug}`}
                                            className="flex-shrink-0 bg-gray-50 rounded-2xl p-4 w-full md:w-40 h-40 flex items-center justify-center transform transition-transform group-hover:scale-105"
                                        >
                                            <img
                                                src={item.product.images?.[0] || '/placeholder.png'}
                                                alt={item.product.title}
                                                className="max-w-full max-h-full object-contain mix-blend-multiply"
                                            />
                                        </Link>

                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <div className="flex-1">
                                                    <Link href={`/product/${item.product.slug}`}>
                                                        <h3 className="font-bold text-xl text-gray-900 hover:text-[#8b5cf6] transition-colors line-clamp-2 leading-tight">
                                                            {item.product.title}
                                                        </h3>
                                                    </Link>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-[#8b5cf6] bg-purple-50 px-2.5 py-1 rounded-full">
                                                            Official Store
                                                        </span>
                                                        <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                                                            In Stock
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product._id)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-full hover:bg-red-50"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>

                                            <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl font-black text-gray-900">
                                                            KSh {item.price.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {item.product.oldPrice && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-gray-400 line-through font-medium">
                                                                KSh {item.product.oldPrice.toLocaleString()}
                                                            </span>
                                                            <span className="text-orange-500 font-bold bg-orange-50 px-2 rounded">
                                                                -{Math.round(((item.product.oldPrice - item.price) / item.product.oldPrice) * 100)}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-inner">
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-[#8b5cf6] hover:text-white transition-all active:scale-90"
                                                        >
                                                            <Minus className="h-5 w-5" />
                                                        </button>
                                                        <span className="w-14 text-center font-black text-lg text-gray-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-[#8b5cf6] hover:text-white transition-all active:scale-90"
                                                        >
                                                            <Plus className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Subtotal</div>
                                                        <div className="text-xl font-black text-[#8b5cf6]">
                                                            KSh {(item.price * item.quantity).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-8">
                                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-2xl"><Truck className="h-6 w-6 text-blue-600" /></div>
                                        <div className="text-sm font-bold text-gray-900">Fast Delivery</div>
                                    </div>
                                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white flex items-center gap-4">
                                        <div className="bg-green-100 p-3 rounded-2xl"><ShieldCheck className="h-6 w-6 text-green-600" /></div>
                                        <div className="text-sm font-bold text-gray-900">Secure Payment</div>
                                    </div>
                                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white flex items-center gap-4">
                                        <div className="bg-orange-100 p-3 rounded-2xl"><RotateCcw className="h-6 w-6 text-orange-600" /></div>
                                        <div className="text-sm font-bold text-gray-900">Easy Returns</div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary Sidebar */}
                            <div className="lg:col-span-4">
                                <div className="bg-white rounded-[32px] shadow-2xl shadow-purple-500/10 border border-gray-100 p-8 sticky top-28 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/5 rounded-bl-full -z-10"></div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                        <CreditCard className="h-7 w-7 text-[#8b5cf6]" />
                                        Summary
                                    </h2>
                                    <div className="space-y-6 mb-8 text-lg font-medium">
                                        <div className="flex justify-between items-center text-gray-500">
                                            <span>Item Total</span>
                                            <span className="text-gray-900">KSh {cart.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-500">
                                            <span>Delivery Fee</span>
                                            <span className="text-green-600 font-bold">
                                                {cart.shipping > 0 ? `KSh ${cart.shipping.toLocaleString()}` : 'FREE'}
                                            </span>
                                        </div>
                                        {cart.discount > 0 && (
                                            <div className="flex justify-between items-center bg-green-50 px-4 py-3 rounded-2xl border border-green-100">
                                                <span className="text-green-600">Savings</span>
                                                <span className="text-green-600 font-black">-KSh {cart.discount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="h-px bg-gray-100 my-4"></div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Total to pay</div>
                                                <span className="text-3xl font-black text-gray-900">KSh {cart.total.toLocaleString()}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-400 font-medium">VAT Included</span>
                                            </div>
                                        </div>
                                    </div>

                                    <a href="/checkout" className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-5 rounded-2xl font-black text-xl hover:shadow-[0_15px_30px_rgba(139,92,246,0.4)] transition-all active:scale-95 flex items-center justify-center gap-4 group">
                                        Checkout
                                        <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* --- Live Features: Cross-sells & History --- */}
                <div className="mt-8 space-y-8 mb-12">
                    {/* Recently Viewed Carousel */}
                    {isClient && recentlyViewed && recentlyViewed.length > 0 && (
                        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-purple-100 p-2 rounded-xl text-[#8b5cf6]"><RotateCcw className="h-6 w-6" /></div>
                                <h2 className="text-2xl font-black text-gray-900">Recently Viewed</h2>
                            </div>
                            <div className="relative -mx-2 md:mx-0">
                                <div className="flex gap-4 overflow-x-auto px-2 md:px-0 pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#8b5cf6] scrollbar-track-gray-100" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                    {recentlyViewed.map((product) => (
                                        <div key={product._id} className="flex-none w-[180px] md:w-[220px] snap-start transition-transform hover:-translate-y-2 pb-4 pt-2">
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Cross-Sells */}
                    <ProductRecommendations type="trending" title="You May Also Like" limit={12} />
                </div>

            </div>
        </div>
    );
}

const ChevronRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);
