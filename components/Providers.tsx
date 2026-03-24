'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import IntroAnimation from './IntroAnimation';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }: { children: ReactNode }) {
    useAnalytics();

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <ThemeProvider>
                <AuthProvider>
                    <SocketProvider>
                        <IntroAnimation />
                        {children}
                    </SocketProvider>
                </AuthProvider>
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
}

