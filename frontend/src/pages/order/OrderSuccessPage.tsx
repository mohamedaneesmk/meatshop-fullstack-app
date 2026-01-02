import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Phone, Truck, Clock, Home } from 'lucide-react';
import type { Order } from '../../types';
import { getOrder } from '../../api/services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';

const OrderSuccessPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            try {
                setLoading(true);
                const response = await getOrder(orderId);
                if (response.success && response.data) {
                    setOrder(response.data);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading order details..." />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-error mb-4">{error || 'Order not found'}</p>
                    <Link
                        to="/"
                        className="btn-primary px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
                    >
                        <span className="relative z-10">Go to Shop</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-8 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-accent-100 dark:bg-accent-900/30 rounded-full mb-6 animate-pulse-glow">
                        <CheckCircle className="w-12 h-12 text-accent-500" />
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-surface-500 text-lg">
                        Thank you for your order. We'll start preparing it right away.
                    </p>
                </div>

                {/* Order Card */}
                <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gradient-primary p-6 text-white">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="text-primary-200 text-sm mb-1">Order ID</p>
                                <p className="font-display text-2xl font-bold">{order.orderId}</p>
                            </div>
                            <OrderStatusBadge status={order.status} size="lg" />
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                        <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary-500" />
                            Order Status
                        </h3>
                        <div className="flex items-center justify-between">
                            {['pending', 'cutting', 'out-for-delivery', 'delivered'].map((status, index) => {
                                const statusLabels: Record<string, string> = {
                                    pending: 'Received',
                                    cutting: 'Preparing',
                                    'out-for-delivery': 'On the Way',
                                    delivered: 'Delivered',
                                };
                                const statusIcons: Record<string, string> = {
                                    pending: '📋',
                                    cutting: '🔪',
                                    'out-for-delivery': '🚚',
                                    delivered: '✅',
                                };
                                const currentIndex = ['pending', 'cutting', 'out-for-delivery', 'delivered'].indexOf(order.status);
                                const isActive = index <= currentIndex;
                                const isCurrent = status === order.status;

                                return (
                                    <React.Fragment key={status}>
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isActive
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-surface-200 dark:bg-surface-700 text-surface-400'
                                                    } ${isCurrent ? 'ring-4 ring-primary-200 dark:ring-primary-900' : ''}`}
                                            >
                                                {statusIcons[status]}
                                            </div>
                                            <span
                                                className={`text-xs mt-2 ${isActive
                                                    ? 'text-surface-900 dark:text-white font-medium'
                                                    : 'text-surface-400'
                                                    }`}
                                            >
                                                {statusLabels[status]}
                                            </span>
                                        </div>
                                        {index < 3 && (
                                            <div
                                                className={`flex-1 h-1 mx-2 rounded ${index < currentIndex
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

                    {/* Customer Details */}
                    <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                        <h3 className="font-semibold text-surface-900 dark:text-white mb-4">
                            Delivery Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Package className="w-5 h-5 text-surface-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-surface-900 dark:text-white">
                                        {order.customerName}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-surface-400 mt-0.5" />
                                <p className="text-surface-600 dark:text-surface-300">{order.phone}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-surface-400 mt-0.5" />
                                <p className="text-surface-600 dark:text-surface-300">{order.address}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-surface-400 mt-0.5" />
                                <p className="text-surface-600 dark:text-surface-300">
                                    Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                        <h3 className="font-semibold text-surface-900 dark:text-white mb-4">
                            Order Items
                        </h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-xl"
                                >
                                    <div>
                                        <p className="font-medium text-surface-900 dark:text-white">
                                            {item.productName}
                                        </p>
                                        <p className="text-sm text-surface-500">
                                            {item.weight} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-primary-500">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-surface-900 dark:text-white">
                                Total Amount
                            </span>
                            <span className="font-display text-2xl font-bold text-primary-500">
                                ₹{order.totalAmount.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-sm text-surface-500 mt-1 text-right">
                            Payment: Cash on Delivery
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link
                        to="/"
                        className="flex-1 btn-primary py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Continue Shopping</span>
                    </Link>
                    <Link
                        to="/track-order"
                        className="flex-1 py-3 rounded-xl font-medium border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Truck className="w-5 h-5" />
                        Track Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
