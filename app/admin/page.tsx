'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Users, Package, ShoppingBag, DollarSign, TrendingUp,
    AlertCircle, CheckCircle, XCircle, Edit2, Trash2, Search, Filter, Bell, Send,
    BarChart3, Activity, Shield
} from 'lucide-react';
import { api } from '@/lib/api';

type TabType = 'overview' | 'users' | 'products' | 'orders' | 'notifications' | 'analytics' | 'system';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [loading, setLoading] = useState(true);

    // Overview stats
    const [stats, setStats] = useState<any>({});

    // Users
    const [users, setUsers] = useState<any[]>([]);
    const [userSearch, setUserSearch] = useState('');

    // Products
    const [products, setProducts] = useState<any[]>([]);
    const [productSearch, setProductSearch] = useState('');

    // Orders
    const [orders, setOrders] = useState<any[]>([]);

    // Notifications
    const [broadcastSubject, setBroadcastSubject] = useState('');
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'sellers' | 'users'>('all');
    const [broadcastResults, setBroadcastResults] = useState<any>(null);
    const [sending, setSending] = useState(false);

    // Monitoring
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [errorLogs, setErrorLogs] = useState<any[]>([]);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
            return;
        }

        if (user?.role === 'admin') {
            loadData();
        }
    }, [user, authLoading, router, activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const response = await api.getAdminOverview();
                setStats(response.data);
            } else if (activeTab === 'users') {
                const response = await api.getAdminUsers({ limit: 50 });
                setUsers(response.data || []);
            } else if (activeTab === 'products') {
                const response = await api.getAdminProducts({ limit: 50 });
                setProducts(response.data || []);
            } else if (activeTab === 'orders') {
                const response = await api.getAdminOrders({ limit: 50 });
                setOrders(response.data || []);
            } else if (activeTab === 'analytics') {
                const response = await api.getAnalyticsDashboard();
                setAnalyticsData(response.data);
            } else if (activeTab === 'system') {
                const response = await api.getErrorLogs();
                setErrorLogs(response.data || []);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (userId: string, action: 'ban' | 'delete' | 'makeAdmin') => {
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            if (action === 'delete') {
                await api.deleteUser(userId);
            } else if (action === 'ban') {
                await api.updateUserRole(userId, 'user', true);
            } else if (action === 'makeAdmin') {
                await api.updateUserRole(userId, 'admin', false);
            }
            alert('Action completed successfully');
            loadData();
        } catch (error: any) {
            alert(error.message || 'Action failed');
        }
    };

    const handleProductAction = async (productId: string, action: 'approve' | 'reject' | 'delete') => {
        if (!confirm(`Are you sure you want to ${action} this product?`)) return;

        try {
            if (action === 'delete') {
                await api.deleteProduct(productId);
            } else {
                await api.updateProductStatus(productId, action === 'approve' ? 'active' : 'rejected');
            }
            alert('Action completed successfully');
            loadData();
        } catch (error: any) {
            alert(error.message || 'Action failed');
        }
    };

    const handleOrderStatusUpdate = async (orderId: string, status: string) => {
        try {
            await api.updateOrderStatus(orderId, status);
            alert('Order status updated');
            loadData();
        } catch (error: any) {
            alert(error.message || 'Update failed');
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
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-purple-100 mt-1">100% Website Control</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Overview', icon: TrendingUp },
                            { id: 'users', label: 'Users', icon: Users },
                            { id: 'products', label: 'Products', icon: Package },
                            { id: 'orders', label: 'Orders', icon: ShoppingBag },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                            { id: 'system', label: 'System Health', icon: Activity },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-[#8b5cf6] text-[#8b5cf6]'
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
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg shadow p-4 md:p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Users className="h-8 w-8 text-blue-600" />
                                    <span className="text-gray-500 text-sm">Users</span>
                                </div>
                                <p className="text-2xl md:text-3xl font-bold">{stats.totalUsers || 0}</p>
                                <p className="text-xs md:text-sm text-green-600 mt-1">+{stats.activeUsers || 0} this month</p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-4 md:p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Package className="h-8 w-8 text-purple-600" />
                                    <span className="text-gray-500 text-sm">Products</span>
                                </div>
                                <p className="text-2xl md:text-3xl font-bold">{stats.totalProducts || 0}</p>
                                <p className="text-xs md:text-sm text-orange-600 mt-1">{stats.pendingProducts || 0} pending</p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-4 md:p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShoppingBag className="h-8 w-8 text-green-600" />
                                    <span className="text-gray-500 text-sm">Orders</span>
                                </div>
                                <p className="text-2xl md:text-3xl font-bold">{stats.totalOrders || 0}</p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-4 md:p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <DollarSign className="h-8 w-8 text-yellow-600" />
                                    <span className="text-gray-500 text-sm">Revenue</span>
                                </div>
                                <p className="text-2xl md:text-3xl font-bold">KSh {(stats.totalRevenue || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg shadow p-4 md:p-6">
                            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 text-sm">Order ID</th>
                                            <th className="text-left py-2 text-sm">Customer</th>
                                            <th className="text-left py-2 text-sm">Amount</th>
                                            <th className="text-left py-2 text-sm">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders?.slice(0, 5).map((order: any) => (
                                            <tr key={order._id} className="border-b">
                                                <td className="py-3 text-sm">#{order._id.slice(-6)}</td>
                                                <td className="py-3 text-sm">{order.user?.firstName} {order.user?.lastName}</td>
                                                <td className="py-3 text-sm font-semibold">KSh {order.totalAmount?.toLocaleString()}</td>
                                                <td className="py-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">User Management</h2>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="px-3 py-2 border rounded-lg text-sm"
                                />
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Name</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Email</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Role</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u =>
                                        u.firstName?.toLowerCase().includes(userSearch.toLowerCase()) ||
                                        u.email?.toLowerCase().includes(userSearch.toLowerCase())
                                    ).map((user: any) => (
                                        <tr key={user._id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">{user.firstName} {user.lastName}</td>
                                            <td className="py-3 px-4 text-sm">{user.email}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {user.isBanned ? (
                                                    <span className="text-red-600 text-sm">Banned</span>
                                                ) : (
                                                    <span className="text-green-600 text-sm">Active</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleUserAction(user._id, 'makeAdmin')}
                                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleUserAction(user._id, 'ban')}
                                                        className="text-orange-600 hover:text-orange-800"
                                                    >
                                                        <AlertCircle className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUserAction(user._id, 'delete')}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Product</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Price</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Seller</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.filter(p =>
                                        p.title?.toLowerCase().includes(productSearch.toLowerCase())
                                    ).map((product: any) => (
                                        <tr key={product._id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">{product.title}</td>
                                            <td className="py-3 px-4 text-sm font-semibold">KSh {product.price?.toLocaleString()}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm">{product.seller?.firstName || 'N/A'}</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {product.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleProductAction(product._id, 'approve')}
                                                                className="text-green-600 hover:text-green-800"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleProductAction(product._id, 'reject')}
                                                                className="text-orange-600 hover:text-orange-800"
                                                                title="Reject"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleProductAction(product._id, 'delete')}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <h2 className="text-xl font-bold mb-4">Order Management</h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Order ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Customer</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order: any) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-mono">#{order._id.slice(-8)}</td>
                                            <td className="py-3 px-4 text-sm">{order.user?.firstName} {order.user?.lastName}</td>
                                            <td className="py-3 px-4 text-sm font-semibold">KSh {order.totalAmount?.toLocaleString()}</td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                                                    className="px-2 py-1 border rounded text-xs"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* Analytics Tab */}
                {activeTab === 'analytics' && analyticsData && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-gray-500 font-medium mb-2">Total Installations</h3>
                                <div className="flex items-end gap-2">
                                    <p className="text-4xl font-bold">{analyticsData.totalInstalls}</p>
                                    <span className="text-green-600 mb-1 font-medium text-sm">Real-time</span>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-gray-500 font-medium mb-2">Views Today</h3>
                                <div className="flex items-end gap-2">
                                    <p className="text-4xl font-bold">{analyticsData.todayViews}</p>
                                    <span className="text-sm text-gray-400 mb-1">vs {analyticsData.monthlyViews} monthly</span>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-gray-500 font-medium mb-2">Active Sessions</h3>
                                <div className="flex items-end gap-2">
                                    <p className="text-4xl font-bold">--</p>
                                    <span className="text-sm text-gray-400 mb-1">Calculated hourly</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Events List */}
                        <div className="bg-white rounded-lg shadow px-6 py-4">
                            <h3 className="font-bold text-lg mb-4">Recent Activity Stream</h3>
                            <div className="space-y-3">
                                {analyticsData.recentEvents?.map((event: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 hover:bg-gray-50 p-2 rounded transition">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase w-20 text-center ${event.eventType === 'pwa_install' ? 'bg-purple-100 text-purple-700' :
                                                    event.eventType === 'page_view' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                                                }`}>
                                                {event.eventType}
                                            </span>
                                            <span className="text-gray-600 truncate max-w-md" title={event.url}>{event.path || event.url}</span>
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                            {new Date(event.createdAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* System Health Tab */}
                {activeTab === 'system' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-500" />
                                Error Logs
                            </h2>
                            <button
                                onClick={loadData}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Refresh Logs
                            </button>
                        </div>

                        {errorLogs.length === 0 ? (
                            <div className="text-center py-12 bg-green-50 rounded-lg border border-green-100">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-green-900">All Systems Operational</h3>
                                <p className="text-green-600">No errors recorded in the log.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {errorLogs.map((log: any) => (
                                    <div key={log._id} className="border rounded-lg p-4 hover:shadow-md transition bg-red-50/10 border-red-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${log.type === 'backend' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {log.type}
                                                    </span>
                                                    <span className="font-mono text-xs text-gray-500">{log._id}</span>
                                                </div>
                                                <h4 className="font-bold text-red-700">{log.message}</h4>
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Context Details */}
                                        <div className="mt-3 bg-gray-900 rounded p-3 overflow-x-auto">
                                            <pre className="text-xs text-gray-300 font-mono">
                                                {log.stack ? log.stack.split('\n')[0] : 'No stack trace'}
                                                {'\n'}
                                                {log.context && JSON.stringify(log.context, null, 2)}
                                                {'\n'}
                                                User Agent: {log.deviceInfo?.userAgent}
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

