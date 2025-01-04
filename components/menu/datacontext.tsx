import React, { createContext, useContext, useState } from 'react';
import linesData from '../../constants/pruebas/lines.json';
import productsData from '../../constants/pruebas/products.json';

interface Product {
  id: number;
  descripcion: string;
  pvp1: number;
}

interface CartItem extends Product {
  cantidad: number;
}

interface DataContextType {
  lines: typeof linesData;
  products: typeof productsData;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  total: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingProductIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].cantidad += 1;
        return updatedCart;
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((acc, item) => acc + item.cantidad * item.pvp1, 0);

  return (
    <DataContext.Provider value={{ lines: linesData, products: productsData, cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext debe usarse dentro de un DataProvider');
  }
  return context;
};