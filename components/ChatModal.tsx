'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiverId: string;
    receiverName: string;
    productId?: string;
    productTitle?: string;
}

interface Message {
    _id: string;
    sender: { _id: string; firstName: string; lastName: string; avatar?: string };
    message: string;
    createdAt: string;
    read: boolean;
}

export default function ChatModal({
    isOpen,
    onClose,
    receiverId,
    receiverName,
    productId,
    productTitle
}: ChatModalProps) {
    const { user } = useAuth();
    const { socket, isConnected, sendMessage, markAsRead, joinConversation } = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize conversation
    useEffect(() => {
        if (!isOpen || !user) return;

        const initConversation = async () => {
            try {
                setLoading(true);
                const response = await api.createConversation(receiverId, productId);
                const conversation = response.data;
                setConversationId(conversation._id);

                // Join conversation room
                joinConversation(conversation._id);

                // Fetch messages
                const messagesResponse = await api.getMessages(conversation._id);
                setMessages(messagesResponse.data || []);

                // Mark as read
                markAsRead(conversation._id);
            } catch (error) {
                console.error('Error initializing conversation:', error);
            } finally {
                setLoading(false);
            }
        };

        initConversation();
    }, [isOpen, user, receiverId, productId]);

    // Listen for new messages
    useEffect(() => {
        if (!socket || !conversationId) return;

        const handleNewMessage = (message: Message) => {
            setMessages(prev => [...prev, message]);

            // Mark as read if modal is open
            if (isOpen && message.sender._id !== user?.id) {
                markAsRead(conversationId);
            }

            // Scroll to bottom
            setTimeout(() => scrollToBottom(), 100);
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [socket, conversationId, isOpen, user]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Send message
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId) return;

        sendMessage({
            conversationId,
            receiverId,
            message: newMessage.trim()
        });

        setNewMessage('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] p-4 rounded-t-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-lg">{receiverName}</h3>
                        {productTitle && (
                            <p className="text-white/90 text-sm">About: {productTitle}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8b5cf6]"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <MessageCircle className="h-12 w-12 mb-2" />
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isOwnMessage = msg.sender._id === user?.id;
                            return (

                                <div
                                    key={msg._id}
                                    className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    {!isOwnMessage && (
                                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                            {msg.sender.avatar ? (
                                                <img src={msg.sender.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-[#8b5cf6] text-white text-[10px] font-bold">
                                                    {msg.sender.firstName?.[0]}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${isOwnMessage
                                            ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white'
                                            : 'bg-white border border-gray-200 text-gray-900'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.message}</p>
                                        <div className={`flex items-center justify-end gap-1 mt-1`}>
                                            <p className={`text-[10px] ${isOwnMessage ? 'text-white/70' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            {isOwnMessage && (
                                                <span className="text-white/70 text-[10px]">
                                                    {msg.read ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent"
                            disabled={!isConnected}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || !isConnected}
                            className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white px-6 py-2 rounded-lg hover:from-[#7c3aed] hover:to-[#6d28d9] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="h-4 w-4" />
                            Send
                        </button>
                    </div>
                    {!isConnected && (
                        <p className="text-xs text-red-500 mt-2">Connecting to chat...</p>
                    )}
                </form>
            </div>
        </div>
    );
}
