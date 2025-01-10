import React from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import ProductImage from './productimage';

const ProductListDynamic = ({
  lineInfo,
  type,
  includedQuantities,
  extraQuantities,
  handleQuantityChange
}: any) => {
  return (
    <FlatList
      data={lineInfo.products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={4}
      renderItem={({ item }) => (
        <View style={styles.productContainer}>
          <TouchableOpacity 
            onPress={() => handleQuantityChange(item.id, 1, type)} 
            style={styles.productButton}
          >
            <ProductImage descripcion={item.descripcion} style={styles.productImage} />
            <Text style={styles.productName}>{item.descripcion}</Text>
            {type === 'extra' && <Text style={styles.productPrice}>${item.pvp1.toFixed(2)}</Text>}
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                onPress={() => handleQuantityChange(item.id, -1, type)} 
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {type === 'included' ? includedQuantities[item.id] || 0 : extraQuantities[item.id] || 0}
              </Text>
              <TouchableOpacity 
                onPress={() => handleQuantityChange(item.id, 1, type)} 
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    borderRadius: 16, 
    paddingVertical: 20,
    elevation: 8, 
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    position: 'relative',
    maxWidth: '23%', 
    overflow: 'hidden',
  },
  productButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12, 
    overflow: 'hidden', 
  },
  productImage: {
    width: 120, 
    height: 120,
    marginBottom: 12,
    borderRadius: 12, 
    resizeMode: 'cover', 
  },
  productName: {
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 22, 
  },
  productPrice: {
    fontSize: 16, 
    fontWeight: '500', 
    color: '#4CAF50', 
    marginTop: 5,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#388E3C', 
    marginHorizontal: 12,
    borderRadius: 8, 
    elevation: 2, 
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 22, 
    fontWeight: '700', 
  },
  quantityText: {
    fontSize: 20, 
    fontWeight: '600',
    color: '#333', 
  },
});

export default ProductListDynamic;