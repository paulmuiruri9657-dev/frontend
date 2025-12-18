'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, ArrowLeft, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { api } from '@/lib/api';

interface Conversation {
    _id: string;
    participants: Array<{
        _id: string;
        firstName: string;
        lastName: string;
    }>;
    productId?: {
        _id: string;
        title: string;
        images: string[];
    };
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: Map<string, number>;
}

interface Message {
    _id: string;
    sender: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    message: string;
    createdAt: string;
    read: boolean;
}

export default function MessagesPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { socket, isConnected, sendMessage, markAsRead, joinConversation } = useSocket();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch conversations
    useEffect(() => {
        if (!user) {
            router.push('/');
            return;
        }

        const fetchConversations = async () => {
            try {
                const response = await api.getConversations();
                setConversations(response.data || []);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [user, router]);

    // Fetch messages when conversation is selected
    useEffect(() => {
        if (!selectedConversation) return;

        const fetchMessages = async () => {
            try {
                const response = await api.getMessages(selectedConversation._id);
                setMessages(response.data || []);

                // Join conversation room
                joinConversation(selectedConversation._id);

                // Mark as read
                markAsRead(selectedConversation._id);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [selectedConversation]);

    // REAL-TIME CONVERSATION LIST UPDATES - Update preview when new message arrives
    useEffect(() => {
        if (!socket) return;

        const handleConversationUpdate = (message: any) => {
            console.log('📬 Updating conversation list with new message');

            // Update the conversation in the list
            setConversations(prevConvs => {
                const updated = prevConvs.map(conv => {
                    if (conv._id === message.conversationId) {
                        return {
                            ...conv,
                            lastMessage: message.message,
                            lastMessageAt: message.createdAt
                        };
                    }
                    return conv;
                });

                // Sort: move updated conversation to top
                return updated.sort((a, b) =>
                    new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
                );
            });
        };

        socket.on('new_message', handleConversationUpdate);

        return () => {
            socket.off('new_message', handleConversationUpdate);
        };
    }, [socket]);

    // Listen for new messages - REAL-TIME AUTO-REFRESH
    useEffect(() => {
        if (!socket || !selectedConversation) return;

        const handleNewMessage = (message: Message) => {
            // Prevent duplicate if this is our own optimistic message
            setMessages(prev => {
                // Remove temporary optimistic message if exists
                const withoutTemp = prev.filter(msg => !msg._id.startsWith('temp-'));
                // Check if message already exists (avoid duplicates)
                const exists = withoutTemp.some(msg => msg._id === message._id);
                if (exists) return prev;

                return [...withoutTemp, message];
            });

            // Mark as read if from other person
            if (message.sender._id !== user?.id) {
                markAsRead(selectedConversation._id);
            }

            // Instant scroll to bottom
            requestAnimationFrame(() => {
                const messagesContainer = document.getElementById('messages-container');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            });
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [socket, selectedConversation, user]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || !isConnected) return;

        const messageText = newMessage.trim();
        const otherParticipant = getOtherParticipant(selectedConversation);

        // Optimistic UI update - add message immediately
        const optimisticMessage: Message = {
            _id: `temp-${Date.now()}`,
            sender: {
                _id: user?.id || '',
                firstName: user?.firstName || '',
                lastName: user?.lastName || ''
            },
            message: messageText,
            createdAt: new Date().toISOString(),
            read: false
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');

        // Instant scroll
        requestAnimationFrame(() => {
            const messagesContainer = document.getElementById('messages-container');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });

        // Send to server in background
        try {
            sendMessage({
                conversationId: selectedConversation._id,
                receiverId: otherParticipant?._id || '',
                message: messageText
            });
        } catch (error) {
            console.error('Error sending message:', error);
            // Remove optimistic message on error
            setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
            setNewMessage(messageText); // Restore message
        }
    };

    const getOtherParticipant = (conversation: Conversation) => {
        return conversation.participants.find(p => p._id !== user?.id);
    };

    const filteredConversations = conversations.filter(conv => {
        const otherParticipant = getOtherParticipant(conv);
        const participantName = `${otherParticipant?.firstName} ${otherParticipant?.lastName}`;
        const productTitle = conv.productId?.title?.toLowerCase() || '';
        return participantName.includes(searchQuery.toLowerCase()) ||
            productTitle.includes(searchQuery.toLowerCase());
    });

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Edge-to-edge container on mobile */}
            <div className="px-0 md:px-4 md:py-6">
                <div className="bg-white md:rounded-lg md:shadow-lg overflow-hidden h-screen md:h-[calc(100vh-120px)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                        {/* Conversations List - Edge to edge on mobile */}
                        <div className={`border-r-0 md:border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                            {/* Header - Compact on mobile */}
                            <div className="px-3 py-3 md:p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-cyan-50">
                                <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Messages</h1>
                                <div className="relative">
                                    <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Conversations - Scrollable */}
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8b5cf6]"></div>
                                    </div>
                                ) : filteredConversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
                                        <MessageCircle className="h-12 w-12 mb-2" />
                                        <p className="text-center text-sm md:text-base">No conversations yet</p>
                                        <p className="text-xs md:text-sm text-center mt-1">Start chatting with sellers from product pages</p>
                                    </div>
                                ) : (
                                    filteredConversations.map((conversation) => {
                                        const otherParticipant = getOtherParticipant(conversation);
                                        const isSelected = selectedConversation?._id === conversation._id;

                                        return (
                                            <div
                                                key={conversation._id}
                                                onClick={() => setSelectedConversation(conversation)}
                                                className={`px-3 py-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${isSelected ? 'bg-[#8b5cf6]/10 border-l-4 border-l-[#8b5cf6]' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2 md:gap-3">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm md:text-base">
                                                        {otherParticipant?.firstName?.[0]}{otherParticipant?.lastName?.[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">
                                                                {otherParticipant?.firstName} {otherParticipant?.lastName}
                                                            </h3>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(conversation.lastMessageAt).toLocaleDateString([], {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        {conversation.productId && (
                                                            <p className="text-xs text-[#8b5cf6] truncate mt-0.5">
                                                                {conversation.productId.title}
                                                            </p>
                                                        )}
                                                        <p className="text-xs md:text-sm text-gray-600 truncate mt-1">
                                                            {conversation.lastMessage}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Messages Area - Edge to edge on mobile */}
                        <div className={`md:col-span-2 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                            {selectedConversation ? (
                                <>
                                    {/* Chat Header - Gradient, compact on mobile */}
                                    <div className="px-3 py-3 md:p-4 border-b border-gray-200 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <button
                                                onClick={() => setSelectedConversation(null)}
                                                className="text-white hover:bg-white/10 p-1 rounded-lg transition"
                                            >
                                                <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                                            </button>
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                                                {getOtherParticipant(selectedConversation)?.firstName?.[0]}
                                                {getOtherParticipant(selectedConversation)?.lastName?.[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="font-bold text-white text-sm md:text-base">
                                                    {getOtherParticipant(selectedConversation)?.firstName}{' '}
                                                    {getOtherParticipant(selectedConversation)?.lastName}
                                                </h2>
                                                {selectedConversation.productId && (
                                                    <p className="text-xs md:text-sm text-white/90 truncate">
                                                        {selectedConversation.productId.title}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages - Scrollable area */}
                                    <div
                                        id="messages-container"
                                        className="flex-1 overflow-y-auto px-3 py-4 md:p-4 bg-gray-50"
                                        style={{ maxHeight: 'calc(100vh - 180px)' }}
                                    >
                                        {messages.length === 0 ? (
                                            <div className="flex items-center justify-center h-full text-gray-500">
                                                <p className="text-sm md:text-base">No messages yet. Start the conversation!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 md:space-y-4">
                                                {messages.map((msg) => {
                                                    const isOwnMessage = msg.sender._id === user.id;
                                                    return (
                                                        <div
                                                            key={msg._id}
                                                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div
                                                                className={`max-w-[85%] md:max-w-[70%] rounded-lg p-2.5 md:p-3 ${isOwnMessage
                                                                    ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white'
                                                                    : 'bg-white border border-gray-200 text-gray-900'
                                                                    }`}
                                                            >
                                                                <p className="text-xs md:text-sm leading-relaxed">{msg.message}</p>
                                                                <p
                                                                    className={`text-[10px] md:text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'
                                                                        }`}
                                                                >
                                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}</div>
                                        )}
                                    </div>

                                    {/* Message Input - Sticky at bottom, compact on mobile */}
                                    <form onSubmit={handleSendMessage} className="px-3 py-2.5 md:p-4 border-t border-gray-200 bg-white sticky bottom-0">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent"
                                                disabled={!isConnected}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim() || !isConnected}
                                                className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg hover:from-[#7c3aed] hover:to-[#6d28d9] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 md:gap-2 text-sm md:text-base"
                                            >
                                                <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                                <span className="hidden sm:inline">Send</span>
                                            </button>
                                        </div>
                                        {!isConnected && (
                                            <p className="text-xs text-red-500 mt-2">Connecting to chat...</p>
                                        )}
                                    </form>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center px-4">
                                        <MessageCircle className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-base md:text-lg font-medium">Select a conversation</p>
                                        <p className="text-xs md:text-sm mt-1">Choose a conversation from the list to start messaging</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
