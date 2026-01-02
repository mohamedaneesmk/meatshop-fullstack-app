import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    isAdmin: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to check if token is expired
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= exp;
    } catch {
        return true;
    }
};

// Helper to get initial user state
const getInitialUser = (): User | null => {
    try {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) return null;

        const user = JSON.parse(savedUser) as User;

        // Check if token is expired
        if (user.token && isTokenExpired(user.token)) {
            localStorage.removeItem('user');
            return null;
        }

        return user;
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(getInitialUser);
    const [isLoading, setIsLoading] = useState(true);

    // Check token expiration on mount and periodically
    useEffect(() => {
        const checkTokenExpiration = () => {
            if (user?.token && isTokenExpired(user.token)) {
                logout();
            }
        };

        // Check immediately
        checkTokenExpiration();
        setIsLoading(false);

        // Check every minute
        const interval = setInterval(checkTokenExpiration, 60000);

        return () => clearInterval(interval);
    }, [user?.token]);

    // Listen for logout events from API client
    useEffect(() => {
        const handleLogout = () => {
            setUser(null);
        };

        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    // Sync user state with localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = useCallback((userData: User) => {
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('cart'); // Optionally clear cart on logout
    }, []);

    const updateUser = useCallback((userData: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...userData } : null);
    }, []);

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!user && !!user.token;

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                updateUser,
                isAdmin,
                isAuthenticated,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
