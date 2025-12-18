'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/store/cartStore';

import { CardVariant } from '@/lib/card-styles';

interface ProductCardProps {
    product: Product;
    showAddToCart?: boolean;
    onAddToCart?: (product: Product) => void;
    variant?: CardVariant;
}

export default function ProductCard({
    product,
    showAddToCart = true,
    onAddToCart,
    variant = 'standard'
}: ProductCardProps) {
    const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';
    const { user } = useAuth();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        const checkWishlist = async () => {
            if (!user) return;
            try {
                const response = await api.checkWishlist(product._id);
                setIsInWishlist(response.data.isInWishlist);
            } catch (error) {
                console.error('Error checking wishlist:', error);
            }
        };

        checkWishlist();
    }, [product._id, user]);

    const { addToCart } = useCartStore();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error('Please sign in to add items to your cart', {
                icon: '🔒',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }

        if (onAddToCart) {
            onAddToCart(product);
        } else {
            await addToCart(product._id);
        }
    };

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Please login to add items to wishlist');
            return;
        }

        setWishlistLoading(true);
        try {
            if (isInWishlist) {
                await api.removeFromWishlist(product._id);
                setIsInWishlist(false);
            } else {
                await api.addToWishlist(product._id);
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleClick = () => {
        // Track click activity for logged-in users (fire and forget)
        if (user) {
            const categoryId = typeof product.category === 'object' && product.category?._id
                ? product.category._id
                : product.category;

            api.trackActivity({
                activityType: 'click',
                productId: product._id,
                categoryId: categoryId as string,
                metadata: {
                    price: product.price,
                    brand: product.brand,
                    source: 'product_card'
                }
            }).catch(() => { }); // Silent fail - don't block navigation
        }
    };

    return (
        <Link href={`/product/${product.slug}`} onClick={handleClick}>
            <div className="group bg-white rounded-md md:rounded-xl shadow-sm md:shadow-md hover:shadow-xl transition-all duration-150 overflow-hidden relative h-full flex flex-col border border-gray-100/50 hover:border-gray-200/80 hover:-translate-y-0.5 md:hover:-translate-y-1">
                {/* Badges - Compact on Mobile */}
                <div className="absolute top-1 md:top-3 left-1 md:left-3 flex flex-col gap-0.5 md:gap-1 z-10">
                    {product.discount && product.discount > 0 && (
                        <div className="bg-gradient-to-r from-[#8b5cf6] to-[#f7941d] text-white text-[9px] md:text-xs font-bold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded md:rounded-lg shadow-md">
                            -{product.discount}%
                        </div>
                    )}
                    {product.isOfficialStore && (
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded md:rounded-lg shadow-md">
                            Official
                        </div>
                    )}
                    {product.isFlashSale && (
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded md:rounded-lg shadow-md">
                            ⚡ Flash
                        </div>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    className="absolute top-1 md:top-3 right-1 md:right-3 p-1 md:p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-150 z-10 hover:bg-white hover:scale-110 active:scale-95 shadow-lg disabled:opacity-50"
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                >
                    {wishlistLoading ? (
                        <div className="animate-spin h-3 w-3 md:h-4 md:w-4 border-2 border-gray-300 border-t-red-500 rounded-full" />
                    ) : (
                        <Heart
                            className={`h-3 w-3 md:h-4 md:w-4 transition-colors ${isInWishlist
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600 hover:text-red-500'
                                }`}
                        />
                    )}
                </button>

                {/* Image */}
                <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden relative">
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {product.isFlashSale && (
                            <span className="bg-[#f68b1e] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                FLASH SALE
                            </span>
                        )}
                        {product.isOfficialStore && (
                            <span className="bg-[#264996] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                OFFICIAL STORE
                            </span>
                        )}
                        {typeof product.sellerId === 'object' && product.sellerId?.isVerified && (
                            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                                <Shield className="w-3 h-3 fill-current" /> VERIFIED
                            </span>
                        )}
                    </div>
                    <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300"
                        unoptimized={imageUrl.includes('placehold') || imageUrl.includes('placeholder') || imageUrl.includes('amazonaws.com')}
                    />
                </div>

                {/* Content - Ultra Compact on Mobile */}
                <div className="p-1.5 md:p-3 flex flex-col flex-grow space-y-0.5 md:space-y-2">
                    {/* Title - Compact */}
                    <h3 className="text-[11px] md:text-sm text-gray-800 line-clamp-2 leading-tight min-h-[2em] md:min-h-[2.5em]">
                        {product.title}
                    </h3>

                    {/* Price - Compact */}
                    <div className="space-y-0">
                        <div className="font-bold text-sm md:text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {product.currency} {product.price.toLocaleString()}
                        </div>
                        {product.oldPrice && (
                            <div className="text-[9px] md:text-xs text-gray-400 line-through">
                                {product.currency} {product.oldPrice.toLocaleString()}
                            </div>
                        )}
                    </div>

                    {/* Rating - Compact */}
                    {product.rating > 0 && (
                        <div className="flex items-center gap-0.5 md:gap-1">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-2 w-2 md:h-3 md:w-3 ${i < Math.floor(product.rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-[8px] md:text-xs text-gray-500">({product.numReviews})</span>
                        </div>
                    )}

                    {/* Stock Info for Flash Sales - Compact */}
                    {product.isFlashSale && product.stock > 0 && product.stock <= 30 && (
                        <div className="mt-auto">
                            <div className="bg-gray-200 rounded-full h-1 md:h-1.5 mb-0.5 md:mb-1">
                                <div
                                    className="bg-[#8b5cf6] h-1 md:h-1.5 rounded-full"
                                    style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                                />
                            </div>
                            <span className="text-[8px] md:text-xs text-gray-500">{product.stock} left</span>
                        </div>
                    )}

                    {/* Add to Cart Button - Compact on Mobile */}
                    {showAddToCart && (
                        <button
                            onClick={handleAddToCart}
                            className="mt-auto pt-1 md:pt-2 w-full flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#f7941d] text-white py-1.5 md:py-2.5 rounded md:rounded-lg font-semibold text-[10px] md:text-sm hover:from-[#7c3aed] hover:to-[#e8851c] transition-all duration-150 opacity-0 group-hover:opacity-100 shadow-md hover:shadow-lg active:scale-95"
                        >
                            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="hidden md:inline">Add to Cart</span>
                            <span className="md:hidden">Add</span>
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
