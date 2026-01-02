import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Beef, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../api/services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get the redirect path from location state, or default to home
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    // Redirect if already logged in
    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await loginApi(formData.email, formData.password);

            if (response.success && response.data) {
                login(response.data);
                navigate(from, { replace: true });
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Invalid email or password';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <Beef className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                            <h2 className="font-display text-xl font-bold text-surface-900 dark:text-white">
                                SAS <span className="text-primary-500">A1 Beef Stall</span>
                            </h2>
                        </div>
                    </Link>
                    <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white mt-4">
                        Welcome Back
                    </h1>
                    <p className="text-surface-500 mt-1">
                        Sign in to your account
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-lg p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                            <p className="text-error text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 relative"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <span className="relative z-10">Sign In</span>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-surface-500">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-primary-500 hover:text-primary-600 font-medium"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
                        <span className="text-sm text-surface-400">or</span>
                        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
                    </div>

                    {/* Admin Login Link */}
                    <Link
                        to="/admin/login"
                        className="block w-full py-3 rounded-xl font-medium border-2 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 text-center transition-colors"
                    >
                        Admin Login
                    </Link>
                </div>

                {/* Back to Shop */}
                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-surface-500 hover:text-primary-500 text-sm"
                    >
                        ← Back to Shop
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
