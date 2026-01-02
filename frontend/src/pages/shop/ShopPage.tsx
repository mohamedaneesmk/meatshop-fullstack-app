import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, Shield, Clock } from 'lucide-react';
import type { Product, Category } from '../../types';
import { getProducts } from '../../api/services';
import ProductCard from '../../components/product/ProductCard';
import CategoryTabs from '../../components/product/CategoryTabs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ShopPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<Category>('all');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts(activeCategory);
                if (response.success && response.data) {
                    setProducts(response.data);
                }
            } catch (err) {
                setError('Failed to load products. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory]);

    const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-hero">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-primary-400" />
                            <span className="text-primary-300 text-sm font-medium">
                                Fresh Daily Delivery
                            </span>
                        </div>

                        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                            Premium Fresh
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                                Beef Delivered
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-surface-300 max-w-2xl mx-auto mb-10">
                            From our stall to your kitchen. Experience the finest quality beef,
                            expertly cut and delivered fresh to your doorstep.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            <div className="flex flex-col items-center p-4 glass rounded-xl">
                                <Truck className="w-6 h-6 text-primary-400 mb-2" />
                                <span className="text-white text-sm font-medium">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center p-4 glass rounded-xl">
                                <Shield className="w-6 h-6 text-primary-400 mb-2" />
                                <span className="text-white text-sm font-medium">100% Fresh</span>
                            </div>
                            <div className="flex flex-col items-center p-4 glass rounded-xl">
                                <Clock className="w-6 h-6 text-primary-400 mb-2" />
                                <span className="text-white text-sm font-medium">Same Day</span>
                            </div>
                            <div className="flex flex-col items-center p-4 glass rounded-xl">
                                <Sparkles className="w-6 h-6 text-primary-400 mb-2" />
                                <span className="text-white text-sm font-medium">Top Quality</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg
                        viewBox="0 0 1440 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full"
                    >
                        <path
                            d="M0 50L60 45.8C120 41.7 240 33.3 360 35.8C480 38.3 600 51.7 720 55C840 58.3 960 51.7 1080 48.3C1200 45 1320 45 1380 45L1440 45V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
                            className="fill-surface-50 dark:fill-surface-950"
                        />
                    </svg>
                </div>
            </section>

            {/* Best Sellers Section */}
            {bestSellers.length > 0 && (
                <section className="py-12 md:py-16 bg-surface-50 dark:bg-surface-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-gold-100 dark:bg-gold-900/30 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-gold-500" />
                            </div>
                            <div>
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                                    Best Sellers
                                </h2>
                                <p className="text-surface-500 text-sm">
                                    Our customers' favorites
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {bestSellers.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Products Section */}
            <section className="py-12 md:py-16 bg-surface-100 dark:bg-surface-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                        <div>
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                                Shop All Products
                            </h2>
                            <p className="text-surface-500 mt-1">
                                Browse our fresh selection
                            </p>
                        </div>

                        {/* Category Tabs */}
                        <CategoryTabs
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <LoadingSpinner size="lg" text="Loading fresh products..." />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-error mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary px-6 py-2.5 rounded-xl"
                            >
                                <span className="relative z-10">Try Again</span>
                            </button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-surface-500 text-lg">
                                No products found in this category.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 md:py-24 bg-surface-50 dark:bg-surface-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
                            Why Choose SAS A1 Beef Stall?
                        </h2>
                        <p className="text-surface-500 max-w-2xl mx-auto">
                            We're committed to delivering the freshest, highest quality meat
                            right to your doorstep.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white dark:bg-surface-850 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🥩</span>
                            </div>
                            <h3 className="font-display text-xl font-semibold text-surface-900 dark:text-white mb-2">
                                Premium Quality
                            </h3>
                            <p className="text-surface-500 text-sm">
                                We source only the finest cuts from trusted farms and suppliers,
                                ensuring every piece meets our high standards.
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-surface-850 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">❄️</span>
                            </div>
                            <h3 className="font-display text-xl font-semibold text-surface-900 dark:text-white mb-2">
                                Cold Chain Delivery
                            </h3>
                            <p className="text-surface-500 text-sm">
                                Our temperature-controlled delivery ensures your meat arrives
                                fresh and safe, every single time.
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-surface-850 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">✂️</span>
                            </div>
                            <h3 className="font-display text-xl font-semibold text-surface-900 dark:text-white mb-2">
                                Expert Butchers
                            </h3>
                            <p className="text-surface-500 text-sm">
                                Our skilled butchers prepare each order with precision and care,
                                giving you the perfect cut every time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShopPage;
