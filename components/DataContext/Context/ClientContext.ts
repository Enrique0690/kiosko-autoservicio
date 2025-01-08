import { useState } from 'react';

export interface ClientData {
  identification: string;
  razonSocial: string;
  telefono?: string;
  email?: string;
}

export const useClient = () => {
  const [clientData, setClientData] = useState<ClientData>({
    identification: '',
    razonSocial: '',
    telefono: '',
    email: '',
  });

  return { clientData, setClientData };
};