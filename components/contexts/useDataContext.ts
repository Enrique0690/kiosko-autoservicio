import { useData } from './DataContext';
import { useCart } from './CartContext';
import { useClient } from './ClientContext';
import { useOrder } from './OrderContext';
import { useIdleTimer } from './IdleTimerContext';
import { useConfig } from './ConfigProvider';

export const useDataContext = () => {
  const data = useData();
  const cart = useCart();
  const client = useClient();
  const order = useOrder();
  const idleTimer = useIdleTimer();
  const config = useConfig();
  return {
    ...data,
    ...cart,
    ...client,
    ...order,
    ...idleTimer,
    ...config
  };
};
