import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Beef } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../api/services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin, login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in as admin
    if (isAdmin) {
        return <Navigate to="/admin" replace />;
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
                if (response.data.role !== 'admin') {
                    setError('Access denied. Admin only.');
                    return;
                }
                login(response.data);
                navigate('/admin');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
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
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
                        <Beef className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-white">
                        Admin Login
                    </h1>
                    <p className="text-surface-400 mt-1">
                        Sign in to access the dashboard
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-2xl p-8">
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
                                    placeholder="admin@meatshop.com"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400"
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
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 relative"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <span className="relative z-10">Sign In</span>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-800 rounded-xl">
                        <p className="text-xs text-surface-500 text-center mb-2">
                            Demo Credentials
                        </p>
                        <div className="text-center text-sm">
                            <p className="text-surface-700 dark:text-surface-300">
                                Email: <span className="font-mono">admin@meatshop.com</span>
                            </p>
                            <p className="text-surface-700 dark:text-surface-300">
                                Password: <span className="font-mono">admin123</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
