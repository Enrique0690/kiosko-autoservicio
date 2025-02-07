import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ClientData } from './types';
import { useIdleTimer } from './IdleTimerContext';

interface ClientContextType {
    clientData: ClientData;
    setClientData: (data: ClientData) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
    const { resetTimer } = useIdleTimer();
    const [clientData, setClientData] = useState<ClientData>({
        identification: '',
        razonSocial: '',
        telefono: '',
        email: '',
        direccion: '',
        descripcion: '',
    });
    const handleSetClientData = useCallback((data: ClientData) => {
        setClientData(data);
        resetTimer(); 
      }, []);

    return (
        <ClientContext.Provider value={{ clientData, setClientData: handleSetClientData }}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClient = () => useContext(ClientContext)!;