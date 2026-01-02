import React, { useState } from 'react';
import { Search, Phone, Package, ArrowRight } from 'lucide-react';
import type { Order } from '../../types';
import { getOrdersByPhone, getOrder } from '../../api/services';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TrackOrderPage: React.FC = () => {
    const [searchType, setSearchType] = useState<'phone' | 'orderId'>('phone');
    const [searchValue, setSearchValue] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchValue.trim()) return;

        try {
            setLoading(true);
            setError(null);
            setHasSearched(true);

            if (searchType === 'phone') {
                const response = await getOrdersByPhone(searchValue);
                if (response.success && response.data) {
                    setOrders(response.data);
                }
            } else {
                const response = await getOrder(searchValue);
                if (response.success && response.data) {
                    setOrders([response.data]);
                } else {
                    setOrders([]);
                }
            }
        } catch (err) {
            setError('Failed to find orders. Please try again.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-8 md:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
                        <Package className="w-8 h-8 text-primary-500" />
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                        Track Your Order
                    </h1>
                    <p className="text-surface-500 text-lg">
                        Enter your phone number or order ID to see your order status
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                    {/* Search Type Toggle */}
                    <div className="flex bg-surface-100 dark:bg-surface-800 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => setSearchType('phone')}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${searchType === 'phone'
                                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                                }`}
                        >
                            <Phone className="w-4 h-4" />
                            Phone Number
                        </button>
                        <button
                            onClick={() => setSearchType('orderId')}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${searchType === 'orderId'
                                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                                }`}
                        >
                            <Package className="w-4 h-4" />
                            Order ID
                        </button>
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                            <input
                                type={searchType === 'phone' ? 'tel' : 'text'}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder={
                                    searchType === 'phone'
                                        ? 'Enter your 10-digit phone number'
                                        : 'Enter your order ID (e.g., MS250101XXXX)'
                                }
                                maxLength={searchType === 'phone' ? 10 : 20}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 text-lg"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !searchValue.trim()}
                            className="btn-primary px-6 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <>
                                    <span className="relative z-10 hidden sm:inline">Search</span>
                                    <ArrowRight className="w-5 h-5 relative z-10" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-center py-8">
                        <p className="text-error">{error}</p>
                    </div>
                )}

                {/* Results */}
                {hasSearched && !loading && !error && (
                    <div>
                        {orders.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-surface-850 rounded-2xl">
                                <Package className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                                <h3 className="font-display text-xl font-semibold text-surface-900 dark:text-white mb-2">
                                    No orders found
                                </h3>
                                <p className="text-surface-500">
                                    We couldn't find any orders with that {searchType === 'phone' ? 'phone number' : 'order ID'}.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-surface-500 mb-4">
                                    Found {orders.length} order{orders.length !== 1 ? 's' : ''}
                                </p>

                                {orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {/* Order Header */}
                                        <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div>
                                                    <p className="text-sm text-surface-500 mb-1">Order ID</p>
                                                    <p className="font-display text-xl font-bold text-surface-900 dark:text-white">
                                                        {order.orderId}
                                                    </p>
                                                </div>
                                                <OrderStatusBadge status={order.status} size="md" />
                                            </div>
                                        </div>

                                        {/* Order Status Timeline */}
                                        <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700">
                                            <div className="flex items-center justify-between overflow-x-auto pb-2">
                                                {['pending', 'cutting', 'out-for-delivery', 'delivered'].map((status, index) => {
                                                    const statusLabels: Record<string, string> = {
                                                        pending: 'Received',
                                                        cutting: 'Preparing',
                                                        'out-for-delivery': 'On Way',
                                                        delivered: 'Delivered',
                                                    };
                                                    const currentIndex = ['pending', 'cutting', 'out-for-delivery', 'delivered'].indexOf(order.status);
                                                    const isActive = index <= currentIndex && order.status !== 'cancelled';

                                                    return (
                                                        <React.Fragment key={status}>
                                                            <div className="flex flex-col items-center min-w-[60px]">
                                                                <div
                                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive
                                                                        ? 'bg-primary-500 text-white'
                                                                        : 'bg-surface-200 dark:bg-surface-700 text-surface-400'
                                                                        }`}
                                                                >
                                                                    {index + 1}
                                                                </div>
                                                                <span
                                                                    className={`text-xs mt-1 whitespace-nowrap ${isActive ? 'text-surface-900 dark:text-white' : 'text-surface-400'
                                                                        }`}
                                                                >
                                                                    {statusLabels[status]}
                                                                </span>
                                                            </div>
                                                            {index < 3 && (
                                                                <div
                                                                    className={`flex-1 h-1 mx-1 rounded min-w-[20px] ${index < currentIndex && order.status !== 'cancelled'
                                                                        ? 'bg-primary-500'
                                                                        : 'bg-surface-200 dark:bg-surface-700'
                                                                        }`}
                                                                />
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="p-4 md:p-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-surface-500 mb-1">Items</p>
                                                    <div className="space-y-1">
                                                        {order.items.map((item, index) => (
                                                            <p key={index} className="text-surface-900 dark:text-white text-sm">
                                                                {item.productName} ({item.weight}) × {item.quantity}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-surface-500 mb-1">Order Date</p>
                                                    <p className="text-surface-900 dark:text-white text-sm">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                    <p className="font-display text-xl font-bold text-primary-500 mt-2">
                                                        ₹{order.totalAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-12 text-center">
                    <p className="text-surface-500 text-sm mb-2">Need help with your order?</p>
                    <a
                        href="tel:+919876543210"
                        className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
                    >
                        <Phone className="w-4 h-4" />
                        Call us at +91 98765 43210
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;
