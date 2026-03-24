'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface Seller {
    id: string;
    businessName: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    isVerified: boolean;
    rating: number;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone?: string;
    avatar?: string;
    role: 'user' | 'seller' | 'admin';
    wishlist?: any[];
    addresses?: any[];
    seller?: Seller;
    createdAt?: string;
    verificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
    verificationData?: {
        businessName?: string;
        businessType?: string;
        idNumber?: string;
        description?: string;
        submittedAt?: string;
        reviewedAt?: string;
        rejectionReason?: string;
    };
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'user' | 'seller';
    // Seller-specific fields
    businessName?: string;
    businessRegistrationNumber?: string;
    taxId?: string;
    address?: string;
    city?: string;
    region?: string;
    bankDetails?: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    googleLogin: (credential: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check auth on mount and whenever localStorage changes
    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await api.getMe();
                setUser(response.data);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();

        // Listen for storage changes (e.g., logout in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken') {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.login(email, password);
        setUser(response.data.user);
    };

    const googleLogin = async (credential: string) => {
        const response = await api.googleLogin(credential);
        setUser(response.data.user);
    };

    const register = async (data: RegisterData) => {
        const response = await api.register(data);
        setUser(response.data.user);
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

