'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, TrendingUp, CheckCircle, Truck, XCircle, Edit2, Trash2, Search } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

type TabType = 'orders' | 'products';

export default function SellerDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('orders');
    const [loading, setLoading] = useState(true);

    // Orders state
    const [orders, setOrders] = useState<any[]>([]);
    const [orderFilter, setOrderFilter] = useState('');

    // Products state
    const [products, setProducts] = useState<any[]>([]);
    const [productSearch, setProductSearch] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || (user.role !== 'seller' && user.role !== 'admin'))) {
            router.push('/');
            return;
        }

        if (user?.role === 'seller' || user?.role === 'admin') {
            loadData();
        }
    }, [user, authLoading, router, activeTab, orderFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'orders') {
                const response = await api.getSellerOrders({ limit: 50, status: orderFilter || undefined });
                setOrders(response.data || []);
            } else if (activeTab === 'products') {
                const response = await api.getSellerProducts({ limit: 100 });
                setProducts(response.data || []);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShipOrder = async (orderId: string) => {
        const trackingNumber = prompt('Enter tracking number:');
        if (!trackingNumber) return;

        try {
            await api.shipOrder(orderId, trackingNumber);
            alert('Order marked as shipped!');
            loadData();
        } catch (error: any) {
            alert(error.message || 'Failed to ship order');
        }
    };

    const handleToggleSold = async (productId: string, currentStatus: boolean) => {
        if (!confirm(`Mark this product as ${currentStatus ? 'available' : 'sold'}?`)) return;

        try {
            await api.markProductSold(productId, !currentStatus);
            alert(`Product marked as ${!currentStatus ? 'sold' : 'available'}!`);
            loadData();
        } catch (error: any) {
            alert(error.message || 'Failed to update product');
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.deleteSellerProduct(productId);
            alert('Product deleted successfully!');
            loadData();
        } catch (error: any) {
            alert(error.message || 'Failed to delete product');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold">Seller Dashboard</h1>
                    <p className="text-blue-100 mt-1">Manage your orders and products</p>
                    <Link href="/seller-analytics" className="inline-block mt-2 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition-colors">
                        View Analytics →
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1">
                        {[
                            { id: 'orders', label: 'Orders', icon: ShoppingBag },
                            { id: 'products', label: 'My Products', icon: Package },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-sm md:text-base">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Order Management</h2>
                            <select
                                value={orderFilter}
                                onChange={(e) => setOrderFilter(e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            >
                                <option value="">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Order ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Customer</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Total</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-gray-500">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order: any) => (
                                            <tr key={order._id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm font-mono">#{order._id.slice(-8)}</td>
                                                <td className="py-3 px-4 text-sm">
                                                    {order.user?.firstName} {order.user?.lastName}
                                                </td>
                                                <td className="py-3 px-4 text-sm font-semibold">
                                                    KSh {order.totalAmount?.toLocaleString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    {order.status === 'processing' && (
                                                        <button
                                                            onClick={() => handleShipOrder(order._id)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 ml-auto"
                                                        >
                                                            <Truck className="h-4 w-4" />
                                                            Mark Shipped
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Product Management</h2>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products
                                .filter(p => p.title?.toLowerCase().includes(productSearch.toLowerCase()))
                                .map((product: any) => (
                                    <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
                                            {product.images?.[0] && (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.title}</h3>
                                        <p className="text-lg font-bold text-[#8b5cf6] mb-2">KSh {product.price?.toLocaleString()}</p>

                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                                            <span>Stock: {product.stock}</span>
                                            <span className={`px-2 py-1 rounded ${product.isSold ? 'bg-red-100 text-red-700' :
                                                    product.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {product.isSold ? 'Sold' : product.status}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleSold(product._id, product.isSold)}
                                                className={`flex-1 px-3 py-2 rounded text-xs font-medium ${product.isSold
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                    }`}
                                            >
                                                {product.isSold ? 'Mark Available' : 'Mark Sold'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <p>No products found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
