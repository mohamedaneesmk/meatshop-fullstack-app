import React, { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import {
    Package,
    ShoppingCart,
    TrendingUp,
    Clock,
    Truck,
    CheckCircle,
    Plus,
    Scissors,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Order, Product, OrderStats, OrderStatus } from '../../types';
import {
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
    getAllProductsAdmin,
} from '../../api/services';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboardPage: React.FC = () => {
    const { isAdmin, isAuthenticated } = useAuth();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    // Redirect if not admin
    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ordersRes, statsRes, productsRes] = await Promise.all([
                    getAllOrders(statusFilter),
                    getOrderStats(),
                    getAllProductsAdmin(),
                ]);

                if (ordersRes.success && ordersRes.data) {
                    setOrders(ordersRes.data);
                }
                if (statsRes.success && statsRes.data) {
                    setStats(statsRes.data);
                }
                if (productsRes.success && productsRes.data) {
                    setProducts(productsRes.data);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [statusFilter]);

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        try {
            setUpdatingOrderId(orderId);
            const response = await updateOrderStatus(orderId, newStatus);

            if (response.success && response.data) {
                setOrders((prev) =>
                    prev.map((order) =>
                        order.orderId === orderId ? { ...order, status: newStatus } : order
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const statusOptions: OrderStatus[] = [
        'pending',
        'cutting',
        'out-for-delivery',
        'delivered',
        'cancelled',
    ];

    const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
        const flow: OrderStatus[] = ['pending', 'cutting', 'out-for-delivery', 'delivered'];
        const currentIndex = flow.indexOf(currentStatus);
        if (currentIndex === -1 || currentIndex === flow.length - 1) return null;
        return flow[currentIndex + 1];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-surface-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-surface-500 mt-1">
                            Manage your orders and inventory
                        </p>
                    </div>

                    {/* Tab Toggle */}
                    <div className="flex bg-surface-200 dark:bg-surface-800 rounded-xl p-1">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'orders'
                                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'products'
                                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                                }`}
                        >
                            <Package className="w-4 h-4" />
                            Products
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-surface-850 rounded-xl p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-primary-500" />
                                </div>
                                <span className="text-sm text-surface-500">Total Orders</span>
                            </div>
                            <p className="font-display text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                                {stats.totalOrders}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-surface-850 rounded-xl p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-accent-500" />
                                </div>
                                <span className="text-sm text-surface-500">Revenue</span>
                            </div>
                            <p className="font-display text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                                ₹{stats.totalRevenue.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-surface-850 rounded-xl p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gold-100 dark:bg-gold-900/30 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-gold-500" />
                                </div>
                                <span className="text-sm text-surface-500">Today</span>
                            </div>
                            <p className="font-display text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                                {stats.todayOrders}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-surface-850 rounded-xl p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-info" />
                                </div>
                                <span className="text-sm text-surface-500">Products</span>
                            </div>
                            <p className="font-display text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                                {products.length}
                            </p>
                        </div>
                    </div>
                )}

                {/* Orders View */}
                {activeTab === 'orders' && (
                    <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm overflow-hidden">
                        {/* Filters */}
                        <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700">
                            <div className="flex flex-wrap gap-2">
                                {['all', 'pending', 'cutting', 'out-for-delivery', 'delivered', 'cancelled'].map(
                                    (status) => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${statusFilter === status
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                                                }`}
                                        >
                                            {status === 'all' ? 'All Orders' : status.replace('-', ' ')}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="divide-y divide-surface-200 dark:divide-surface-700">
                            {orders.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Package className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                                    <p className="text-surface-500">No orders found</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="p-4 md:p-6 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                            {/* Order Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className="font-display font-bold text-surface-900 dark:text-white">
                                                        {order.orderId}
                                                    </p>
                                                    <OrderStatusBadge status={order.status} size="sm" />
                                                </div>
                                                <p className="text-sm text-surface-500 mb-1">
                                                    {order.customerName} • {order.phone}
                                                </p>
                                                <p className="text-sm text-surface-400 truncate">
                                                    {order.items.map((i) => `${i.productName} (${i.weight})`).join(', ')}
                                                </p>
                                            </div>

                                            {/* Order Amount & Date */}
                                            <div className="flex items-center gap-4 lg:gap-8">
                                                <div className="text-right">
                                                    <p className="font-display text-lg font-bold text-primary-500">
                                                        ₹{order.totalAmount.toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-surface-400">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Status Update Dropdown */}
                                                <div className="relative">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) =>
                                                            handleStatusUpdate(order.orderId, e.target.value as OrderStatus)
                                                        }
                                                        disabled={updatingOrderId === order.orderId}
                                                        className="appearance-none px-4 py-2 pr-10 rounded-lg border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm font-medium cursor-pointer"
                                                    >
                                                        {statusOptions.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status.replace('-', ' ')}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {updatingOrderId === order.orderId && (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                            <LoadingSpinner size="sm" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Quick Action */}
                                                {getNextStatus(order.status) && (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(order.orderId, getNextStatus(order.status)!)
                                                        }
                                                        disabled={updatingOrderId === order.orderId}
                                                        className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                                                    >
                                                        {order.status === 'pending' && <Scissors className="w-4 h-4 relative z-10" />}
                                                        {order.status === 'cutting' && <Truck className="w-4 h-4 relative z-10" />}
                                                        {order.status === 'out-for-delivery' && <CheckCircle className="w-4 h-4 relative z-10" />}
                                                        <span className="relative z-10 hidden sm:inline">
                                                            {order.status === 'pending' && 'Start Cutting'}
                                                            {order.status === 'cutting' && 'Send for Delivery'}
                                                            {order.status === 'out-for-delivery' && 'Mark Delivered'}
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Products View */}
                {activeTab === 'products' && (
                    <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
                            <h2 className="font-display text-xl font-semibold text-surface-900 dark:text-white">
                                Product Inventory
                            </h2>
                            <Link
                                to="/admin/products/new"
                                className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4 relative z-10" />
                                <span className="relative z-10">Add Product</span>
                            </Link>
                        </div>

                        {/* Products Grid */}
                        <div className="p-4 md:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {products.map((product) => (
                                    <div
                                        key={product._id}
                                        className={`p-4 rounded-xl border-2 ${product.isAvailable
                                            ? 'border-surface-200 dark:border-surface-700'
                                            : 'border-error/30 bg-error/5'
                                            }`}
                                    >
                                        <div className="flex gap-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-medium text-surface-900 dark:text-white truncate">
                                                        {product.name}
                                                    </h3>
                                                    {product.isBestSeller && (
                                                        <span className="text-xs bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 px-2 py-0.5 rounded-full">
                                                            ⭐ Best
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-surface-500 capitalize mt-1">
                                                    {product.category}
                                                </p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {product.weightVariants.map((v) => (
                                                        <span
                                                            key={v.weight}
                                                            className={`text-xs px-2 py-0.5 rounded ${v.stock > 0
                                                                ? 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                                                                : 'bg-error/10 text-error'
                                                                }`}
                                                        >
                                                            {v.weight}: ₹{v.price}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
