import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductImage from '@/components/menu/productimage';
import { Colors } from '@/constants/Colors';

interface CartItemProps {
  item: {
    id: number;
    descripcion: string;
    pvp1: number;
    cantidad: number;
    articulosDinamicos?: { descripcion: string, cantidad: number }[];
  };
  onIncrement: (product: any) => void;
  onDecrement: (product: any) => void;
}

const CartItem = ({ item, onIncrement, onDecrement }: CartItemProps) => {
  return (
    <View style={styles.productItem}>
      <ProductImage
        descripcion={item.descripcion}
        style={styles.productImage}
        baseUrl="https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/"
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.productText}>{item.descripcion}</Text>
        {item.articulosDinamicos && item.articulosDinamicos.length > 0 && (
          <View style={styles.dynamicItemsContainer}>
            {item.articulosDinamicos.map((articulo, index) => (
              <Text key={index} style={styles.dynamicItemText}>• {articulo.descripcion} x {articulo.cantidad}</Text>
            ))}
          </View>
        )}
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => onDecrement(item)} style={[styles.quantityButton, { backgroundColor: Colors.primary }]}>
          <Ionicons name="remove-outline" size={30} color={Colors.darkSecondary} />
        </TouchableOpacity>
        <Text style={styles.productQuantity}>{item.cantidad}</Text>
        <TouchableOpacity onPress={() => onIncrement(item)} style={[styles.quantityButton, { backgroundColor: Colors.secondary }]}>
          <Ionicons name="add-outline" size={30} color={Colors.darkPrimary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.productPrice}>${(item.cantidad * item.pvp1).toFixed(2)}</Text>
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
  descriptionContainer: {
    flex: 3,
    marginLeft: 15,
  },
  productText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
  },
  dynamicItemsContainer: {
    marginTop: 5,
  },
  dynamicItemText: {
    fontSize: 14,
    color: Colors.textsecondary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
  },
  productQuantity: {
    fontSize: 18,
    color: Colors.text,
    marginHorizontal: 10,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 18,
    color: Colors.textsecondary,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: 'cover',
  },
});

export default CartItem;
