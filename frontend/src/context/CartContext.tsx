import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, weight: string, price: number) => void;
    removeFromCart: (productId: string, weight: string) => void;
    updateQuantity: (productId: string, weight: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalAmount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, weight: string, price: number) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.product._id === product._id && item.selectedWeight === weight
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += 1;
                return updated;
            }

            return [...prev, { product, selectedWeight: weight, price, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, weight: string) => {
        setItems((prev) =>
            prev.filter(
                (item) => !(item.product._id === productId && item.selectedWeight === weight)
            )
        );
    };

    const updateQuantity = (productId: string, weight: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId, weight);
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.product._id === productId && item.selectedWeight === weight
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('cart');
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalAmount,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
