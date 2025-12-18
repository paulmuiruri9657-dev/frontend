'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    DollarSign, Package, ShoppingBag, TrendingUp, AlertTriangle, Star, Eye
} from 'lucide-react';
import { api } from '@/lib/api';

export default function SellerAnalytics() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

    // Stats
    const [overview, setOverview] = useState<any>({});
    const [revenue, setRevenue] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any>({ lowStock: [], outOfStock: [] });

    useEffect(() => {
        if (!authLoading && (!user || (user.role !== 'seller' && user.role !== 'admin'))) {
            router.push('/');
            return;
        }

        if (user?.role === 'seller' || user?.role === 'admin') {
            loadData();
        }
    }, [user, authLoading, router, period]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [overviewRes, revenueRes, productsRes, topProductsRes, inventoryRes] = await Promise.all([
                api.getSellerOverview(),
                api.getSellerRevenue(period),
                api.getSellerProducts(),
                api.getSellerTopProducts(),
                api.getSellerInventory()
            ]);

            setOverview(overviewRes.data || {});
            setRevenue(revenueRes.data || []);
            setProducts(productsRes.data || []);
            setTopProducts(topProductsRes.data || []);
            setInventory(inventoryRes.data || { lowStock: [], outOfStock: [] });
        } catch (error) {
            console.error('Error loading seller analytics:', error);
        } finally {
            setLoading(false);
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
                    <h1 className="text-2xl md:text-3xl font-bold">Seller Analytics</h1>
                    <p className="text-purple-100 mt-1">Real-time Performance Data</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="h-6 w-6 text-purple-600" />
                            <span className="text-xs md:text-sm text-gray-500">Products</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold">{overview.totalProducts || 0}</p>
                        <p className="text-xs text-green-600 mt-1">{overview.activeProducts || 0} active</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                            <span className="text-xs md:text-sm text-gray-500">Orders</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold">{overview.totalOrders || 0}</p>
                        <p className="text-xs text-orange-600 mt-1">{overview.pendingOrders || 0} pending</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 md:p-6 col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-6 w-6 text-green-600" />
                            <span className="text-xs md:text-sm text-gray-500">Total Revenue</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold">KSh {(overview.totalRevenue || 0).toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-6 w-6 text-yellow-600" />
                            <span className="text-xs md:text-sm text-gray-500">Avg. Rating</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold">4.5</p>
                        <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Revenue Overview</h2>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value as any)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end gap-2">
                        {revenue.map((item: any, index: number) => {
                            const maxRevenue = Math.max(...revenue.map((r: any) => r.revenue));
                            const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="text-xs text-gray-600">KSh {item.revenue?.toLocaleString()}</div>
                                    <div
                                        className="w-full bg-gradient-to-t from-[#8b5cf6] to-[#7c3aed] rounded-t"
                                        style={{ height: `${height}%`, minHeight: '10px' }}
                                    />
                                    <div className="text-xs text-gray-500">
                                        {period === 'monthly' ? `M${item._id.month}` :
                                            period === 'weekly' ? `W${item._id.week}` :
                                                `D${item._id.day}`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Units Sold</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.slice(0, 5).map((item: any) => (
                                    <tr key={item._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm">{item.productDetails?.title}</td>
                                        <td className="py-3 px-4 text-sm font-semibold">{item.totalSold}</td>
                                        <td className="py-3 px-4 text-sm font-semibold text-green-600">
                                            KSh {item.revenue?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Product Performance */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h2 className="text-xl font-bold mb-4">Product Performance</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Views</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Stock</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Rating</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.slice(0, 10).map((product: any) => (
                                    <tr key={product._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm">{product.title}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4 text-gray-400" />
                                                {product.views || 0}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className={product.stock < 10 ? 'text-red-600 font-semibold' : ''}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                {product.rating?.toFixed(1) || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Alerts */}
                {(inventory.lowStock?.length > 0 || inventory.outOfStock?.length > 0) && (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                            <h2 className="text-xl font-bold">Inventory Alerts</h2>
                        </div>

                        {inventory.outOfStock?.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-semibold text-red-600 mb-2">Out of Stock ({inventory.outOfStock.length})</h3>
                                <div className="space-y-2">
                                    {inventory.outOfStock.slice(0, 5).map((product: any) => (
                                        <div key={product._id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                                            <span className="text-sm">{product.title}</span>
                                            <span className="text-sm font-semibold text-red-600">0 units</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {inventory.lowStock?.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-orange-600 mb-2">Low Stock ({inventory.lowStock.length})</h3>
                                <div className="space-y-2">
                                    {inventory.lowStock.slice(0, 5).map((product: any) => (
                                        <div key={product._id} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                                            <span className="text-sm">{product.title}</span>
                                            <span className="text-sm font-semibold text-orange-600">{product.stock} units left</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
