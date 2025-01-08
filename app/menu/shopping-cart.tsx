import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import ProductImage from '@/components/menu/productimage';

interface Product {
  id: number;
  descripcion: string;
  pvp1: number;
}

interface CartItem extends Product {
  cantidad: number;
}

const ShoppingCart = () => {
  const { cart, total, addToCart, removeFromCart, clearCart, totalItems, observations, setObservations } = useDataContext();
  const router = useRouter();

  const handleIncrement = (product: CartItem) => addToCart(product);

  const handleDecrement = (product: CartItem) => {
    if (product.cantidad <= 1) {
      removeFromCart(product.id);
    } else {
      const updatedProduct = { ...product, cantidad: product.cantidad - 1 };
      removeFromCart(product.id);
      addToCart(updatedProduct);
    }
  };

  const renderProductItem = ({ item }: { item: CartItem }) => (
    <View style={styles.productItem}>
      <ProductImage descripcion={item.descripcion} style={styles.productImage} />
      <Text style={[styles.productText, { flex: 2 }]}>{item.descripcion}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleDecrement(item)} style={styles.quantityButton}>
          <Ionicons name="remove-outline" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.productQuantity}>{item.cantidad}</Text>
        <TouchableOpacity onPress={() => handleIncrement(item)} style={styles.quantityButton}>
          <Ionicons name="add-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.productQuantity, { flex: 1, textAlign: 'right' }]}>${(item.cantidad * item.pvp1).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />

      {/* Carrito */}
      <View style={styles.cartHeader}>
        <Text style={styles.cartTitle}>Carrito</Text>
        <Text style={styles.cartDetails}>
          {totalItems} producto{totalItems > 1 ? 's' : ''} - Total: ${total.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        style={styles.cartList}
      />

      <View style={styles.observationsContainer}>
        <Text style={styles.observationsLabel}>Observaciones:</Text>
        <TextInput
          style={styles.observationsInput}
          placeholder="Escribe tus observaciones aquí..."
          value={observations}
          onChangeText={setObservations}
          multiline
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearButtonText}>Limpiar carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payButton} onPress={() => router.push('/pago')}>
          <Text style={styles.payButtonText}>Pagar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  totalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cartHeader: {
    marginTop: 10,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
  },
  cartDetails: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
    marginHorizontal: 15,
  },
  cartList: {
    marginBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 15,
  },
  productText: {
    fontSize: 14,
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 8,
    marginHorizontal: 10,
    backgroundColor: '#388E3C',
    borderRadius: 5,
  },
  productQuantity: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  clearButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#388E3C',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderRadius: 12,
    marginRight: 10,
    resizeMode: 'cover',
  },
  observationsContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  observationsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  observationsInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
  },
});

export default ShoppingCart;