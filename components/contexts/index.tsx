import { DataProvider, useData } from './DataContext';
import { CartProvider, useCart } from './CartContext';
import { ClientProvider, useClient } from './ClientContext';
import { OrderProvider, useOrder } from './OrderContext';
import { IdleTimerProvider, useIdleTimer } from './IdleTimerContext';

export {
  useData,
  useCart,
  useClient,
  useOrder,
  useIdleTimer
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <DataProvider>
    <IdleTimerProvider>
      <CartProvider>
        <ClientProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </ClientProvider>
      </CartProvider>
    </IdleTimerProvider>
  </DataProvider>
);