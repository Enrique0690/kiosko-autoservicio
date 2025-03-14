import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import createApiService from './api';
import { LoadingComponent, ErrorComponent } from './chargingstatus';

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
  dinamico?: boolean;
  pvpSeleccionado?: string;
  pagaIva?: boolean;
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
  settings: any[];
  cart: CartItem[];
  addToCart: (product: Product, cantidad: number) => void; 
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
  setClientData: (data: any) => void;
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
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idleTimeLeft, setIdleTimeLeft] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
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
    const apiService = await createApiService();
    setLoading(true);
    setError(null);
    try {
      const fetchedLines = await apiService.fetchLines();
      let fetchedProducts = await apiService.fetchProducts();
      const fetchedUsers = await apiService.fetchUsers();
      const fetchedSettings = await apiService.fetchSettings();
      const porcentajeIVA = fetchedSettings.porcentajeIVA / 100;
      fetchedProducts = fetchedProducts.map((product: Product) => ({
        ...product,
        pvp1: product.pagaIva ? product.pvp1 * (1 + porcentajeIVA) : product.pvp1,
      }));
      setLines(fetchedLines);
      setProducts(fetchedProducts);
      setUsers(fetchedUsers);
      setSettings(fetchedSettings);
    } catch (err) {
      setError('Hubo un error al cargar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const sendOrderData = async (orderData: any) => {
    const apiService = await createApiService();
    try {
      const response = await apiService.sendOrder(orderData);
      console.log('Respuesta del servidor data:', response);  
      return response.data || response; 
    } catch (err) {
      console.error('Error al enviar los datos del pedido:', err);
      throw err;
    }
  };
  
  const addToCart = (product: Product, cantidad: number) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingProductIndex > -1) {
        return prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, cantidad: item.cantidad + cantidad } // Suma la cantidad seleccionada
            : item
        );
      }
      const newRowNumber = prevCart.length + 1; 
      return [
        ...prevCart,
        { ...product, cantidad, rowNumber: newRowNumber }, // Usa la cantidad proporcionada
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
  };
  const total = cart.reduce((acc, item) => acc + item.cantidad * item.pvp1, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const retry = () => {
    fetchData();
  };

  const startTimer = () => {
    if (timer) {
      clearInterval(timer);
    }

    const interval = setInterval(() => {
      setIdleTimeLeft((prev) => {
        if (prev >= 1800) {
          clearInterval(interval);
          clearCart();
          router.replace('/'); 
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    setTimer(interval);
  };
  
  const stopTimer = () => {
    if (timer) clearInterval(timer);
  };
  
  const resetTimer = () => {
    setIdleTimeLeft(0); 
    startTimer();
  };  
  
  useEffect(() => {
    fetchData();
  }, []);

  const contextValue = {
    lines,
    products,
    users,
    settings,
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