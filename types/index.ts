// Product Types
export interface Product {
    _id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    currency: string;
    images: string[];
    category: Category | string;
    brand: string;
    sku: string;
    stock: number;
    sold: number;
    rating: number;
    numReviews: number;
    specifications?: Record<string, string>;
    keyFeatures?: string[];
    warranty?: string;
    isFlashSale: boolean;
    flashSaleEndsAt?: string;
    location?: string;
    deliveryInfo?: {
        deliveryType: 'seller' | 'platform';
        meetupPoint?: string;
        isPaidDelivery?: boolean;
        deliveryFee?: number;
    };
    condition: 'new' | 'used' | 'refurbished';
    isOfficialStore: boolean;
    sellerId?: string | { _id: string; firstName: string; lastName: string; avatar?: string; isVerified?: boolean }; // ID or populated User object
    seller: {
        name: string;
        score: number;
        shipOnTime: number;
        orderFulfillment: number;
        qualityScore: number;
    };
    status: 'active' | 'inactive' | 'out_of_stock';
    createdAt: string;
    updatedAt: string;
    formattedPrice?: string;
    relatedProducts?: Product[];
}

// Category Types
export interface Category {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    image?: string;
    description?: string;
    parent?: string;
    ancestors?: string[];
    level: number;
    order: number;
    isActive: boolean;
    productCount: number;
    subcategories?: Category[];
    breadcrumb?: { name: string; slug: string }[];
}

// Cart Types
export interface CartItem {
    product: Product;
    quantity: number;
    price: number;
}

export interface Cart {
    _id: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    couponCode?: string;
    discount: number;
}

// User Types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone?: string;
    avatar?: string;
    role: 'user' | 'seller' | 'admin';
    verificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
    verificationData?: {
        businessName?: string;
        businessType?: string;
        idNumber?: string;
        description?: string;
        submittedAt?: string;
        reviewedAt?: string;
        rejectionReason?: string;
    };
    addresses?: Address[];
    wishlist?: Product[];
}

export interface Address {
    _id?: string;
    label: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    isDefault: boolean;
}

// Review Types
export interface Review {
    _id: string;
    product: string;
    user: {
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    rating: number;
    title?: string;
    comment: string;
    isVerifiedPurchase: boolean;
    helpful: number;
    createdAt: string;
}

export interface RatingBreakdown {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
}

// API Response Types
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Filter Types
export interface ProductFilters {
    category?: string;
    brand?: string[];
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    discount?: number;
    isFlashSale?: boolean;
    isOfficialStore?: boolean;
    inStock?: boolean;
    location?: string; // New: filter by seller location
    search?: string;
    sort?: 'price_asc' | 'price_desc' | 'rating' | 'popular' | '-createdAt';
    page?: number;
    limit?: number;
}

// Flash Sale Types
export interface FlashSaleData {
    products: Product[];
    endsAt: string | null;
}

// Auth Types
export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

