import React from 'react';
import type { Category } from '../../types';

interface CategoryTabsProps {
    activeCategory: Category;
    onCategoryChange: (category: Category) => void;
}

const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: 'All Beef', icon: '🥩' },
    { id: 'beef', label: 'Fresh Cuts', icon: '🥩' },
];

const CategoryTabs: React.FC<CategoryTabsProps> = ({
    activeCategory,
    onCategoryChange,
}) => {
    return (
        <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium text-sm md:text-base flex items-center gap-2 transition-all duration-300 ${activeCategory === category.id
                        ? 'category-tab-active'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                        }`}
                >
                    <span className="text-lg">{category.icon}</span>
                    <span className="hidden sm:inline">{category.label}</span>
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
