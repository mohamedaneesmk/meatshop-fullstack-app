import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= exp;
    } catch {
        return true; // If we can't parse the token, consider it expired
    }
};

// Helper function to clear auth and redirect
const clearAuthAndRedirect = () => {
    localStorage.removeItem('user');
    // Dispatch a custom event so AuthContext can listen and update state
    window.dispatchEvent(new CustomEvent('auth:logout'));
    // Only redirect if not already on a public page
    const publicPaths = ['/', '/login', '/register', '/track-order'];
    if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
    }
};

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.token) {
                    // Check if token is expired before making the request
                    if (isTokenExpired(user.token)) {
                        clearAuthAndRedirect();
                        return Promise.reject(new Error('Token expired'));
                    }
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (e) {
                // Invalid JSON in localStorage, clear it
                localStorage.removeItem('user');
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || '';

        // Handle 401 Unauthorized
        if (status === 401) {
            // Check if it's a token expiration error
            if (message.toLowerCase().includes('expired') ||
                message.toLowerCase().includes('invalid') ||
                message.toLowerCase().includes('not authorized')) {
                clearAuthAndRedirect();
            }
        }

        // Handle 403 Forbidden
        if (status === 403) {
            console.error('Access denied:', message);
        }

        return Promise.reject(error);
    }
);

export default api;
