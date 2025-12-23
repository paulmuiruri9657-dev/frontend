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

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign-In Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                                    window.location.href = `${apiUrl}/auth/google`;
                                }}
                                className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
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

                            {/* Seller Additional Fields */}
                            {registerData.role === 'seller' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-4">
                                        <h3 className="text-sm font-bold text-[#8b5cf6] flex items-center gap-2">
                                            🏪 Business Details
                                        </h3>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Business Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={registerData.businessName}
                                                onChange={(e) => setRegisterData({ ...registerData, businessName: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                                placeholder="My Awesome Store"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">City *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={registerData.city}
                                                    onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                                    placeholder="Nairobi"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Region/County *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={registerData.region}
                                                    onChange={(e) => setRegisterData({ ...registerData, region: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                                    placeholder="Nairobi"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Address/Location *</label>
                                            <input
                                                type="text"
                                                required
                                                value={registerData.address}
                                                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                                placeholder="e.g. CBD, Moffat Court"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

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

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign-In Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                                    window.location.href = `${apiUrl}/auth/google`;
                                }}
                                className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
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
