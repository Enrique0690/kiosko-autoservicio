import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { fetchLines, fetchProducts, sendOrder } from './api';
import { LoadingComponent, ErrorComponent } from './chargingstatus';

interface Product {
  id: number;
  idLinea?: number;
  descripcion: string;
  habilitado?: boolean;
  existencia?: number;
  pvp1: number;
  dinamicoLineas?: any[];
}

interface CartItem extends Product {
  cantidad: number;
}

interface ClientData {
  identification: string;
  razonSocial: string;
  telefono?: string;
  email?: string;
}

interface DataContextType {
  lines: any[];
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
  retry: () => void;
  observations?: string;
  setObservations: (observations: string) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  idleTimeLeft: number;
  isInvoiceRequested: boolean;
  setIsInvoiceRequested: (value: boolean) => void;
  clientData: ClientData;
  setClientData: (data: ClientData) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [observations, setObservations] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idleTimeLeft, setIdleTimeLeft] = useState<number>(60);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isInvoiceRequested, setIsInvoiceRequested] = useState<boolean>(false);
  const [clientData, setClientData] = useState<ClientData>({
    identification: '',
    razonSocial: '',
    telefono: '',
    email: '',
  });
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedLines = await fetchLines();
      const fetchedProducts = await fetchProducts();
      setLines(fetchedLines);
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Hubo un error al cargar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const sendOrderData = async (orderData: any) => {
    setLoading(true);
    setError(null);
    try {
      await sendOrder(orderData);  
      router.push('/pago/completed');  
    } catch (err) {
      setError('Hubo un error al enviar el pedido. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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
    resetTimer();
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    resetTimer();
  };

  const clearCart = () => {
    setCart([]);
    resetTimer();
  };

  const total = cart.reduce((acc, item) => acc + item.cantidad * item.pvp1, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const retry = () => {
    fetchData();
  };

  const startTimer = () => {
    setIdleTimeLeft(300); 
    const interval = setInterval(() => {
      setIdleTimeLeft((prev) => {
        if (prev <= 1) {
          clearCart();
          router.push('/'); 
          clearInterval(interval);
          return 0;
        }
        return prev - 1; 
      });
    }, 1000); 
    setTimer(interval); 
  };
  
  const stopTimer = () => {
    if (timer) {
      clearInterval(timer); 
      setTimer(null); 
    }
  };
  
  const resetTimer = () => {
    stopTimer();  
    setIdleTimeLeft(300); 
    startTimer(); 
  };
  
  useEffect(() => {
    fetchData();
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const contextValue = {
    lines,
    products,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    total,
    totalItems,
    loading,
    error,
    retry,
    observations,
    setObservations,
    startTimer,
    stopTimer,
    resetTimer,
    idleTimeLeft,
    isInvoiceRequested,
    setIsInvoiceRequested,
    clientData,
    setClientData,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorComponent message={error} onRetry={retry} />
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