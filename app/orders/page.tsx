'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Package, Truck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
    _id: string;
    orderNumber: string;
    items: any[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}

export default function OrdersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/');
        return null;
    }

    useEffect(() => {
        // TODO: Fetch orders from API
        // For now, showing empty state
        setLoadingOrders(false);
    }, []);

    if (loading || loadingOrders) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'cancelled':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'shipped':
                return <Truck className="h-5 w-5 text-blue-500" />;
            default:
                return <Clock className="h-5 w-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            case 'shipped':
                return 'bg-blue-100 text-blue-700';
            case 'processing':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
                    <p className="text-gray-600 mb-6">
                        You haven't placed any orders yet. Start shopping to see your orders here!
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-[#8b5cf6] text-white px-6 py-3 rounded-lg hover:bg-[#7c3aed] transition font-semibold"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <p className="font-semibold mb-2">{order.items.length} item(s)</p>
                                <p className="text-lg font-bold text-[#8b5cf6]">
                                    KSh {order.total.toLocaleString()}
                                </p>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <Link
                                    href={`/orders/${order._id}`}
                                    className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                                >
                                    View Details
                                </Link>
                                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                    <button className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition">
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

