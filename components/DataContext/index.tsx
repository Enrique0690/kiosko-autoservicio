import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { LoadingComponent, ErrorComponent } from './chargingstatus';
import { useCart } from './Context/CartContext';
import { useProducts } from './Context/ProductsContext';
import { useClient } from './Context/ClientContext';
import { useIdleTimer } from './Context/TimerContext';

interface DataContextType {
  lines: any[];
  products: any[];
  cart: any[];
  addToCart: () => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
  retry: () => void;
  observations?: string;
  setObservations: (observations: string) => void;
  idleTimeLeft: number;
  isInvoiceRequested: boolean;
  setIsInvoiceRequested: (value: boolean) => void;
  clientData: any;
  setClientData: (data: any) => void;
  startTimer: () => void;
  resetTimer: () => void;
  stopTimer: () => void;
}
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const cartContext = useCart();
  const productsContext = useProducts();
  const clientContext = useClient();
  const router = useRouter();
  const timerContext = useIdleTimer(cartContext.clearCart, router);

  const contextValue: any = {
    ...cartContext,
    ...productsContext,
    ...clientContext,
    ...timerContext,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {productsContext.loading ? (
        <LoadingComponent />
      ) : productsContext.error ? (
        <ErrorComponent message={productsContext.error} onRetry={productsContext.retry} />
      ) : (
        children
      )}
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