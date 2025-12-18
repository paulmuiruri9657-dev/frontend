'use client';

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatModal from './ChatModal';
import { useAuth } from '@/contexts/AuthContext';

interface ChatButtonProps {
    sellerId: string;
    sellerName: string;
    productId?: string;
    productTitle?: string;
}

export default function ChatButton({ sellerId, sellerName, productId, productTitle }: ChatButtonProps) {
    const { user } = useAuth();
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Don't show chat button if user is not logged in
    if (!user) {
        return null;
    }

    return (
        <>
            <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white px-6 py-3 rounded-lg hover:from-[#7c3aed] hover:to-[#0891b2] transition-all duration-150 font-semibold shadow-md hover:shadow-lg active:scale-95"
            >
                <MessageCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Chat with Seller</span>
                <span className="sm:hidden">Chat</span>
            </button>

            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                receiverId={sellerId}
                receiverName={sellerName}
                productId={productId}
                productTitle={productTitle}
            />
        </>
    );
}
