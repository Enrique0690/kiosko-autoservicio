import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useDataContext } from '@/components/contexts/useDataContext';
import RenderProductItem from './renderproductitem';
import { Colors } from '@/constants/Colors';

const NUM_COLUMNS = 3;
const { height: screenHeight } = Dimensions.get('window');

const Products = ({ selectedCategoryId }: { selectedCategoryId: number | null }) => {
  const { products } = useDataContext();
  const filteredProducts = products.filter((product) => product.habilitado && product.idLinea === selectedCategoryId);

  return (
    <View style={styles.container}>
      {selectedCategoryId ? (
        filteredProducts.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredProducts.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <RenderProductItem key={item.id} item={item as any} />
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noProductsText}>No hay productos en esta categoría.</Text>
        )
      ) : (
        <Text style={styles.noProductsText}>Selecciona una categoría para ver los productos.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    minHeight: screenHeight,
    paddingHorizontal: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', 
  },
  gridItem: {
    width: `${100 / NUM_COLUMNS}%`,
    padding: 5,
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 16,
    color: Colors.textsecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Products;