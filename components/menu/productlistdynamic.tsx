import React from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import ProductImage from './productimage';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

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
            <ProductImage descripcion={item.descripcion} style={styles.productImage} baseUrl='https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/' />
            <Text style={styles.productName}>{item.descripcion}</Text>
            {type === 'extra' && <Text style={styles.productPrice}>${item.pvp1.toFixed(2)}</Text>}
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1, type)} style={[styles.quantityButton, {backgroundColor: Colors.primary}]} >
                <Ionicons name="remove-outline" size={30} color= {Colors.darkSecondary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {type === 'included' ? includedQuantities[item.id] || 0 : extraQuantities[item.id] || 0}
              </Text>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1, type)} style={[styles.quantityButton, {backgroundColor: Colors.secondary}]}>
                <Ionicons name="add-outline" size={30} color={Colors.darkPrimary} />
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
    width: 190, 
    height: 190,
    marginBottom: 10,
    borderRadius: 8,
    resizeMode: 'cover', 
  },
  productName: {
    fontSize: 18, 
    fontWeight: '600', 
    color: Colors.textsecondary, 
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 22, 
  },
  productPrice: {
    fontSize: 18, 
    fontWeight: '500', 
    color: Colors.textsecondary, 
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
    marginHorizontal: 12,
    borderRadius: 8, 
    elevation: 2, 
  },
  quantityButtonText: {
    fontSize: 24, 
    fontWeight: '500', 
  },
  quantityText: {
    fontSize: 20, 
    fontWeight: '600',
    color: Colors.textsecondary, 
  },
});

export default ProductListDynamic;