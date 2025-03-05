import { DataProvider, useData } from './DataContext';
import { CartProvider, useCart } from './CartContext';
import { ClientProvider, useClient } from './ClientContext';
import { OrderProvider, useOrder } from './OrderContext';
import { IdleTimerProvider, useIdleTimer } from './IdleTimerContext';
import { ConfigProvider, useConfig } from './ConfigProvider';

export {
  useData,
  useCart,
  useClient,
  useOrder,
  useIdleTimer,
  useConfig
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider>
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
  </ConfigProvider>
);