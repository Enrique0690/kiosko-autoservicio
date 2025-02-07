import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductImage from '@/components/menu/productimage';
import { Colors } from '@/constants/Colors';
import CurrencySymbol from './CurrencySymbol';
import Typography from '../elements/Typography';
import QuantityControls from '../elements/QuantityControls';

interface CartItemProps {
  item: {
    id: number;
    descripcion: string;
    pvp1: number;
    cantidad: number;
    articulosDinamicos?: { descripcion: string, cantidad: number }[];
    image?: any;
  };
  onIncrement: (product: any) => void;
  onDecrement: (product: any) => void;
}

const CartItem = ({ item, onIncrement, onDecrement }: CartItemProps) => {
  return (
    <View style={styles.productItem}>
      <View style={styles.productImageContainer}>
        <ProductImage image={item.image} style={styles.productImage} />
      </View>
      <View style={styles.descriptionContainer}>
        <Typography variant='body' color={Colors.text} t={item.descripcion} />
        {item.articulosDinamicos && item.articulosDinamicos.length > 0 && (
          <View style={styles.dynamicItemsContainer}>
            {item.articulosDinamicos.map((articulo, index) => (
              <Typography
                key={index}
                variant='small'
                color={Colors.textsecondary}
                t={`• ${articulo.descripcion} x ${articulo.cantidad}`}
              />
            ))}
          </View>
        )}
      </View>
      <View style={styles.quantityContainer}>
        <QuantityControls
          quantity={item.cantidad}
          onIncrease={() => onIncrement(item)}
          onDecrease={() => onDecrement(item)}
        />
      </View>
      <View style={styles.priceContainer}>
        <Typography
          variant='body'
          color={Colors.textsecondary}
          t={`$${(item.cantidad * item.pvp1).toFixed(2)}`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  productImageContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
  descriptionContainer: {
    flex: 2,
    alignItems: 'flex-start',
  },
  dynamicItemsContainer: {
    marginTop: 5,
  },
  quantityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});

export default CartItem;
