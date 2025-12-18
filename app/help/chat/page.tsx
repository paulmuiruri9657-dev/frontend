'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Send, Bot, User, X, Minimize2, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';
import { Product } from '@/types';

const quickReplies = [
    { text: 'Track my order', response: 'To track your order, go to My Account > Orders and click on the order you want to track. You&apos;ll see the current status and tracking information.' },
    { text: 'Return policy', response: 'You can return most items within 7 days of delivery. Items must be unused and in their original packaging. Visit Help Center > Returns for more details.' },
    { text: 'Payment methods', response: 'We accept M-Pesa, Airtel Money, Visa, Mastercard, and Cash on Delivery in select areas.' },
    { text: 'Delivery time', response: 'Delivery times vary: Nairobi (1-3 days), Major towns (3-5 days), Rural areas (5-7 days).' },
    { text: 'Cancel order', response: 'You can cancel your order before it ships. Go to My Account > Orders > Select order > Cancel Order.' },
];

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    timestamp: Date;
    products?: Product[];
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Hello! 👋 Welcome to EcoLooP Customer Support. How can I help you today?',
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    // Fetch products for context
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch a decent number of recent products for the AI to "know" about
                const res = await api.getProducts({ limit: 50, sort: '-createdAt' });
                if (res.data) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error('Failed to load products for chat context:', error);
            }
        };
        fetchProducts();
    }, []);

    const addMessage = (text: string, isBot: boolean, foundProducts?: Product[]) => {
        setMessages(prev => [
            ...prev,
            {
                id: prev.length + 1,
                text,
                isBot,
                timestamp: new Date(),
                products: foundProducts
            }
        ]);
    };

    const handleQuickReply = (reply: typeof quickReplies[0]) => {
        addMessage(reply.text, false);
        setTimeout(() => {
            addMessage(reply.response, true);
        }, 500);
    };

    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue;
        addMessage(userText, false);
        setInputValue('');
        setIsTyping(true);

        try {
            // Import dynamically to avoid SSR issues if any (though likely fine here)
            const { aiChatService } = await import('@/lib/aiChatService');
            // Pass the fetched products to the AI
            const response = await aiChatService.processUserMessage(userText, products);

            setIsTyping(false);
            addMessage(response.text, true, response.products);
        } catch (error) {
            console.error('AI Chat Error:', error);
            setIsTyping(false);
            addMessage("I'm having trouble connecting right now. Please try again or contact support.", true);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Chat Header */}
                <div className="bg-[#8b5cf6] text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <MessageCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">EcoLooP Support Chat</h1>
                            <p className="text-sm text-white/80">We typically reply within minutes</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-2 hover:bg-white/20 rounded"
                        >
                            <Minimize2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages */}
                        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-4 flex flex-col ${message.isBot ? 'items-start' : 'items-end'}`}
                                >
                                    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} w-full`}>
                                        <div className={`flex-shrink-0 ${message.isBot ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isBot ? 'bg-[#8b5cf6] text-white' : 'bg-gray-300'
                                                }`}>
                                                {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                            </div>
                                        </div>

                                        <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                                            <div
                                                className={`p-3 rounded-lg ${message.isBot
                                                    ? 'bg-white shadow-sm rounded-tl-none'
                                                    : 'bg-[#8b5cf6] text-white rounded-tr-none'
                                                    }`}
                                            >
                                                {message.text}
                                            </div>
                                            <p className={`text-xs text-gray-400 mt-1 ${message.isBot ? '' : 'text-right'}`}>
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Render Product Cards if available */}
                                    {message.products && message.products.length > 0 && (
                                        <div className={`mt-2 w-[85%] ml-10 grid grid-cols-1 sm:grid-cols-2 gap-2`}>
                                            {message.products.map(product => (
                                                <Link
                                                    href={`/product/${product._id}`}
                                                    key={product._id}
                                                    className="bg-white p-2 rounded border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex gap-2 items-center"
                                                >
                                                    <div className="w-12 h-12 bg-gray-100 rounded relative overflow-hidden flex-shrink-0">
                                                        {product.images?.[0] ? (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover"
                                                                sizes="48px"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <ShoppingBag className="w-6 h-6 text-gray-400 m-auto mt-3" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                                                        <p className="text-xs text-[#8b5cf6] font-bold">KSh {product.price.toLocaleString()}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="mb-4 flex justify-start">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Replies */}
                        <div className="p-3 border-t bg-white">
                            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickReply(reply)}
                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                                    >
                                        {reply.text}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent"
                                />
                                <button
                                    onClick={handleSend}
                                    className="px-4 py-2 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed] transition-colors"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-bold mb-2">Operating Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sunday: 9:00 AM - 5:00 PM</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-bold mb-2">Other Ways to Reach Us</h3>
                    <p className="text-gray-600">
                        📞 WhatsApp: <a href="https://wa.me/254705424364" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:underline">0705424364</a>
                    </p>
                    <p className="text-gray-600">
                        ✉️ Email: <a href="mailto:ecoloopke@gmail.com" className="text-[#8b5cf6] hover:underline">ecoloopke@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

