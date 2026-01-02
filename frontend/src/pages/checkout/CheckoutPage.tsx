import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Phone,
    User,
    Truck,
    CreditCard,
    CheckCircle,
    AlertCircle,
    FileText
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalAmount, clearCart } = useCart();

    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        notes: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Delivery address is required';
        } else if (formData.address.length < 20) {
            newErrors.address = 'Please enter a complete address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            setApiError(null);

            const orderData = {
                customerName: formData.customerName,
                phone: formData.phone,
                address: formData.address,
                notes: formData.notes,
                items: items.map((item) => ({
                    productId: item.product._id,
                    weight: item.selectedWeight,
                    quantity: item.quantity,
                })),
            };

            const response = await createOrder(orderData);

            if (response.success && response.data) {
                clearCart();
                navigate(`/order-success/${response.data.orderId}`);
            } else {
                setApiError(response.message || 'Failed to place order');
            }
        } catch (error: any) {
            setApiError(
                error.response?.data?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-surface-200 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Truck className="w-12 h-12 text-surface-400" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white mb-2">
                        Your cart is empty
                    </h1>
                    <p className="text-surface-500 mb-6">
                        Add some items to your cart before checking out.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
                    >
                        <span className="relative z-10">Continue Shopping</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm p-6 md:p-8">
                            <h1 className="font-display text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-6">
                                Checkout
                            </h1>

                            {apiError && (
                                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                                    <p className="text-error text-sm">{apiError}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Customer Name */}
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 transition-colors ${errors.customerName
                                                    ? 'border-error'
                                                    : 'border-surface-200 dark:border-surface-700'
                                                }`}
                                        />
                                    </div>
                                    {errors.customerName && (
                                        <p className="mt-1 text-error text-sm">{errors.customerName}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            maxLength={10}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 transition-colors ${errors.phone
                                                    ? 'border-error'
                                                    : 'border-surface-200 dark:border-surface-700'
                                                }`}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-1 text-error text-sm">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Delivery Address */}
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                        Delivery Address *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-surface-400" />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="House/Flat No., Building, Street, Landmark, City, PIN Code"
                                            rows={3}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 resize-none transition-colors ${errors.address
                                                    ? 'border-error'
                                                    : 'border-surface-200 dark:border-surface-700'
                                                }`}
                                        />
                                    </div>
                                    {errors.address && (
                                        <p className="mt-1 text-error text-sm">{errors.address}</p>
                                    )}
                                </div>

                                {/* Order Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                        Order Notes (Optional)
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-4 w-5 h-5 text-surface-400" />
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            placeholder="Any special instructions for your order..."
                                            rows={2}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="p-4 bg-accent-50 dark:bg-accent-900/20 rounded-xl border border-accent-200 dark:border-accent-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent-100 dark:bg-accent-800 rounded-lg flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-surface-900 dark:text-white">
                                                Cash on Delivery
                                            </p>
                                            <p className="text-sm text-surface-500">
                                                Pay when you receive your order
                                            </p>
                                        </div>
                                        <CheckCircle className="w-6 h-6 text-accent-500 ml-auto" />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 relative"
                                >
                                    {loading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <>
                                            <span className="relative z-10">Place Order • ₹{totalAmount.toLocaleString()}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="font-display text-xl font-semibold text-surface-900 dark:text-white mb-4">
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                                {items.map((item) => (
                                    <div
                                        key={`${item.product._id}-${item.selectedWeight}`}
                                        className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl"
                                    >
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-14 h-14 rounded-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-surface-900 dark:text-white text-sm truncate">
                                                {item.product.name}
                                            </p>
                                            <p className="text-xs text-surface-500">
                                                {item.selectedWeight} × {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-primary-500">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-surface-200 dark:border-surface-700 pt-4 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-surface-500">Subtotal</span>
                                    <span className="font-medium text-surface-900 dark:text-white">
                                        ₹{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-surface-500">Delivery</span>
                                    <span className="font-medium text-accent-500">Free</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-surface-200 dark:border-surface-700">
                                    <span className="font-semibold text-surface-900 dark:text-white">
                                        Total
                                    </span>
                                    <span className="font-display text-2xl font-bold text-primary-500">
                                        ₹{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-800 rounded-xl">
                                <p className="text-xs text-surface-500 text-center">
                                    By placing this order, you agree to our terms of service
                                    and privacy policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
