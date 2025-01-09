import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDataContext } from '@/components/DataContext/datacontext';
import RenderProductItem from './renderproductitem';

const NUM_COLUMNS = 3;

const Products = ({ selectedCategoryId, ProdutDinamic }: { selectedCategoryId: number | null, ProdutDinamic?: boolean }) => {
  const { products } = useDataContext();
  const filteredProducts = products.filter(
    (product) => product.habilitado && product.idLinea === selectedCategoryId
  );
  
  const chunkArray = (data: any[], numColumns: number) => {
    const result = [];
    for (let i = 0; i < data.length; i += numColumns) {
      result.push(data.slice(i, i + numColumns));
    }
    return result;
  };

  const productRows = chunkArray(filteredProducts, NUM_COLUMNS);

  return (
    <View style={styles.container}>
      {selectedCategoryId && filteredProducts.length > 0 ? (
        productRows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((item) => (
                <RenderProductItem key={item.id} item={item} />
            ))}
            {row.length < NUM_COLUMNS &&
              [...Array(NUM_COLUMNS - row.length)].map((_, index) => (
                <View key={`empty-${index}`} style={[styles.itemContainer, styles.emptyItem]} />
              ))}
          </View>
        ))
      ) : (
        <Text style={styles.noProductsText}>
          {selectedCategoryId
            ? 'No hay productos en esta categoría.'
            : 'Selecciona una categoría para ver los productos.'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noProductsText: {
    fontSize: 16,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 20,
  },
  itemContainer: {
    flex: 1,
    aspectRatio: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    elevation: 4,
  },
  emptyItem: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});

export default Products;