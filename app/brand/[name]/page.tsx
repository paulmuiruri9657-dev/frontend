'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BrandPage() {
    const params = useParams();
    const router = useRouter();
    const brandName = decodeURIComponent(params.name as string);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchBrandProducts = async () => {
            setLoading(true);
            try {
                const response = await api.getBrandProducts(brandName, { page, limit: 24 });
                setProducts(response.data || []);
                setTotalPages(response.pagination?.pages || 1);
            } catch (error) {
                console.error('Error fetching brand products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBrandProducts();
    }, [brandName, page]);

    const handleAddToCart = async (product: Product) => {
        try {
            await api.addToCart(product._id, 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm">
                <ol className="flex items-center space-x-2">
                    <li>
                        <button onClick={() => router.push('/')} className="text-gray-600 hover:text-[#8b5cf6]">
                            Home
                        </button>
                    </li>
                    <li className="text-gray-400">/</li>
                    <li className="text-gray-600">Brands</li>
                    <li className="text-gray-400">/</li>
                    <li className="text-[#8b5cf6] font-semibold">{brandName}</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {brandName} Products
                </h1>
                <p className="text-gray-600">
                    {products.length} {products.length === 1 ? 'product' : 'products'} found
                </p>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={() => handleAddToCart(product)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <span className="px-4 py-2 text-sm">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-600 mb-4">No products found for {brandName}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-[#8b5cf6] text-white px-6 py-2 rounded-lg hover:bg-[#7c3aed] transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
}
