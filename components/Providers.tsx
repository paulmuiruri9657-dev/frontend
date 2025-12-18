'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <SocketProvider>
                {children}
            </SocketProvider>
        </AuthProvider>
    );
}

