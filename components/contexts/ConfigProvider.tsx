import React, { createContext, useContext, useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import { updateColors } from '@/constants/Colors';

interface Config {
  caruselDirUrl: string;
  LineaDirUrl: string;
  ProductDirUrl: string;
  runfoodserviceUrl: string;
  Authorization: string;
  userID: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    textsecondary: string;
  };
}

interface ConfigContextType {
  config: Config | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await window.electronAPI.getConfig();
        setConfig(configData);
        if (configData.colors) {
          updateColors(configData.colors); 
        }
      } catch (error) {
        console.error('Error obteniendo la configuración:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return <LoadingScreen />; 
  }

  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext)!;