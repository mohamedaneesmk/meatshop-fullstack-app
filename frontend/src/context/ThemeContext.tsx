import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Get the initial theme from localStorage or system preference
 */
const getInitialTheme = (): Theme => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        // Check if system prefers light
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
    }

    // Default to light theme if no preference
    return 'light';
};

/**
 * Apply theme to document and update meta tags
 */
const applyTheme = (theme: Theme) => {
    const root = document.documentElement;

    // Apply theme class
    if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
    } else {
        root.classList.add('light');
        root.classList.remove('dark');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#f8f8f8');
    }

    // Update document body background (fallback)
    document.body.style.backgroundColor = theme === 'dark' ? '#0a0a0a' : '#f8f8f8';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    // Apply theme on mount and whenever it changes
    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            // Only update if user hasn't manually set a preference
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                setThemeState(e.matches ? 'dark' : 'light');
            }
        };

        darkMediaQuery.addEventListener('change', handleChange);
        return () => darkMediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Listen for storage changes (sync across tabs)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
                setThemeState(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
    }, []);

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
