import axios from 'axios';

const fetchLines = async () => {
  try {
    const response = await axios.get('https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/LOCAL_NETWORK/LINEA/FETCH');
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar Categorias');
  }
};

const fetchProducts = async () => {
  try {
    const response = await axios.get('https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/LOCAL_NETWORK/ARTICULO/FETCH');
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar productos');
  }
};

const fetchUsers = async () => {
  try {
    const response = await axios.get('https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/LOCAL_NETWORK/USUARIO/FETCH');
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar usuarios');
  }
}

const fetchSettings = async () => {
  try {
    const response = await axios.get('https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/LOCAL_NETWORK/CONFIGURACION/Fetch');
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar configuración');
  }
}

const sendOrder = async (orderData: any) => {
  try {
    const response = await axios.post('https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/LOCAL_NETWORK/PEDIDO/Insert', orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al enviar el pedido');
  }
};

export { fetchLines, fetchProducts, fetchUsers, sendOrder, fetchSettings };