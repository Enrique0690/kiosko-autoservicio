import React from 'react';
import { useDataContext } from '@/components/DataContext/datacontext';

const OrderButton = () => {
  const { sendOrderData, cart, clientData, observations } = useDataContext();

  const handleOrder = () => {
    const orderData = {
      items: cart,
      client: clientData,
      observations: observations,
    };
    sendOrderData(orderData);
  };

  return (
    <button onClick={handleOrder}>Enviar Pedido</button>
  );
};

export default OrderButton;