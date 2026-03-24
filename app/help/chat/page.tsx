'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Send, Bot, User, Sparkles, ShoppingBag, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';
import { Product } from '@/types';

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    products?: Product[];
    streaming?: boolean;
}

const SUGGESTED_PROMPTS = [
    '🔍 Find me a good smartphone under KSh 30,000',
    '📦 How do I track my order?',
    '↩️ What is the return policy?',
    '⚡ Show me current flash sales',
    '💳 What payment methods do you accept?',
    '🛒 How do I sell on EcoLooP?',
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'assistant',
            content: "Hey there! 👋 I'm your EcoLooP AI shopping assistant, powered by advanced AI.\n\nI have live access to our full product catalog and can help you:\n- 🔍 **Find the perfect product** at the best price\n- 📦 **Track orders** & understand policies\n- 💬 **Compare products** and give honest recommendations\n- 🛒 **Guide you through buying or selling**\n\nWhat can I help you with today?",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load product catalog for AI context
    useEffect(() => {
        api.getProducts({ limit: 100, sort: '-createdAt' })
            .then(res => { if (res.data) setProducts(res.data); })
            .catch(() => {});
    }, []);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isStreaming) return;

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };

        const assistantPlaceholder: Message = {
            id: Date.now() + 1,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            streaming: true,
        };

        setMessages(prev => [...prev, userMessage, assistantPlaceholder]);
        setInput('');
        setIsStreaming(true);

        try {
            // Build message history for Groq (last 12 messages to stay within context)
            const history = [...messages.slice(-12), userMessage].map(m => ({
                role: m.role,
                content: m.content,
            }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history, products }),
            });

            if (!res.ok || !res.body) throw new Error('Failed to connect to AI');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fullContent += decoder.decode(value);

                // Update the streaming message in place
                setMessages(prev => prev.map(m =>
                    m.id === assistantPlaceholder.id
                        ? { ...m, content: fullContent, streaming: true }
                        : m
                ));
            }

            // Mark streaming done
            setMessages(prev => prev.map(m =>
                m.id === assistantPlaceholder.id
                    ? { ...m, content: fullContent, streaming: false }
                    : m
            ));
        } catch (err) {
            setMessages(prev => prev.map(m =>
                m.id === assistantPlaceholder.id
                    ? { ...m, content: "Sorry, I couldn't connect right now. Please try again in a moment!", streaming: false }
                    : m
            ));
        } finally {
            setIsStreaming(false);
            inputRef.current?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    // Simple markdown-to-JSX renderer for bold and bullets
    const renderMarkdown = (text: string) => {
        const lines = text.split('\n');
        return lines.map((line, i) => {
            const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                    ? <strong key={j}>{part.slice(2, -2)}</strong>
                    : part
            );
            if (line.startsWith('- ')) {
                return <div key={i} className="flex gap-2 my-0.5"><span className="text-[#8b5cf6] flex-shrink-0">•</span><span>{parts.slice(1)}</span></div>;
            }
            return <span key={i}>{parts}{i < lines.length - 1 && '\n'}</span>;
        });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-2xl px-6 py-4 mb-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-lg">EcoLooP AI Assistant</h1>
                        <p className="text-white/70 text-xs flex items-center gap-1">
                            <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
                            Powered by Groq · Live product access
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setMessages([{
                        id: 1, role: 'assistant',
                        content: "Fresh start! 👋 What can I help you find today?",
                        timestamp: new Date()
                    }])}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                    title="New conversation"
                >
                    <RotateCcw className="h-4 w-4" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                {messages.map(message => (
                    <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'assistant' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                        )}

                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                            <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                                message.role === 'user'
                                    ? 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white rounded-tr-sm'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                            }`}>
                                {message.role === 'assistant' ? renderMarkdown(message.content) : message.content}
                                {message.streaming && (
                                    <span className="inline-block w-1.5 h-4 bg-[#8b5cf6] rounded-sm ml-1 animate-pulse align-middle" />
                                )}
                            </div>
                            <p className={`text-[10px] text-gray-400 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                                {message.timestamp.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>

                        {message.role === 'user' && (
                            <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-gray-600" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Suggested prompts — show only at the start */}
                {messages.length === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                        {SUGGESTED_PROMPTS.map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(prompt.replace(/^[^ ]+ /, ''))}
                                className="text-left text-sm px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-[#8b5cf6] hover:text-[#8b5cf6] hover:bg-purple-50 transition-all shadow-sm font-medium"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-3 bg-white border border-gray-200 rounded-2xl p-2 shadow-lg focus-within:border-[#8b5cf6] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={isStreaming ? 'AI is responding...' : 'Ask me anything — products, orders, policies...'}
                    disabled={isStreaming}
                    className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-900 text-sm placeholder-gray-400 disabled:opacity-60"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                    className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isStreaming
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <Send className="h-4 w-4" />
                    }
                </button>
            </form>

            {/* Footer Links */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                <a href="https://wa.me/254705424364" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b5cf6] transition-colors">📞 WhatsApp</a>
                <span>·</span>
                <a href="mailto:ecoloopke@gmail.com" className="hover:text-[#8b5cf6] transition-colors">✉️ Email</a>
                <span>·</span>
                <Link href="/help" className="hover:text-[#8b5cf6] transition-colors">Help Center</Link>
            </div>
        </div>
    );
}
