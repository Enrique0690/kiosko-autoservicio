import React from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import ProductImage from './productimage'; // Asegúrate de importar correctamente el componente ProductImage

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
      horizontal
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
    borderRadius: 12, 
    paddingVertical: 15,
    elevation: 4,
    position: 'relative', 
  },
  productButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 110, 
    height: 110,
    marginBottom: 10,
    borderRadius: 12,
    resizeMode: 'cover', 
  },
  productName: {
    fontSize: 16, 
    fontWeight: '500', 
    color: '#333', 
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14, 
    fontWeight: '500', 
    color: '#4CAF50', 
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#388E3C',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProductListDynamic;
