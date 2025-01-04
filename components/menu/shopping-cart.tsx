import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CartProps {
  items: { id: number; descripcion: string; cantidad: number }[];
  total: number;
  onPay: () => void;
}

const ShoppingCart = ({ items, total, onPay }: CartProps) => {
  return (
    items.length > 0 && (
      <View style={styles.cartContainer}>
        <View style={styles.cartContent}>
          <Text style={styles.cartText}>
            {items.length} producto{items.length > 1 ? 's' : ''} seleccionado{items.length > 1 ? 's' : ''} - Total: ${total.toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.payButton} onPress={onPay}>
            <Text style={styles.payButtonText}>Pagar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
    elevation: 5, // Agregar sombra en dispositivos Android
    zIndex: 999, // Asegura que el carrito se muestre por encima de otros elementos
  },
  cartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ShoppingCart;