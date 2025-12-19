'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    unreadCount: number;
    sendMessage: (data: { conversationId: string; receiverId: string; message: string }) => void;
    markAsRead: (conversationId: string) => void;
    joinConversation: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { user, refreshUser } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!user) {
            // Disconnect if user logs out
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Get token
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Connect to Socket.io server
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000', {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('✅ Socket connected');
            setIsConnected(true);

            // Fetch initial unread count
            // Fetch initial unread count
            api.getUnreadCount()
                .then(data => {
                    if (data.success) {
                        setUnreadCount(data.data || 0);
                    }
                })
                .catch(err => console.error('Error fetching unread count:', err));
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setIsConnected(false);
        });

        // Unread count updates
        newSocket.on('unread_count_update', (count: number) => {
            setUnreadCount(count);
        });

        // Global message listener - FIXED TO ONLY NOTIFY RECEIVER
        newSocket.on('new_message', (message: any) => {
            console.log('📨 New message received:', message);
            console.log('Current user ID:', user?.id);
            console.log('Message sender ID:', message.sender._id);

            // Check if message is FROM someone else (not from me)
            const isFromOtherPerson = message.sender._id !== user?.id;
            console.log('Is from other person (should show notification)?', isFromOtherPerson);

            // Only show notification and update unread if message is FROM someone else
            if (isFromOtherPerson) {
                // Update unread count
                setUnreadCount(prev => prev + 1);

                // Show browser notification
                if ('Notification' in window) {
                    if (Notification.permission === 'granted') {
                        new Notification('New message from ' + message.sender.firstName, {
                            body: message.message,
                            icon: '/logo.png',
                            badge: '/logo.png',
                            tag: message.conversationId
                        });
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                new Notification('New message from ' + message.sender.firstName, {
                                    body: message.message,
                                    icon: '/logo.png'
                                });
                            }
                        });
                    }
                }
            }
        });

        // Error notification listener (e.g. for failed avatar verification)
        newSocket.on('notification:error', (data: { type: string, message: string }) => {
            console.log('🚨 Error notification received:', data);
            toast.error(data.message, {
                duration: 5000,
                position: 'top-center',
                style: {
                    border: '1px solid #FF5630',
                    padding: '16px',
                    color: '#FF5630',
                },
            });

            if (data.type === 'avatar_rejected') {
                // Refresh user data to remove the invalid avatar from UI
                refreshUser();
            }
        });

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const sendMessage = (data: { conversationId: string; receiverId: string; message: string }) => {
        if (socket && isConnected) {
            socket.emit('send_message', data);
        }
    };

    const markAsRead = (conversationId: string) => {
        if (socket && isConnected) {
            socket.emit('mark_as_read', { conversationId });
        }
    };

    const joinConversation = (conversationId: string) => {
        if (socket && isConnected) {
            console.log('🔗 Joining conversation:', conversationId);
            socket.emit('join_conversation', conversationId);
        }
    };

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                unreadCount,
                sendMessage,
                markAsRead,
                joinConversation,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
