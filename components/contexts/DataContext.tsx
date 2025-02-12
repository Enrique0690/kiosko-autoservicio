import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import createApiService from '../DataContext/api';
import { Product } from './types';

interface DataContextType {
  lines: any[];
  products: Product[];
  users: any[];
  settings: any[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const placeholder = require('../../assets/images/placeholder/products.webp');

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageCacheRef = useRef<Record<string, string>>({});

  const fetchImage = async (name: string, isLine: boolean = false): Promise<string | null> => {
    const baseUrl = isLine
      ? 'https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/Lineas'
      : 'https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos';
  
    const encodedName = encodeURIComponent(name);
    const cacheKey = isLine ? `line-${name}` : name;
    if (imageCacheRef.current[cacheKey]) return imageCacheRef.current[cacheKey];
  
    for (const ext of ['jpg', 'png']) {
      const imageUrl = `${baseUrl}/${encodedName}.${ext}`;
      try {
        const response = await fetch(imageUrl);
        if (
          response.ok &&
          response.headers.get('content-type')?.startsWith('image/')
        ) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob); 
          imageCacheRef.current[cacheKey] = imageUrl;
          return imageUrl;
        }
      } catch (error) {
      }
    }
    return placeholder;
  };  

  const fetchImagesWithConcurrencyLimit = async (items: any[], isLine: boolean = false, concurrencyLimit: number = 20) => {
    const results = [...items];
    let index = 0;
  
    const worker = async () => {
      while (index < items.length) {
        const currentIndex = index;
        index++;
        const item = items[currentIndex];
        const imageUrl = await fetchImage(item.descripcion, isLine);  
        results[currentIndex] = { ...item, image: imageUrl };  
      }
    };
  
    const workers = [];
    const workerCount = Math.min(concurrencyLimit, items.length);
    for (let i = 0; i < workerCount; i++) {
      workers.push(worker());
    }
    await Promise.all(workers);
    return results;
  };  

  const fetchData = async () => {
    const apiService = await createApiService();
    try {
      const [fetchedLines, fetchedProducts, fetchedUsers, fetchedSettings] = await Promise.all([
        apiService.fetchLines(),
        apiService.fetchProducts(),
        apiService.fetchUsers(),
        apiService.fetchSettings(),
      ]);

      const porcentajeIVA = fetchedSettings.porcentajeIVA / 100;
      const enabledLines = fetchedLines.filter((line: any) => line.usarEnVentas);
      const enabledProducts = fetchedProducts.filter((product: Product) =>
        product.habilitado &&
        enabledLines.some((line: any) => line.id === product.idLinea)
      );
      const initialProducts = enabledProducts.map((product: any) => ({
        ...product,
        pvp1: product.pagaIva ? product.pvp1 * (1 + porcentajeIVA) : product.pvp1,
        image: null,
      }));
      const initialLines = enabledLines.map((line: any) => ({
        ...line,
        image: null,
      }));
      const processedProducts = await fetchImagesWithConcurrencyLimit(initialProducts, false, 20);
      const processedLines = await fetchImagesWithConcurrencyLimit(initialLines, true, 20);
      setProducts(processedProducts);
      setLines(processedLines);
      setUsers(fetchedUsers);
      setSettings(fetchedSettings);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error cargando datos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.text}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <DataContext.Provider
      value={{ lines, products, users, settings, loading, error, retry: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext)!;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});