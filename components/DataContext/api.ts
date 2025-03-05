import axios from 'axios';
import { getConfig } from '@/utils/getconfig';
import { useConfig } from '../contexts';

const createApiService = async () => {
  const config = await getConfig();
  //const { config } = useConfig();
  //const baseUrl = config!.runfoodserviceUrl;
  const baseUrl = config.runfoodserviceUrl;
  //const baseUrl = 'https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1';

  const fetchLines = async () => {
    try {
      console.log('la url es ', baseUrl);
      const response = await axios.get(`${baseUrl}/LOCAL_NETWORK/LINEA/FETCH`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar Categorías');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/LOCAL_NETWORK/ARTICULO/FETCH`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar productos');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/LOCAL_NETWORK/USUARIO/FETCH`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar usuarios');
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${baseUrl}/LOCAL_NETWORK/CONFIGURACION/Fetch`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar configuración');
    }
  };

  const sendOrder = async (orderData: any) => {
    try {
      const response = await axios.post(`${baseUrl}/LOCAL_NETWORK/PEDIDO/Insert`, orderData, {
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
