import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Menu, X, Beef, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
    const { totalItems, setIsCartOpen } = useCart();
    const { toggleTheme, isDark } = useTheme();
    const { isAdmin, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                            <Beef className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-display text-xl md:text-2xl font-bold text-surface-900 dark:text-white">
                                SAS <span className="text-primary-500">A1 Beef Stall</span>
                            </h1>
                            <p className="text-xs text-surface-500 dark:text-surface-400 -mt-1">
                                Premium Quality
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors hover:text-primary-500 ${location.pathname === '/'
                                ? 'text-primary-500'
                                : 'text-surface-600 dark:text-surface-300'
                                }`}
                        >
                            Shop
                        </Link>
                        <Link
                            to="/track-order"
                            className={`text-sm font-medium transition-colors hover:text-primary-500 ${location.pathname === '/track-order'
                                ? 'text-primary-500'
                                : 'text-surface-600 dark:text-surface-300'
                                }`}
                        >
                            Track Order
                        </Link>
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={`text-sm font-medium transition-colors hover:text-primary-500 ${isAdminRoute
                                    ? 'text-primary-500'
                                    : 'text-surface-600 dark:text-surface-300'
                                    }`}
                            >
                                Dashboard
                            </Link>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Cart Button */}
                        {!isAdminRoute && (
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                                aria-label="Open cart"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        )}

                        {/* Auth */}
                        {isAuthenticated ? (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors text-sm font-medium"
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-surface-500 hover:text-error hover:bg-error/10 transition-colors text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors text-sm font-medium"
                                >
                                    <User className="w-4 h-4" />
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-surface-200 dark:border-surface-800 animate-fade-in">
                        <nav className="flex flex-col gap-2">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                            >
                                Shop
                            </Link>
                            <Link
                                to="/track-order"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                            >
                                Track Order
                            </Link>
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="px-4 py-3 rounded-xl text-left text-error hover:bg-error/10 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 rounded-xl text-primary-500 font-medium hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                    >
                                        Create Account
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
