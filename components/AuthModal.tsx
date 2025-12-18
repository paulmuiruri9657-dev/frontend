'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialIsLogin?: boolean;
}

export default function AuthModal({ isOpen, onClose, initialIsLogin = true }: AuthModalProps) {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(initialIsLogin);
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Form data
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        email: '', password: '', firstName: '', lastName: '', phone: '', role: 'user' as 'user' | 'seller',
        businessName: '', address: '', city: '', region: ''
    });

    if (!isOpen) return null;

    // Handle login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');

        try {
            await login(loginData.email, loginData.password);
            onClose();
            setLoginData({ email: '', password: '' });
        } catch (error: any) {
            setAuthError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setAuthLoading(false);
        }
    };

    // Handle register
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');

        try {
            await register(registerData);
            onClose();
            setRegisterData({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'user', businessName: '', address: '', city: '', region: '' });
        } catch (error: any) {
            setAuthError(error.message || 'Registration failed. Please try again.');
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-white/20 animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 via-white to-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {isLogin ? 'Welcome Back!' : 'Join EcoLooP'}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            {isLogin ? 'Sign in to continue shopping' : 'Create an account to get started'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8">
                    {authError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 animate-pulse">
                            <span className="text-lg">⚠️</span> {authError}
                        </div>
                    )}

                    {isLogin ? (
                        /* Login Form */
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] text-gray-900 font-medium bg-gray-50/50 transition-all placeholder:text-gray-400"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] pr-12 text-gray-900 font-medium bg-gray-50/50 transition-all placeholder:text-gray-400"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#8b5cf6] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-[#8b5cf6] text-white font-bold py-4 rounded-xl hover:bg-[#7c3aed] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none text-base mt-2"
                            >
                                {authLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>
                    ) : (
                        /* Register Form */
                        <form onSubmit={handleRegister} className="space-y-5">
                            {/* Role Selection */}
                            <div className="bg-purple-50 p-1.5 rounded-xl border border-purple-100 flex gap-2 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setRegisterData({ ...registerData, role: 'user' })}
                                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${registerData.role === 'user'
                                        ? 'bg-white text-[#8b5cf6] shadow-sm ring-1 ring-black/5'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                        }`}
                                >
                                    🛍️ Shopper
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRegisterData({ ...registerData, role: 'seller' })}
                                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${registerData.role === 'seller'
                                        ? 'bg-white text-[#8b5cf6] shadow-sm ring-1 ring-black/5'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                        }`}
                                >
                                    🏪 Seller
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={registerData.firstName}
                                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] text-gray-900 font-medium bg-gray-50/50"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={registerData.lastName}
                                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] text-gray-900 font-medium bg-gray-50/50"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] text-gray-900 font-medium bg-gray-50/50"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                                    Phone Number {registerData.role === 'seller' && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="tel"
                                    required={registerData.role === 'seller'}
                                    value={registerData.phone}
                                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] text-gray-900 font-medium bg-gray-50/50"
                                    placeholder="+254 712 345 678"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] pr-12 text-gray-900 font-medium bg-gray-50/50"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#8b5cf6] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-[#8b5cf6] text-white font-bold py-4 rounded-xl hover:bg-[#7c3aed] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none text-base mt-4"
                            >
                                {authLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : 'Create Free Account'}
                            </button>
                        </form>
                    )}

                    {/* Toggle between login/register */}
                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        {isLogin ? (
                            <p className="text-gray-600 font-medium text-sm">
                                New to EcoLooP?{' '}
                                <button
                                    onClick={() => { setIsLogin(false); setAuthError(''); }}
                                    className="text-[#8b5cf6] font-bold hover:text-[#7c3aed] hover:underline transition-colors ml-1"
                                >
                                    Create an account
                                </button>
                            </p>
                        ) : (
                            <p className="text-gray-600 font-medium text-sm">
                                Already have an account?{' '}
                                <button
                                    onClick={() => { setIsLogin(true); setAuthError(''); }}
                                    className="text-[#8b5cf6] font-bold hover:text-[#7c3aed] hover:underline transition-colors ml-1"
                                >
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
