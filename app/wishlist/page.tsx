'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function WishlistPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [loadingWishlist, setLoadingWishlist] = useState(true);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/');
        return null;
    }

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await api.getWishlist();
                setWishlistItems(response.data.products || []);
            } catch (error) {
                console.error('Error loading wishlist:', error);
            }
            setLoadingWishlist(false);
        };

        if (user) {
            fetchWishlist();
        }
    }, [user]);

    if (loading || loadingWishlist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    const handleRemoveFromWishlist = async (productId: string) => {
        try {
            await api.removeFromWishlist(productId);
            setWishlistItems(wishlistItems.filter(item => item._id !== productId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const handleAddToCart = async (product: Product) => {
        try {
            await api.addToCart(product._id, 1);
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">My Wishlist</h1>

            {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 p-12 text-center">
                    <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Your Wishlist is Empty</h2>
                    <p className="text-gray-600 mb-6">
                        Save your favorite items here for later. Start browsing to add items to your wishlist!
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-gradient-to-r from-[#8b5cf6] to-[#f7941d] text-white px-6 py-3 rounded-lg hover:from-[#7c3aed] hover:to-[#e8851c] transition-all duration-150 font-semibold shadow-md hover:shadow-lg active:scale-95"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div>
                    <p className="text-gray-600 mb-4">{wishlistItems.length} item(s) in your wishlist</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {wishlistItems.map((item) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-150 overflow-hidden group border border-gray-100/50 hover:border-gray-200/80 hover:-translate-y-1">
                                <Link href={`/product/${item.slug}`} className="block">
                                    <div className="aspect-square relative bg-gray-100">
                                        <img
                                            src={item.images?.[0] || '/placeholder.png'}
                                            alt={item.title}
                                            className="w-full h-full object-contain p-4"
                                        />
                                        {(item.discount ?? 0) > 0 && (
                                            <div className="absolute top-2 left-2 bg-[#8b5cf6] text-white px-2 py-1 rounded text-xs font-bold">
                                                -{item.discount}%
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <Link href={`/product/${item.slug}`}>
                                        <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-[#8b5cf6]">
                                            {item.title}
                                        </h3>
                                    </Link>
                                    <div className="mb-3">
                                        <span className="text-lg font-bold text-[#8b5cf6]">
                                            {item.currency} {item.price.toLocaleString()}
                                        </span>
                                        {item.oldPrice && (
                                            <span className="text-sm text-gray-500 line-through ml-2">
                                                {item.currency} {item.oldPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#f7941d] text-white px-3 py-2.5 rounded-lg hover:from-[#7c3aed] hover:to-[#e8851c] transition-all duration-150 text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromWishlist(item._id)}
                                            className="bg-gray-100 text-gray-700 px-3 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-150 active:scale-95"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

