'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Product } from '@/types';

const POPULAR_SEARCHES = ['iPhone', 'Samsung', 'Laptop', 'Headphones', 'Smart TV'];

export default function SearchDrawer() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();

    // Debounced search
    const handleInput = useCallback((value: string) => {
        setQuery(value);
        setFocusedIndex(-1);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        if (!value.trim()) { setResults([]); return; }
        setLoading(true);
        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await api.searchProducts(value, 6);
                setResults(res.data || []);
            } catch { setResults([]); }
            finally { setLoading(false); }
        }, 300);
    }, []);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Keyboard nav
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, results.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, -1)); }
        if (e.key === 'Enter') {
            if (focusedIndex >= 0 && results[focusedIndex]) {
                router.push(`/product/${results[focusedIndex].slug}`);
                setOpen(false); setQuery('');
            } else if (query.trim()) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                setOpen(false); setQuery('');
            }
        }
    };

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Input */}
            <div className={`flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 transition-all duration-200 ${open ? 'ring-2 ring-[#8b5cf6] bg-white shadow-lg' : 'hover:bg-gray-200'}`}>
                <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    placeholder="Search products, brands, categories..."
                    onChange={e => handleInput(e.target.value)}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm font-medium"
                />
                {query && (
                    <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Dropdown Drawer */}
            {open && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
                    {/* Results */}
                    {results.length > 0 ? (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 pt-3 pb-1">Products</p>
                            {results.map((product, idx) => (
                                <Link
                                    key={product._id}
                                    href={`/product/${product.slug}`}
                                    onClick={() => { setOpen(false); setQuery(''); }}
                                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${focusedIndex === idx ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</p>
                                        <p className="text-xs text-gray-500">{product.brand}</p>
                                    </div>
                                    <p className="text-sm font-black text-[#8b5cf6] flex-shrink-0">{product.currency} {product.price.toLocaleString()}</p>
                                </Link>
                            ))}
                            <Link
                                href={`/search?q=${encodeURIComponent(query)}`}
                                onClick={() => { setOpen(false); setQuery(''); }}
                                className="flex items-center justify-center gap-2 py-3 border-t border-gray-100 text-sm font-bold text-[#8b5cf6] hover:bg-purple-50 transition-colors"
                            >
                                See all results for "{query}" <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center justify-center py-8 gap-3 text-gray-400">
                            <div className="animate-spin h-5 w-5 border-2 border-[#8b5cf6] border-t-transparent rounded-full" />
                            <span className="text-sm font-medium">Searching...</span>
                        </div>
                    ) : query.trim() ? (
                        <div className="py-8 text-center text-gray-400 text-sm font-medium">No results found for "{query}"</div>
                    ) : (
                        // Empty state — show popular searches
                        <div className="p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> Popular Searches
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_SEARCHES.map(term => (
                                    <button
                                        key={term}
                                        onClick={() => { handleInput(term); setQuery(term); }}
                                        className="bg-purple-50 text-[#8b5cf6] text-sm font-bold px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
