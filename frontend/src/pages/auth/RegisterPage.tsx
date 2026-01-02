import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, AlertCircle, Beef, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { register as registerApi } from '../../api/services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const validateForm = (): string | null => {
        if (!formData.name.trim()) return 'Name is required';
        if (!formData.email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email';
        if (!formData.password) return 'Password is required';
        if (formData.password.length < 6) return 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        if (!formData.phone.trim()) return 'Phone number is required';
        if (!/^[0-9]{10}$/.test(formData.phone)) return 'Please enter a valid 10-digit phone number';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await registerApi({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address || undefined,
            });

            if (response.success && response.data) {
                login(response.data);
                navigate('/', { replace: true });
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const passwordStrength = (): { strength: number; label: string; color: string } => {
        const password = formData.password;
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: 'bg-error' };
        if (strength <= 3) return { strength, label: 'Medium', color: 'bg-warning' };
        return { strength, label: 'Strong', color: 'bg-accent-500' };
    };

    const pwStrength = passwordStrength();

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-6">
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
                        Create Account
                    </h1>
                    <p className="text-surface-500 mt-1">
                        Join us for fresh meat delivered to your door
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white dark:bg-surface-850 rounded-2xl shadow-lg p-6 md:p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                            <p className="text-error text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Full Name <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Email Address <span className="text-error">*</span>
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

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Phone Number <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    maxLength={10}
                                    autoComplete="tel"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Password <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    autoComplete="new-password"
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
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-colors ${i <= pwStrength.strength ? pwStrength.color : 'bg-surface-200 dark:bg-surface-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs mt-1 ${pwStrength.color.replace('bg-', 'text-')}`}>
                                        {pwStrength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Confirm Password <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <p className="text-xs text-accent-500 mt-1 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Passwords match
                                </p>
                            )}
                        </div>

                        {/* Address (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Delivery Address <span className="text-surface-400 text-xs">(Optional)</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3 w-5 h-5 text-surface-400" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your delivery address"
                                    rows={2}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 relative mt-6"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <span className="relative z-10">Create Account</span>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-surface-500">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-primary-500 hover:text-primary-600 font-medium"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
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

export default RegisterPage;
