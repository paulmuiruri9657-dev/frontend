'use client';

import React, { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Star, Heart, ShoppingCart, Truck, RotateCcw, Shield,
    ChevronRight, Share2, Minus, Plus, Check, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Product, Review, RatingBreakdown } from '@/types';
import ProductCard from '@/components/ProductCard';
import ChatButton from '@/components/ChatButton';
import ProductRecommendations from '@/components/ProductRecommendations';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { ProductDetailSkeleton } from '@/components/skeletons/ProductDetailSkeleton';

type TabType = 'details' | 'specs' | 'reviews';

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params?.id as string;
    const { addToCart } = useCartStore();
    const { user } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdown>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('details');
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;

            try {
                const response = await api.getProductBySlug(slug);
                setProduct(response.data);
                setRelatedProducts(response.data.relatedProducts || []);

                // Fetch reviews
                const reviewsResponse = await api.getProductReviews(response.data._id);
                setReviews(reviewsResponse.data.reviews || []);
                setRatingBreakdown(reviewsResponse.data.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    // Auto-swipe images every 3 seconds when there are multiple images
    useEffect(() => {
        if (!product || !product.images || product.images.length <= 1) return;

        const interval = setInterval(() => {
            setSelectedImage((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [product]);

    const handleAddToCart = async () => {
        if (!product) return;

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

        setAddingToCart(true);
        try {
            await addToCart(product._id, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAddingToCart(false);
        };
    };

    const handleWishlistToggle = async () => {
        if (!product) return;

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

    // Check if product is in wishlist
    useEffect(() => {
        const checkWishlist = async () => {
            if (!product) return;
            try {
                const response = await api.checkWishlist(product._id);
                setIsInWishlist(response.data.isInWishlist);
            } catch (error) {
                console.error('Error checking wishlist:', error);
            }
        };

        checkWishlist();
    }, [product]);

    if (loading) {
        return <ProductDetailSkeleton />;
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/" className="text-[#8b5cf6] hover:underline">Go back to Home</Link>
                </div>
            </div>
        );
    }

    const totalRatings = Object.values(ratingBreakdown).reduce((a, b) => a + b, 0);

    return (
        <div className="pb-20 md:pb-0">
            {/* Mobile: Image Gallery - Full Width */}
            <div className="md:hidden bg-white">
                <div className="aspect-square bg-gray-50">
                    <Zoom>
                        <img
                            src={product.images?.[selectedImage] || 'https://via.placeholder.com/500'}
                            alt={product.title}
                            className="w-full h-full object-contain"
                            style={{ width: '100%' }}
                        />
                    </Zoom>
                </div>
                {product.images && product.images.length > 1 && (
                    <div className="flex gap-2 p-2 overflow-x-auto">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`flex-shrink-0 w-14 h-14 rounded border-2 overflow-hidden ${idx === selectedImage ? 'border-[#8b5cf6]' : 'border-gray-200'
                                    }`}
                            >
                                <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-contain" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 py-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Link href="/" className="hover:text-[#8b5cf6]">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    {typeof product.category === 'object' && (
                        <>
                            <Link href={`/category/${product.category.slug}`} className="hover:text-[#8b5cf6]">
                                {product.category.name}
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                        </>
                    )}
                    <span className="text-gray-800 truncate max-w-xs">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
                            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                                <Zoom>
                                    <img
                                        src={product.images?.[selectedImage] || 'https://via.placeholder.com/500'}
                                        alt={product.title}
                                        className="w-full h-full object-contain cursor-zoom-in"
                                        style={{ width: '100%' }}
                                    />
                                </Zoom>
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${idx === selectedImage ? 'border-[#8b5cf6]' : 'border-gray-200'
                                                }`}
                                        >
                                            <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-contain" />
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-4 mt-4 pt-4 border-t">
                                <button className="flex items-center gap-2 text-gray-600 hover:text-[#8b5cf6]">
                                    <Share2 className="h-5 w-5" /> Share
                                </button>
                                <button
                                    onClick={handleWishlistToggle}
                                    disabled={wishlistLoading}
                                    className="flex items-center gap-2 hover:text-red-500 disabled:opacity-50 transition-colors"
                                >
                                    {wishlistLoading ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-red-500 rounded-full" />
                                    ) : (
                                        <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                    )}
                                    <span className={isInWishlist ? 'text-red-500' : 'text-gray-600'}>
                                        {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Middle + Right Columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Info Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Left Side - Info */}
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        {product.isOfficialStore && (
                                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Official Store</span>
                                        )}
                                        {product.isFlashSale && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded animate-pulse">⚡ Flash Sale</span>
                                        )}
                                        {/* Condition Badge */}
                                        <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${product.condition === 'new' ? 'bg-green-100 text-green-700' :
                                            product.condition === 'refurbished' ? 'bg-blue-100 text-blue-700' :
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                            {product.condition}
                                        </span>
                                    </div>

                                    {/* Location & Delivery Info */}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        {product.location && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-red-500">📍</span>
                                                <span className="font-semibold">{product.location}</span>
                                            </div>
                                        )}
                                        {product.deliveryInfo && (
                                            <div className="flex items-center gap-1">
                                                <Truck className="h-4 w-4 text-[#8b5cf6]" />
                                                <span>
                                                    {product.deliveryInfo.deliveryType === 'platform'
                                                        ? 'EcoLooP Delivery'
                                                        : `Seller Delivery (Meetup: ${product.deliveryInfo.meetupPoint || 'Contact Seller'})`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Link href={`/search?brand=${product.brand}`} className="text-[#8b5cf6] text-sm hover:underline">
                                        {product.brand}
                                    </Link>
                                    <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-3">{product.title}</h1>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">({product.numReviews} verified ratings)</span>
                                    </div>
                                </div>

                                {/* Right Side - Price & Actions */}
                                <div>
                                    <div className="border-b pb-4 mb-4">
                                        <div className="text-3xl font-bold text-gray-900">
                                            {product.currency} {product.price.toLocaleString()}
                                        </div>
                                        {product.oldPrice && (
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-gray-400 line-through">
                                                    {product.currency} {product.oldPrice.toLocaleString()}
                                                </span>
                                                <span className="bg-orange-100 text-[#8b5cf6] px-2 py-0.5 rounded text-sm font-bold">
                                                    -{product.discount}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        {product.stock > 0 ? (
                                            <>
                                                <Check className="h-5 w-5 text-green-500" />
                                                <span className="text-green-600 font-medium">In Stock</span>
                                                {product.stock <= 10 && (
                                                    <span className="text-orange-500 text-sm">({product.stock} left)</span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-red-500 font-medium">Out of Stock</span>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-600 text-sm">Quantity:</span>
                                            <div className="flex items-center border border-gray-300 rounded">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="px-3 py-1.5 hover:bg-gray-100"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="px-4 py-1.5 font-bold">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                    className="px-3 py-1.5 hover:bg-gray-100"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={addingToCart || product.stock === 0}
                                            className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-3 rounded-lg font-bold hover:from-[#7c3aed] hover:to-[#6d28d9] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {addingToCart ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            ) : addedToCart ? (
                                                <>
                                                    <Check className="h-5 w-5" /> Added to Cart!
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="h-5 w-5" /> Add to Cart
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges - Desktop */}
                            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                                <div className="flex flex-col items-center text-center">
                                    <Truck className="h-8 w-8 text-[#8b5cf6] mb-2" />
                                    <span className="text-xs font-medium">Free Delivery</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <RotateCcw className="h-8 w-8 text-[#8b5cf6] mb-2" />
                                    <span className="text-xs font-medium">Easy Returns</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <Shield className="h-8 w-8 text-[#8b5cf6] mb-2" />
                                    <span className="text-xs font-medium">Buyer Protection</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Content - Desktop */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="border-b">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`flex-1 px-6 py-3 font-medium transition ${activeTab === 'details'
                                            ? 'border-b-2 border-[#8b5cf6] text-[#8b5cf6]'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('specs')}
                                        className={`flex-1 px-6 py-3 font-medium transition ${activeTab === 'specs'
                                            ? 'border-b-2 border-[#8b5cf6] text-[#8b5cf6]'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Specifications
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className={`flex-1 px-6 py-3 font-medium transition ${activeTab === 'reviews'
                                            ? 'border-b-2 border-[#8b5cf6] text-[#8b5cf6]'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Reviews ({reviews.length})
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {activeTab === 'details' && (
                                    <div className="prose max-w-none">
                                        <h3 className="font-bold text-lg mb-3">Product Description</h3>
                                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                    </div>
                                )}
                                {activeTab === 'specs' && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Specifications</h3>
                                        {product.specifications && Object.keys(product.specifications).length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(product.specifications).map(([key, value]) => (
                                                    <div key={key} className="flex items-start gap-3 pb-3 border-b">
                                                        <span className="font-medium text-gray-600 min-w-[120px]">{key}:</span>
                                                        <span className="text-gray-900">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No specifications available</p>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Customer Reviews</h3>
                                        {reviews.length > 0 ? (
                                            <div className="space-y-4">
                                                {reviews.map((review) => (
                                                    <div key={review._id} className="border-b pb-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="font-medium">{review.user.firstName} {review.user.lastName}</span>
                                                            </div>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700">{review.comment}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No reviews yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Related Products - Desktop */}
                        {relatedProducts.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {relatedProducts.slice(0, 4).map((prod) => (
                                        <ProductCard key={prod._id} product={prod} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile: Compact Info Section */}
            <div className="md:hidden bg-white px-3 py-3 space-y-3">
                {/* Badges */}
                <div className="flex gap-2 mb-2">
                    {product.isOfficialStore && (
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">Official</span>
                    )}
                    {product.isFlashSale && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">⚡ Flash</span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${product.condition === 'new' ? 'bg-green-100 text-green-700' :
                        product.condition === 'refurbished' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                        }`}>
                        {product.condition}
                    </span>
                </div>

                {/* Mobile Location & Delivery */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 mb-2">
                    {product.location && (
                        <div className="flex items-center gap-1">
                            <span className="text-red-500">📍</span>
                            <span className="font-semibold">{product.location}</span>
                        </div>
                    )}
                    {product.deliveryInfo && (
                        <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3 text-[#8b5cf6]" />
                            <span>
                                {product.deliveryInfo.deliveryType === 'platform'
                                    ? 'EcoLooP Delivery'
                                    : `Seller Delivery (Meetup: ${product.deliveryInfo.meetupPoint || 'Contact Seller'})`
                                }
                            </span>
                        </div>
                    )}
                </div>

                {/* Brand & Title - Compact */}
                <div>
                    <Link href={`/search?brand=${product.brand}`} className="text-[#8b5cf6] text-xs">
                        {product.brand}
                    </Link>
                    <h1 className="text-base font-bold text-gray-900 mt-1 leading-tight">{product.title}</h1>
                </div>

                {/* Rating - Compact */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.numReviews})</span>
                </div>

                {/* Price - Prominent */}
                <div className="border-y py-2">
                    <div className="text-2xl font-bold text-gray-900">
                        {product.currency} {product.price.toLocaleString()}
                    </div>
                    {product.oldPrice && (
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm text-gray-400 line-through">
                                {product.currency} {product.oldPrice.toLocaleString()}
                            </span>
                            <span className="bg-orange-100 text-[#8b5cf6] px-1.5 py-0.5 rounded text-xs font-bold">
                                -{product.discount}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Stock - Compact */}
                <div className="flex items-center gap-2">
                    {product.stock > 0 ? (
                        <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">In Stock</span>
                            {product.stock <= 10 && <span className="text-xs text-orange-500">({product.stock} left)</span>}
                        </>
                    ) : (
                        <span className="text-sm text-red-500 font-medium">Out of Stock</span>
                    )}
                </div>

                {/* Trust Badges - Mobile Horizontal */}
                <div className="flex justify-between py-2 border-y">
                    <div className="flex flex-col items-center">
                        <Truck className="h-5 w-5 text-[#8b5cf6] mb-1" />
                        <span className="text-[9px] font-medium text-center">Free Delivery</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <RotateCcw className="h-5 w-5 text-[#8b5cf6] mb-1" />
                        <span className="text-[9px] font-medium text-center">Easy Returns</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Shield className="h-5 w-5 text-[#8b5cf6] mb-1" />
                        <span className="text-[9px] font-medium text-center">Protection</span>
                    </div>
                    {product.sellerId && (
                        <div className="flex items-center gap-2">
                            {typeof product.sellerId === 'object' && product.sellerId.avatar && (
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                    <img src={product.sellerId.avatar} alt="Seller" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <ChatButton
                                sellerId={typeof product.sellerId === 'object' ? product.sellerId._id : product.sellerId}
                                sellerName={product.seller?.name || 'Seller'}
                            />
                        </div>
                    )}
                </div>

                {/* Collapsible Description */}
                <div className="border-b pb-3">
                    <button
                        onClick={() => setShowFullDesc(!showFullDesc)}
                        className="w-full flex items-center justify-between text-sm font-bold text-gray-900"
                    >
                        Description
                        {showFullDesc ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {showFullDesc && (
                        <div className="mt-2 text-sm text-gray-700 prose-sm" dangerouslySetInnerHTML={{ __html: product.description }} />
                    )}
                </div>

                {/* Specifications - Compact List */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="border-b pb-3">
                        <h3 className="text-sm font-bold mb-2">Key Specs</h3>
                        <div className="space-y-1">
                            {Object.entries(product.specifications).slice(0, 5).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                    <span className="text-gray-600">{key}</span>
                                    <span className="font-medium text-gray-900">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Summary */}
                {reviews.length > 0 && (
                    <div className="border-b pb-3">
                        <h3 className="text-sm font-bold mb-2">Reviews ({reviews.length})</h3>
                        <div className="space-y-2">
                            {reviews.slice(0, 2).map((review) => (
                                <div key={review._id} className="text-xs">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-medium">{review.user.firstName} {review.user.lastName}</span>
                                    </div>
                                    <p className="text-gray-700 line-clamp-2">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Products - Mobile */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold mb-2">You May Also Like</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {relatedProducts.slice(0, 4).map((prod) => (
                                <ProductCard key={prod._id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Recommendations Sections */}
            <div className="max-w-7xl mx-auto px-4 mb-20 md:mb-8 space-y-4">
                {/* Frequently Bought Together */}
                {product && (
                    <ProductRecommendations
                        type="frequently-bought"
                        productId={product._id}
                        limit={4}
                    />
                )}

                {/* Similar Products */}
                {product && (
                    <ProductRecommendations
                        type="similar"
                        productId={product._id}
                        limit={12}
                    />
                )}
            </div>

            {/* Mobile: Fixed Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
                <div className="flex items-center gap-2 p-3">
                    {/* Quantity Selector - Compact */}
                    <div className="flex items-center border border-gray-300 rounded">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-2 py-1.5 hover:bg-gray-100"
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-bold">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="px-2 py-1.5 hover:bg-gray-100"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>

                    {/* Add to Cart - Takes remaining space */}
                    <button
                        onClick={handleAddToCart}
                        disabled={addingToCart || product.stock === 0}
                        className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-2.5 rounded-lg font-bold text-sm hover:from-[#7c3aed] hover:to-[#6d28d9] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {addingToCart ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        ) : addedToCart ? (
                            <>
                                <Check className="h-4 w-4" /> Added!
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="h-4 w-4" /> Add to Cart
                            </>
                        )}
                    </button>

                    {/* Wishlist - Icon Only */}
                    <button
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        {wishlistLoading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-red-500 rounded-full" />
                        ) : (
                            <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
