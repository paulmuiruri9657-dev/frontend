'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
    _id: string;
    title: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    images: string[];
    slug: string;
    currency: string;
}

interface LiveSearchProps {
    placeholder?: string;
    className?: string;
}

export default function LiveSearch({ placeholder = "Search products, brands and categories", className = "" }: LiveSearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Debounced search
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (query.trim().length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setLoading(true);
        debounceTimer.current = setTimeout(async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}&limit=6`);

                if (!response.ok) {
                    throw new Error('Search failed');
                }

                const data = await response.json();
                if (data.success) {
                    setResults(data.data || []);
                    setShowResults(true);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
                setShowResults(false);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [query]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setShowResults(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="flex w-full">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => results.length > 0 && setShowResults(true)}
                        className="block w-full pl-10 pr-10 p-2.5 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] text-sm"
                        placeholder={placeholder}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-[#8b5cf6] text-white px-6 py-2 rounded-r-md font-bold uppercase shadow-md hover:bg-[#7c3aed] transition duration-200"
                >
                    Search
                </button>
            </form>

            {/* Live Results Dropdown */}
            {showResults && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg border border-gray-200 z-50 max-h-96 overflow-y-auto mt-1">
                    {loading ? (
                        <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8b5cf6] mx-auto"></div>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            {results.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/product/${product.slug}`}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    onClick={() => setShowResults(false)}
                                >
                                    <img
                                        src={product.images?.[0] || '/placeholder.png'}
                                        alt={product.title}
                                        className="w-12 h-12 object-contain"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 truncate">{product.title}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-[#8b5cf6]">
                                                {product.currency} {product.price.toLocaleString()}
                                            </p>
                                            {product.oldPrice && (
                                                <p className="text-xs text-gray-400 line-through">
                                                    {product.currency} {product.oldPrice.toLocaleString()}
                                                </p>
                                            )}
                                            {product.discount && product.discount > 0 && (
                                                <span className="text-xs bg-purple-100 text-[#8b5cf6] px-1.5 py-0.5 rounded">
                                                    -{product.discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            <Link
                                href={`/search?q=${encodeURIComponent(query)}`}
                                className="block p-3 text-center text-[#8b5cf6] font-semibold hover:bg-gray-50 border-t border-gray-200"
                                onClick={() => setShowResults(false)}
                            >
                                See all results for "{query}"
                            </Link>
                        </>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No products found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

