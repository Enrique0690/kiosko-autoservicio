import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ApiService from './services';
import { Product } from './types';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

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

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const apiService = await ApiService();
    try {
      const [fetchedLines, fetchedProducts, fetchedUsers, fetchedSettings] = await Promise.all([
        apiService.fetchLines(),
        apiService.fetchProducts(),
        apiService.fetchUsers(),
        apiService.fetchSettings()
      ]);

      const porcentajeIVA = fetchedSettings.porcentajeIVA / 100;
      const processedProducts = fetchedProducts.map((product: Product) => ({
        ...product,
        pvp1: product.pagaIva ? product.pvp1 * (1 + porcentajeIVA) : product.pvp1,
      }));

      setLines(fetchedLines);
      setProducts(processedProducts);
      setUsers(fetchedUsers);
      setSettings(fetchedSettings);
    } catch (err) {
      setError('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.text}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <DataContext.Provider value={{ lines, products, users, settings, loading, error, retry: fetchData }}>
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
