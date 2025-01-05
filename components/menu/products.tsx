import React from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDataContext } from "@/components/menu/datacontext";
import RenderProductItem from './renderproductitem';

interface Product {
  id: number;
  idLinea: number;
  descripcion: string;
  habilitado: boolean;
  existencia: number;
  pvp1: number;
  dinamicoLineas?: any[];
}
const NUM_COLUMNS = 3;

const Products = ({ categoryRefs }: { categoryRefs: React.RefObject<{ [key: number]: any }>;}) => {
  const { lines, products } = useDataContext();
  // Filtrar líneas habilitadas y productos habilitados
  const enabledLines = lines.filter((line) => line.usarEnVentas);
  const filteredProducts = products
    .filter((product) => product.habilitado)
    .filter((product) => enabledLines.some((line) => line.id === product.idLinea))
    .sort((a, b) => a.idLinea - b.idLinea || a.id - b.id);

  // Agrupar productos por línea
  const groupedProducts = enabledLines.map((line) => ({
    line,
    products: filteredProducts.filter((product) => product.idLinea === line.id),
  }));

  // Rellenar la última fila con elementos vacíos
  const fillLastRow = (data: Product[], columns: number) => {
    const fullRows = Math.floor(data.length / columns);
    const remainingItems = data.length - fullRows * columns;

    if (remainingItems > 0) {
      const emptyItems = Array.from({ length: columns - remainingItems }).map(() => ({
        id: Math.random(),
        empty: true,
      }));
      return [...data, ...emptyItems];
    }
    return data;
  };

  return (
    <FlatList
      data={groupedProducts}
      keyExtractor={(item) => item.line.id.toString()}
      renderItem={({ item }) => (
        <View ref={(ref) => (categoryRefs.current![item.line.id] = ref)}>
          <Text style={styles.categoryTitle}>{item.line.descripcion}</Text>
          <FlatList
            data={fillLastRow(item.products, NUM_COLUMNS)}
            renderItem={({ item }) => (
              <RenderProductItem item={item} />
            )}
            keyExtractor={(prod, index) => prod.id?.toString() || `empty-${index}`}
            numColumns={NUM_COLUMNS}
            contentContainerStyle={styles.grid}
          />
        </View>
      )}
      contentContainerStyle={styles.categoriesContainer}
    />
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    padding: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  grid: {
    width: '100%',
  },
  productContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    maxWidth: `${100 / NUM_COLUMNS}%`,
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  productText: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyItem: {
    backgroundColor: 'transparent',
  },
});

export default Products;