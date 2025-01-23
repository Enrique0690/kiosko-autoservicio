import axios from 'axios';
import { getConfig } from '@/utils/getconfig';

const createApiService = async () => {
  const config = await getConfig();

  const fetchLines = async () => {
    try {
      const response = await axios.get(`${config.runfoodserviceUrl}/LOCAL_NETWORK/LINEA/FETCH`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar Categorías');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.runfoodserviceUrl}/LOCAL_NETWORK/ARTICULO/FETCH`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar productos');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.runfoodserviceUrl}/LOCAL_NETWORK/USUARIO/FETCH`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar usuarios');
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${config.runfoodserviceUrl}/LOCAL_NETWORK/CONFIGURACION/Fetch`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar configuración');
    }
  };

  const sendOrder = async (orderData: any) => {
    try {
      const response = await axios.post(`${config.runfoodserviceUrl}/LOCAL_NETWORK/PEDIDO/Insert`, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al enviar el pedido');
    }
  };

  return { fetchLines, fetchProducts, fetchUsers, fetchSettings, sendOrder };
};

export default createApiService;
