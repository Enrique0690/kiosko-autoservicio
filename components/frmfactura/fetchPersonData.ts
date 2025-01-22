import axios from 'axios';

export const fetchPersonData = async (idValue: string, id: 'Cedula' | 'Ruc' | 'Pasaporte') => {
  try {
    const response = await axios.get(
      `https://ec-s1.runfoodapp.com/apps/demo-digital-mind/api/v1/sri/person-public-data/?identificacion=${idValue}`
    );
    const data = response.data;

    if (data) {
      return {
        razonSocial: data.razonSocial || '',
        telefono: data.telefono || '',
        email: data.email || '',
        address: data.direccion || '',
        errorMessage: '',
      };
    } else {
      throw new Error('No encontrado');
    }
  } catch (error) {
    return {
      razonSocial: '',
      telefono: '',
      email: '',
      address: '',
      errorMessage: `No se pudo encontrar el número de ${id.toLowerCase()} proporcionado. Ingrese el resto de datos`,
    };
  }
};