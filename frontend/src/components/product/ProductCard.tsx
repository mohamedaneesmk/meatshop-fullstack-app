import React, { useState } from 'react';
import { ShoppingCart, Star, ChevronDown } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [selectedWeight, setSelectedWeight] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { addToCart } = useCart();

    const selectedVariant = product.weightVariants.find(
        (v) => v.weight === selectedWeight
    );

    const handleAddToCart = () => {
        if (selectedVariant) {
            addToCart(product, selectedWeight, selectedVariant.price);
        }
    };

    const lowestPrice = Math.min(...product.weightVariants.map((v) => v.price));

    return (
        <div className="group bg-white dark:bg-surface-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Best Seller Badge */}
                {product.isBestSeller && (
                    <div className="absolute top-3 left-3 best-seller-badge px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Best Seller
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
                    {product.category}
                </div>

                {/* Quick Price */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm rounded-lg">
                    <span className="text-xs text-surface-500 dark:text-surface-400">From</span>
                    <span className="ml-1 font-display font-bold text-primary-600 dark:text-primary-400">
                        ₹{lowestPrice}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title & Description */}
                <h3 className="font-display font-semibold text-lg text-surface-900 dark:text-white mb-1 line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mb-4">
                    {product.description}
                </p>

                {/* Weight Selection */}
                <div className="relative mb-4">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full px-4 py-3 rounded-xl border-2 text-left flex items-center justify-between transition-all ${selectedWeight
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                            }`}
                    >
                        <span
                            className={
                                selectedWeight
                                    ? 'text-surface-900 dark:text-white font-medium'
                                    : 'text-surface-400'
                            }
                        >
                            {selectedWeight || 'Select weight'}
                        </span>
                        <div className="flex items-center gap-2">
                            {selectedVariant && (
                                <span className="font-semibold text-primary-600 dark:text-primary-400">
                                    ₹{selectedVariant.price}
                                </span>
                            )}
                            <ChevronDown
                                className={`w-5 h-5 text-surface-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute z-20 w-full mt-2 py-2 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 animate-fade-in">
                            {product.weightVariants.map((variant) => (
                                <button
                                    key={variant.weight}
                                    onClick={() => {
                                        setSelectedWeight(variant.weight);
                                        setIsDropdownOpen(false);
                                    }}
                                    disabled={variant.stock === 0}
                                    className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                        } ${selectedWeight === variant.weight ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                                >
                                    <span className="font-medium text-surface-700 dark:text-surface-200">
                                        {variant.weight}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                                            ₹{variant.price}
                                        </span>
                                        {variant.stock === 0 && (
                                            <span className="text-xs text-error">Out of stock</span>
                                        )}
                                        {variant.stock > 0 && variant.stock <= 5 && (
                                            <span className="text-xs text-warning">
                                                Only {variant.stock} left
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedWeight}
                    className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${selectedWeight
                        ? 'btn-primary'
                        : 'bg-surface-200 dark:bg-surface-700 text-surface-400 cursor-not-allowed'
                        }`}
                >
                    <ShoppingCart className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">
                        {selectedWeight ? 'Add to Cart' : 'Select Weight First'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
