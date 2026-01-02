import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Package, Edit2, Save, X, LogOut, ShoppingBag, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile as updateProfileApi, getOrdersByPhone } from '../../api/services';
import type { Order } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';

const ProfilePage: React.FC = () => {
    const { user, isAuthenticated, logout, updateUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    // Redirect if not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Fetch user orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.phone) return;
            try {
                setOrdersLoading(true);
                const response = await getOrdersByPhone(user.phone);
                if (response.success && response.data) {
                    setOrders(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchOrders();
    }, [user?.phone]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await updateProfileApi({
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
            });

            if (response.success && response.data) {
                // Update the auth context with new user data
                updateUser({
                    name: response.data.name,
                    phone: response.data.phone,
                    address: response.data.address,
                });
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
            } else {
                setError(response.message || 'Failed to update profile');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || '',
        });
        setIsEditing(false);
        setError(null);
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
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-8 md:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                            My Profile
                        </h1>
                        <p className="text-surface-500 mt-1">
                            Manage your account and view order history
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-error/10 hover:text-error transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm p-6">
                            {/* Avatar */}
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold text-white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h2 className="font-display text-xl font-semibold text-surface-900 dark:text-white">
                                    {user?.name}
                                </h2>
                                <p className="text-surface-500 text-sm">{user?.email}</p>
                                {user?.role === 'admin' && (
                                    <span className="inline-block mt-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                                        Admin
                                    </span>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
                                <div className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                                    <ShoppingBag className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-surface-500">Total Orders</p>
                                        <p className="font-semibold text-surface-900 dark:text-white">
                                            {orders.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details & Orders */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Details */}
                        <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-lg font-semibold text-surface-900 dark:text-white">
                                    Account Details
                                </h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 text-primary-500 hover:text-primary-600 text-sm font-medium"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-surface-500 hover:text-surface-700 text-sm"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Save
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-accent-500/10 border border-accent-500/20 rounded-xl text-accent-500 text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Name */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-surface-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-surface-500 mb-1">Full Name</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary-500"
                                            />
                                        ) : (
                                            <p className="font-medium text-surface-900 dark:text-white">
                                                {user?.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email (read-only) */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-surface-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-surface-500 mb-1">Email Address</p>
                                        <p className="font-medium text-surface-900 dark:text-white">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-surface-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-surface-500 mb-1">Phone Number</p>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                maxLength={10}
                                                className="w-full px-3 py-2 rounded-lg border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary-500"
                                            />
                                        ) : (
                                            <p className="font-medium text-surface-900 dark:text-white">
                                                {user?.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-surface-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-surface-500 mb-1">Delivery Address</p>
                                        {isEditing ? (
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full px-3 py-2 rounded-lg border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary-500 resize-none"
                                            />
                                        ) : (
                                            <p className="font-medium text-surface-900 dark:text-white">
                                                {user?.address || 'Not set'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Package className="w-5 h-5 text-primary-500" />
                                <h3 className="font-display text-lg font-semibold text-surface-900 dark:text-white">
                                    Order History
                                </h3>
                            </div>

                            {ordersLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner size="md" text="Loading orders..." />
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                                    <p className="text-surface-500">No orders yet</p>
                                    <Link
                                        to="/"
                                        className="inline-block mt-4 text-primary-500 hover:text-primary-600 font-medium"
                                    >
                                        Start Shopping →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.slice(0, 5).map((order) => (
                                        <div
                                            key={order._id}
                                            className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-semibold text-surface-900 dark:text-white">
                                                            {order.orderId}
                                                        </p>
                                                        <OrderStatusBadge status={order.status} size="sm" />
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-surface-500">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                    <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-display text-lg font-bold text-primary-500">
                                                        ₹{order.totalAmount.toLocaleString()}
                                                    </p>
                                                    <Link
                                                        to={`/order-success/${order.orderId}`}
                                                        className="text-sm text-primary-500 hover:text-primary-600"
                                                    >
                                                        View Details →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {orders.length > 5 && (
                                        <div className="text-center pt-2">
                                            <Link
                                                to="/track-order"
                                                className="text-primary-500 hover:text-primary-600 font-medium text-sm"
                                            >
                                                View All Orders →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
