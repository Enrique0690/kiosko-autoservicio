import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export interface Product {
  id: number;
  idLinea: number;
  descripcion: string;
  habilitado: boolean;
  existencia: number;
  pvp1: number;
  dinamicoLineas?: any[];
}

interface RenderItemProps {
  item: Product | { empty: boolean };
  onProductSelect: (product: Product) => void;
}

function RenderProductItem({ item, onProductSelect }: RenderItemProps) {
  const router = useRouter();

  if ('empty' in item) {
    return <View style={[styles.productContainer, styles.emptyItem]} />;
  }

  const handlePress = () => {
    if (item.dinamicoLineas && Array.isArray(item.dinamicoLineas) && item.dinamicoLineas.length > 0) {
      router.push(`/menu/${item.id}`);
    } else {
      onProductSelect(item);
    }
  };

  return (
    <View style={styles.productContainer}>
      <TouchableOpacity onPress={handlePress}>
        <Image
          source={require('../../assets/images/placeholder/products.webp')}
          style={styles.productImage}
        />
        <Text style={styles.productText}>{item.descripcion}</Text>
        <Text style={styles.productText}>${item.pvp1.toFixed(2)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
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

export default RenderProductItem;
