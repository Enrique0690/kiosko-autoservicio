import { useState } from 'react';

interface Product {
  id: number;
  idLinea?: number;
  descripcion: string;
  habilitado?: boolean;
  existencia?: number;
  pvp1: number;
}

export interface CartItem extends Product {
  cantidad: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingProductIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].cantidad += 1;
        return updatedCart;
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + item.cantidad * item.pvp1, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return { cart, addToCart, removeFromCart, clearCart, total, totalItems };
};