import React, { createContext, useContext, useState, ReactNode } from 'react';
import createApiService from '../DataContext/api';

interface OrderContextType {
  orderDetails: any;
  setOrderDetails: (details: any) => void;
  sendOrderData: (orderData: any) => Promise<void>;
  isInvoiceRequested: boolean;
  setIsInvoiceRequested: (value: boolean) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderDetails, setOrderDetails] = useState<any>({});
  const [isInvoiceRequested, setIsInvoiceRequested] = useState(false);

  const sendOrderData = async (orderData: any) => {
    const api = await createApiService();
    return api.sendOrder(orderData);
  };

  return (
    <OrderContext.Provider value={{ orderDetails, setOrderDetails, sendOrderData, isInvoiceRequested, setIsInvoiceRequested }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext)!;