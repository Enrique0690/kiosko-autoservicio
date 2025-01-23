import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from "@/components/DataContext/datacontext";
import ProductImage from './productimage';
import CurrencySymbol from './CurrencySymbol';
import { Colors } from '@/constants/Colors';

export interface Product {
  id: number;
  idLinea: number;
  descripcion: string;
  habilitado: boolean;
  existencia: number;
  pvp1: number;
  dinamicoLineas?: any[];
}
function RenderProductItem({ item }: { item: Product }) {
  const router = useRouter();
  const { addToCart, cart } = useDataContext();

  if ('empty' in item) {
    return <View style={[styles.productContainer, styles.emptyItem]} />;
  }

  const getItemQuantity = (productId: number) => {
    const itemInCart = cart.find(item => item.id === productId);
    return itemInCart ? itemInCart.cantidad : 0;
  };

  const handlePress = () => {
    if (item.dinamicoLineas && Array.isArray(item.dinamicoLineas) && item.dinamicoLineas.length > 0) {
      router.replace(`/menu/${item.id}`);
    } else {
      addToCart(item);
    }
  };

  const quantity = getItemQuantity(item.id);

  return (
    <View style={styles.productContainer}>
      <TouchableOpacity onPress={handlePress} style={styles.productButton}       >
        <ProductImage descripcion={item.descripcion} style={styles.productImage} type='articulo' />
        <Text style={styles.productName}>{item.descripcion}</Text>
        <Text style={styles.productPrice}><CurrencySymbol />{(item.pvp1).toFixed(2)}</Text>
        {quantity > 0 && (
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>{quantity}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 15,
    position: 'relative',
  },
  productButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '80%',
    height: 180,
    marginBottom: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4CAF50',
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
