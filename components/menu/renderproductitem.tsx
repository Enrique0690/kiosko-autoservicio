import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import ProductImage from './productimage';
import { Colors } from '@/constants/Colors';
import Typography from '../elements/Typography';
import ProductModal from './ProductModal';
import ProductModalDynamic from './ProductModalDynamic';

export interface Product {
  id: number;
  idLinea: number;
  descripcion: string;
  habilitado: boolean;
  existencia: number;
  pvp1: number;
  dinamicoLineas?: any[];
}

const RenderProductItem = React.memo(({ item }: { item: Product }) => {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDynamicModalVisible, setDynamicModalVisible] = useState(false);
  const { addToCart, cart } = useDataContext();

  const getItemQuantity = (productId: number) => {
    const itemInCart = cart.find((item) => item.id === productId);
    return itemInCart ? itemInCart.cantidad : 0;
  };

  const handlePress = useCallback(() => {
    if (item.dinamicoLineas && Array.isArray(item.dinamicoLineas) && item.dinamicoLineas.length > 0) {
      setDynamicModalVisible(true);
    } else {
      setModalVisible(true);
    }
  }, [item]);

  const quantity = getItemQuantity(item.id);

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeDynamicModal = () => {
    setDynamicModalVisible(false);
  };

  return (
    <View style={styles.productContainer}>
      <TouchableOpacity onPress={handlePress} style={styles.productButton}>
        <ProductImage descripcion={item.descripcion} style={styles.productImage} type="articulo" />
        <View style={styles.descriptionContainer}>
          <Typography variant="body" color={Colors.text} t={item.descripcion} />
        </View>
        <Typography variant="body" color={Colors.primary} t={`$${item.pvp1.toFixed(2)}`} />
        {quantity > 0 && (
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>{quantity}</Text>
          </View>
        )}
      </TouchableOpacity>

      {isModalVisible && (
        <ProductModal
          visible={isModalVisible}
          onClose={closeModal}
          item={item}
        />
      )}

      {isDynamicModalVisible && (
        <ProductModalDynamic
          visible={isDynamicModalVisible}
          onClose={closeDynamicModal}
          item={item}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  productContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 8,
    elevation: 8,
    backgroundColor: '#fff',
    width: 250,
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  productButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  descriptionContainer: {
    width: '80%',
    height: 50,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  emptyItem: {
    backgroundColor: 'transparent',
  },
  quantityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 2,
    elevation: 2,
  },
  quantityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default RenderProductItem;
