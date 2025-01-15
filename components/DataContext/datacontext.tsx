import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { fetchLines, fetchProducts, fetchUsers, sendOrder } from './api';
import { LoadingComponent, ErrorComponent } from './chargingstatus';
import ArticuloWithCalcs from './ArticuloWithCals';

interface Product {
  id: number;
  idLinea?: number;
  codigo?: string;
  descripcion: string;
  habilitado?: boolean;
  existencia?: number;
  pvp1: number;
  dinamicoLineas?: any[];
  articulosDinamicos?: any[];
}

interface CartItem extends Product {
  cantidad: number;
  rowNumber: number;
}

interface ClientData {
  identification: string;
  razonSocial: string;
  telefono?: string;
  email?: string;
  address?: string;
}

interface DataContextType {
  lines: any[];
  products: Product[];
  users: any[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
  retry: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  idleTimeLeft: number;
  isInvoiceRequested: boolean;
  setIsInvoiceRequested: (value: boolean) => void;
  clientData: ClientData;
  setClientData: (data: ClientData) => void;
  sendOrderData: (orderData: any) => Promise<void>;
  orderDetails: any;
  setOrderDetails: (details: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idleTimeLeft, setIdleTimeLeft] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [redirected, setRedirected] = useState(false);
  const [isInvoiceRequested, setIsInvoiceRequested] = useState<boolean>(false);
  const [clientData, setClientData] = useState<ClientData>({
    identification: '',
    razonSocial: '',
    telefono: '',
    email: '',
    address: '',
  });
  const [orderDetails, setOrderDetails] = useState<any>({});
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedLines = await fetchLines();
      const fetchedProducts = await fetchProducts();
      const fetchedUsers = await fetchUsers();
      setLines(fetchedLines);
      setProducts(fetchedProducts);
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Hubo un error al cargar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const sendOrderData = async (orderData: any) => {
    try {
      await sendOrder(orderData);  
      router.push('/pago/completed');  
    } catch (err) {
      console.error('Error al enviar los datos del pedido:', err);
    } finally {
    }
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
  
      if (existingProductIndex > -1) {
        return prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      const newRowNumber = prevCart.length + 1; 
      return [
        ...prevCart,
        { ...product, cantidad: 1, rowNumber: newRowNumber }, 
      ];
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
    stopTimer(); 
    setIdleTimeLeft(0);
    const interval = setInterval(() => {
      setIdleTimeLeft((prev) => {
        if (prev >= 300) { 
          clearCart();
          router.push('/'); 
          stopTimer();
          return 300; 
        }
        return prev + 1; 
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
    setIdleTimeLeft(0); 
    startTimer();
  };  
  
  useEffect(() => {
    fetchData();
    stopTimer();
  }, []);

  const contextValue = {
    lines,
    products,
    users,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    total,
    totalItems,
    loading,
    error,
    retry,
    startTimer,
    stopTimer,
    resetTimer,
    idleTimeLeft,
    isInvoiceRequested,
    setIsInvoiceRequested,
    clientData,
    setClientData,
    sendOrderData,
    orderDetails, 
    setOrderDetails,
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