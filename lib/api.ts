const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Add auth token if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
            }

            // Add session ID for cart
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
                (headers as Record<string, string>)['X-Session-ID'] = sessionId;
            }
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    }

    // Generic methods
    public async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    public async post<T>(endpoint: string, body: any, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    // Products
    async getProducts(params: Record<string, any> = {}) {
        // Add timestamp to break aggressive PWA caching so new products appear instantly
        params.t = Date.now();
        const queryString = new URLSearchParams(
            Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
        ).toString();
        return this.request<any>(`/products${queryString ? `?${queryString}` : ''}`);
    }

    async getProductBySlug(slug: string) {
        return this.request<any>(`/products/${slug}`);
    }

    async getFlashSales() {
        return this.request<any>('/products/flash-sales?t=' + Date.now());
    }

    async getDeals() {
        return this.request<any>('/products/deals?t=' + Date.now());
    }

    async getHomepageCategories() {
        return this.request<any>(`/products/homepage-categories?t=${Date.now()}`);
    }

    async searchProducts(query: string, limit = 10) {
        return this.request<any>(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    }

    // Categories
    async getCategories(params: { flat?: boolean; level?: number } = {}) {
        const queryString = new URLSearchParams(
            Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ).toString();
        return this.request<any>(`/categories${queryString ? `?${queryString}` : ''}`);
    }

    async getCategoryBySlug(slug: string) {
        return this.request<any>(`/categories/${slug}`);
    }

    async getCategoryBrands(slug: string) {
        return this.request<any>(`/categories/${slug}/brands`);
    }

    // Cart
    async getCart() {
        return this.request<any>('/cart');
    }

    async addToCart(productId: string, quantity = 1) {
        const response = await this.request<any>('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity }),
        });

        // Save session ID if returned
        if (response.sessionId && typeof window !== 'undefined') {
            localStorage.setItem('sessionId', response.sessionId);
        }

        return response;
    }

    async updateCartItem(productId: string, quantity: number) {
        return this.request<any>('/cart/update', {
            method: 'PUT',
            body: JSON.stringify({ productId, quantity }),
        });
    }

    async removeFromCart(productId: string) {
        return this.request<any>(`/cart/remove/${productId}`, {
            method: 'DELETE',
        });
    }

    async clearCart() {
        return this.request<any>('/cart/clear', {
            method: 'DELETE',
        });
    }

    // Auth
    async login(email: string, password: string) {
        const response = await this.request<any>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        return response;
    }

    async register(data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) {
        const response = await this.request<any>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        return response;
    }

    async getMe() {
        return this.request<any>('/auth/me');
    }

    async logout() {
        try {
            await this.request<any>('/auth/logout', { method: 'POST' });
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }

    async becomeSeller(data: {
        businessName: string;
        phone: string;
        address: string;
        city: string;
        region: string;
        businessRegistrationNumber?: string;
        taxId?: string;
    }) {
        return this.request<any>('/auth/become-seller', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Seller - Product Management
    async createProduct(formData: FormData) {
        const url = `${this.baseUrl}/products`;
        const token = localStorage.getItem('accessToken');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData // Don't set Content-Type, let browser set it with boundary
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create product');
        }
        return data;
    }

    // Reviews
    async getProductReviews(productId: string, page = 1, limit = 10) {
        return this.request<any>(`/reviews/product/${productId}?page=${page}&limit=${limit}`);
    }

    async createReview(data: { productId: string; rating: number; title?: string; comment: string }) {
        return this.request<any>('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Messages
    async getConversations() {
        return this.request<any>('/messages/conversations');
    }

    async getMessages(conversationId: string) {
        return this.request<any>(`/messages/conversations/${conversationId}/messages`);
    }

    async createConversation(receiverId: string, productId?: string) {
        return this.request<any>('/messages/conversations', {
            method: 'POST',
            body: JSON.stringify({ receiverId, productId }),
        });
    }

    async markAsRead(conversationId: string) {
        return this.request<any>(`/messages/conversations/${conversationId}/read`, {
            method: 'PUT',
        });
    }

    async getUnreadCount() {
        return this.request<any>('/messages/unread-count');
    }

    // Wishlist
    async getWishlist() {
        return this.request<any>('/wishlist');
    }

    async addToWishlist(productId: string) {
        return this.request<any>(`/wishlist/${productId}`, {
            method: 'POST',
        });
    }

    async removeFromWishlist(productId: string) {
        return this.request<any>(`/wishlist/${productId}`, {
            method: 'DELETE',
        });
    }

    async clearWishlist() {
        return this.request<any>('/wishlist', {
            method: 'DELETE',
        });
    }

    async checkWishlist(productId: string) {
        return this.request<any>(`/wishlist/check/${productId}`);
    }

    // User Profile
    async updateProfile(data: { firstName?: string; lastName?: string; phone?: string; avatar?: string }) {
        return this.request<any>('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async changePassword(currentPassword: string, newPassword: string) {
        return this.request<any>('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    }

    async addAddress(data: { label?: string; fullName: string; phone: string; address: string; city: string; region: string; isDefault?: boolean }) {
        return this.request<any>('/auth/addresses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateAddress(addressId: string, data: { label?: string; fullName?: string; phone?: string; address?: string; city?: string; region?: string; isDefault?: boolean }) {
        return this.request<any>(`/auth/addresses/${addressId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteAddress(addressId: string) {
        return this.request<any>(`/auth/addresses/${addressId}`, {
            method: 'DELETE',
        });
    }

    // Product Recommendations
    async getTrendingProducts() {
        return this.request<any>('/products/recommendations/trending');
    }

    async getPersonalizedRecommendations() {
        return this.request<any>('/products/recommendations/personalized');
    }

    async getSimilarProducts(productId: string) {
        return this.request<any>(`/products/recommendations/similar/${productId}`);
    }

    async getFrequentlyBoughtTogether(productId: string) {
        return this.request<any>(`/products/recommendations/frequently-bought-together/${productId}`);
    }

    // Activity Tracking
    async trackActivity(data: { activityType: string; productId?: string; categoryId?: string; searchQuery?: string; metadata?: any }) {
        return this.request<any>('/activity/track', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getActivityHistory(type?: string, limit = 50) {
        const query = new URLSearchParams({ limit: String(limit), ...(type ? { type } : {}) }).toString();
        return this.request<any>(`/activity/history?${query}`);
    }

    async getActivityStats() {
        return this.request<any>('/activity/stats');
    }

    // Admin APIs
    async getAdminOverview() {
        return this.request<any>('/admin/analytics/overview');
    }

    async getAnalyticsDashboard() {
        return this.request<any>('/analytics/dashboard');
    }

    async getErrorLogs() {
        return this.request<any>('/errors');
    }

    async getAdminRevenue(period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
        return this.request<any>(`/admin/analytics/revenue?period=${period}`);
    }

    async getAdminUsers(params?: { page?: number; limit?: number; role?: string; search?: string }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request<any>(`/admin/users?${query}`);
    }

    async updateUserRole(userId: string, role: string, isBanned?: boolean) {
        return this.request<any>(`/admin/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ role, isBanned }),
        });
    }

    async deleteUser(userId: string) {
        return this.request<any>(`/admin/users/${userId}`, {
            method: 'DELETE',
        });
    }

    async getAdminProducts(params?: { page?: number; limit?: number; status?: string; search?: string }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request<any>(`/admin/products?${query}`);
    }

    async updateProductStatus(productId: string, status: string) {
        return this.request<any>(`/admin/products/${productId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async deleteProduct(productId: string) {
        return this.request<any>(`/admin/products/${productId}`, {
            method: 'DELETE',
        });
    }

    async getAdminOrders(params?: { page?: number; limit?: number; status?: string }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request<any>(`/admin/orders?${query}`);
    }

    async updateOrderStatus(orderId: string, status: string) {
        return this.request<any>(`/admin/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async createCategory(data: any) {
        return this.request<any>('/admin/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCategory(categoryId: string, data: any) {
        return this.request<any>(`/admin/categories/${categoryId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteCategory(categoryId: string) {
        return this.request<any>(`/admin/categories/${categoryId}`, {
            method: 'DELETE',
        });
    }

    // Seller Analytics APIs
    async getSellerOverview() {
        return this.request<any>('/seller/analytics/overview');
    }

    async getSellerRevenue(period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
        return this.request<any>(`/seller/analytics/revenue?period=${period}`);
    }

    async getSellerAnalyticsProducts() {
        return this.request<any>('/seller/analytics/products');
    }

    async getSellerTopProducts() {
        return this.request<any>('/seller/analytics/top-products');
    }

    async getSellerInventory() {
        return this.request<any>('/seller/analytics/inventory');
    }

    // Seller Order Management
    async getSellerOrders(params?: { page?: number; limit?: number; status?: string }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request<any>(`/seller/orders?${query}`);
    }

    async getSellerOrder(orderId: string) {
        return this.request<any>(`/seller/orders/${orderId}`);
    }

    async shipOrder(orderId: string, trackingNumber: string) {
        return this.request<any>(`/seller/orders/${orderId}/ship`, {
            method: 'PUT',
            body: JSON.stringify({ trackingNumber }),
        });
    }

    // Seller Product Management
    async getSellerProducts(params?: { page?: number; limit?: number }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request<any>(`/seller/products?${query}`);
    }

    async markProductSold(productId: string, isSold: boolean) {
        return this.request<any>(`/seller/products/${productId}/sold`, {
            method: 'PUT',
            body: JSON.stringify({ isSold }),
        });
    }

    async updateSellerProduct(productId: string, data: any) {
        return this.request<any>(`/seller/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteSellerProduct(productId: string) {
        return this.request<any>(`/seller/products/${productId}`, {
            method: 'DELETE',
        });
    }

    // User Orders
    async getUserOrders(params?: { page?: number; limit?: number; status?: string }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request<any>(`/orders?${query}`);
    }

    async getUserOrder(orderId: string) {
        return this.request<any>(`/orders/${orderId}`);
    }

    // Returns
    async createReturn(data: any) {
        return this.request<any>('/returns', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getUserReturns() {
        return this.request<any>('/returns');
    }

    async getReturnDetails(returnId: string) {
        return this.request<any>(`/returns/${returnId}`);
    }

    // Admin Returns
    async getAllReturns(params?: { page?: number; limit?: number; status?: string }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request<any>(`/returns/admin/all?${query}`);
    }

    async approveReturn(returnId: string, adminNotes?: string) {
        return this.request<any>(`/returns/${returnId}/approve`, {
            method: 'PUT',
            body: JSON.stringify({ adminNotes }),
        });
    }

    async rejectReturn(returnId: string, adminNotes?: string) {
        return this.request<any>(`/returns/${returnId}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ adminNotes }),
        });
    }

    async refundReturn(returnId: string, adminNotes?: string) {
        return this.request<any>(`/returns/${returnId}/refund`, {
            method: 'PUT',
            body: JSON.stringify({ adminNotes }),
        });
    }

    // Email - Broadcast
    async broadcastEmail(data: { subject: string; message: string; target: 'all' | 'sellers' | 'users' }) {
        return this.request<any>('/email/broadcast', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Brands
    async getBrands() {
        return this.request<{ success: boolean; data: { brand: string; count: number }[]; total: number }>('/brands');
    }

    async getBrandsByCategory(categorySlug: string) {
        return this.request<{ success: boolean; data: string[]; category: string }>(`/brands/by-category/${categorySlug}`);
    }

    async getBrandProducts(brandName: string, params: Record<string, any> = {}) {
        const query = new URLSearchParams(params).toString();
        const endpoint = `/brands/${encodeURIComponent(brandName)}/products${query ? `?${query}` : ''}`;
        return this.request<any>(endpoint);
    }

    // Seller Verification
    async getS3UploadUrl(fileName: string, fileType: string) {
        return this.request<any>(`/upload/presigned-url?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}&folder=verification`);
    }

    async uploadFileProxy(file: File, folder: string = 'verification') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        return this.request<any>('/upload/proxy', {
            method: 'POST',
            body: formData,
            // Header for content-type is usually handled automatically by browser with FormData
            // but we might need to ensure fetch handles it correctly (no manual Content-Type header)
        });
    }

    async submitVerification(data: { businessName: string; businessType: string; idNumber: string; description: string }) {
        return this.request<any>('/verification/submit', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getPendingVerifications() {
        return this.request<any>('/verification/pending');
    }

    async updateVerificationStatus(userId: string, status: 'approved' | 'rejected', rejectionReason?: string) {
        return this.request<any>(`/verification/${userId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, rejectionReason }),
        });
    }
}

export const api = new ApiClient();
export default api;

