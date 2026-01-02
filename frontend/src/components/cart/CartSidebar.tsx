import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartSidebar: React.FC = () => {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalAmount } = useCart();

    if (!isCartOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 mobile-overlay"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white dark:bg-surface-900 shadow-2xl animate-slide-in-right">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-primary-500" />
                            <h2 className="font-display text-lg font-semibold text-surface-900 dark:text-white">
                                Your Cart
                            </h2>
                            <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                                {items.length} items
                            </span>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                            aria-label="Close cart"
                        >
                            <X className="w-5 h-5 text-surface-500" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingBag className="w-12 h-12 text-surface-400" />
                                </div>
                                <h3 className="font-display text-lg font-semibold text-surface-900 dark:text-white mb-2">
                                    Your cart is empty
                                </h3>
                                <p className="text-surface-500 text-sm mb-6">
                                    Add some delicious meat to get started!
                                </p>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="btn-primary px-6 py-2.5 rounded-xl font-medium relative z-10"
                                >
                                    <span className="relative z-10">Continue Shopping</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={`${item.product._id}-${item.selectedWeight}`}
                                        className="flex gap-4 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl"
                                    >
                                        {/* Image */}
                                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-surface-900 dark:text-white text-sm truncate">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-xs text-surface-500 mt-0.5">
                                                {item.selectedWeight}
                                            </p>
                                            <p className="text-primary-500 font-semibold text-sm mt-1">
                                                ₹{item.price}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product._id,
                                                                item.selectedWeight,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="w-7 h-7 rounded-lg bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product._id,
                                                                item.selectedWeight,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="w-7 h-7 rounded-lg bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        removeFromCart(item.product._id, item.selectedWeight)
                                                    }
                                                    className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t border-surface-200 dark:border-surface-700 p-4 space-y-4">
                            {/* Subtotal */}
                            <div className="flex items-center justify-between">
                                <span className="text-surface-600 dark:text-surface-400">
                                    Subtotal
                                </span>
                                <span className="font-display text-xl font-bold text-surface-900 dark:text-white">
                                    ₹{totalAmount.toLocaleString()}
                                </span>
                            </div>

                            <p className="text-xs text-surface-500 text-center">
                                Cash on Delivery only. Delivery charges may apply.
                            </p>

                            {/* Checkout Button */}
                            <Link
                                to="/checkout"
                                onClick={() => setIsCartOpen(false)}
                                className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 relative"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
