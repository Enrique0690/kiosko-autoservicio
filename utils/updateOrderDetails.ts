import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Generar un código alfanumérico único
const generateUniqueCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

const formatDate = (date: string) => {
  const newDate = new Date(date);
  return newDate.toLocaleString();
};

// Obtener o reiniciar el número de pedido
const getOrderNumber = async (): Promise<number> => {
  const today = new Date().toISOString().split('T')[0]; 
  const storedData = await AsyncStorage.getItem('orderData');
  const orderData = storedData ? JSON.parse(storedData) : {};

  if (orderData.date === today) {
    orderData.orderNumber += 1;
  } else {
    orderData.date = today;
    orderData.orderNumber = 1;
  }

  await AsyncStorage.setItem('orderData', JSON.stringify(orderData));
  return orderData.orderNumber;
};

// Función principal para actualizar los detalles del pedido
export const updateOrderDetails = async (
  setOrderDetails: (details: any) => void
): Promise<void> => {
  const currentDate = formatDate(new Date().toISOString());
  const uniqueCode = generateUniqueCode();
  const orderNumber = await getOrderNumber();

  setOrderDetails((prevDetails: any) => ({
    ...prevDetails, 
    date: currentDate,
    orderNumber,
    uniqueCode,
  }));
};
