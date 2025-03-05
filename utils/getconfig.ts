let configCache: any = null;

export const getConfig = async () => {
  if (configCache) {
    return configCache;
  }

  try {
    const config = await window.electronAPI.getConfig();
    configCache = config;
    return config;

  } catch (error) {
    console.error('Error al obtener la configuración de Electron:', error);
    throw new Error('No se pudo obtener la configuración de Electron');
  }
};