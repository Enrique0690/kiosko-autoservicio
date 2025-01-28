import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import ProductImage from './productimage';
import { Colors } from '@/constants/Colors';
import Typography from '../elements/Typography';

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
    const itemInCart = cart.find((item) => item.id === productId);
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
      <TouchableOpacity onPress={handlePress} style={styles.productButton}>
        {/* Imagen del producto */}
        <ProductImage descripcion={item.descripcion} style={styles.productImage} type="articulo" />
        
        {/* Contenedor de la descripción */}
        <View style={styles.descriptionContainer}>
          <Typography
            variant="body"
            color={Colors.text}
            t={item.descripcion}
          />
        </View>

        {/* Precio */}
        <Typography
          variant="body"
          color={Colors.primary}
          t={`$${item.pvp1.toFixed(2)}`}
        />

        {/* Cantidad en el carrito */}
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
  descriptionContainer: {
    width: '80%', // Igual ancho que la imagen
    height: 40, // Alto fijo para limitar la descripción
    justifyContent: 'flex-start', // Asegura que el texto comience desde arriba
    overflow: 'hidden', // Esconde el texto que se desborda
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
