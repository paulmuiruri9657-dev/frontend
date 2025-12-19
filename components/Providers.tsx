'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import IntroAnimation from './IntroAnimation';

export default function Providers({ children }: { children: ReactNode }) {
    useAnalytics();

    return (
        <AuthProvider>
            <SocketProvider>
                <IntroAnimation />
                {children}
            </SocketProvider>
        </AuthProvider>
    );
}

