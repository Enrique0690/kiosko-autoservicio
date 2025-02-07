import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, CartItem } from './types';
import { useIdleTimer } from './IdleTimerContext';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, cantidad: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    total: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { resetTimer } = useIdleTimer();
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = useCallback((product: Product, cantidad: number) => {
        setCart(prev => {
            const existing = prev.findIndex(item => item.id === product.id);
            return existing > -1
                ? prev.map((item, i) => i === existing ? { ...item, cantidad: item.cantidad + cantidad } : item)
                : [...prev, { ...product, cantidad, rowNumber: prev.length + 1 }];
        });

        resetTimer();
    }, []);

    const removeFromCart = useCallback((id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
        resetTimer();
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const total = cart.reduce((acc, item) => acc + item.cantidad * item.pvp1, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext)!;