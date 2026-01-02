import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2
                className={`${sizeClasses[size]} text-primary-500 animate-spin`}
            />
            {text && (
                <p className="text-surface-500 dark:text-surface-400 text-sm animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
