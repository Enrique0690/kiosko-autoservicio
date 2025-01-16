import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { Colors } from '@/constants/Colors';
import CartItem from '@/components/menu/CarItem';
import AlertModal from '@/components/elements/AlertModal';

interface Product {
  id: number;
  descripcion: string;
  pvp1: number;
}

interface CartItem extends Product {
  cantidad: number;
  articulosDinamicos?: any[];
}

const ShoppingCart = () => {
  const { cart, total, addToCart, removeFromCart, clearCart, totalItems, setOrderDetails } = useDataContext();
  const router = useRouter();
  const [observations, setObservations] = useState('');
  const inputRef = useRef<TextInput>(null); 
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

  const handlePay = () => {
    setOrderDetails((prevDetails: any) => ({
      ...prevDetails,
      Observaciones: observations,
    }));
    router.replace('/pago');
  };

  const handleFocusInput = () => {
    if (inputRef.current) {
    }
  };

  return (
    <View style={styles.container}>
      <Header
        leftButtonText="Volver"
        leftButtonRoute={'/menu'}
        rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />

      <View style={styles.cartHeader}>
        <Text style={styles.cartTitle}>Carrito</Text>
      </View>
      <ScrollView>
        <View style={styles.cartContainer}>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} onIncrement={handleIncrement} onDecrement={handleDecrement} />
          ))}
        </View>

        <View style={styles.cartDetailsContainer}>
          <Text style={styles.cartDetails}>
            {totalItems} producto{totalItems > 1 ? 's' : ''} - Total: ${total.toFixed(2)}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.observationsContainer}>
          <Text style={styles.observationsLabel}>Observaciones:</Text>
          <TouchableOpacity onPress={handleFocusInput}>
            <TextInput
              ref={inputRef}
              style={styles.observationsInput}
              placeholder="Escribe tus observaciones aquí..."
              value={observations}
              onChangeText={setObservations}
              multiline
            />
          </TouchableOpacity>
        </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pagar</Text>
        </TouchableOpacity>
      </View>

      <AlertModal visible={totalItems === 0} message="No hay elementos en el carrito" onClose={() => router.replace('/menu')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  totalText: {
    color: Colors.text,
    fontSize: 23,
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
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
  },
  cartDetails: {
    fontSize: 18,
    color: '#777',
    marginTop: 5,
    marginHorizontal: 15,
  },
  cartContainer: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  payButton: {
    backgroundColor: Colors.secondary,
    padding: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  payButtonText: {
    color: Colors.primary,
    fontSize: 23,
    fontWeight: 'bold',
  },
  observationsContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  observationsLabel: {
    fontSize: 23,
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
    fontSize: 18,
  },
  cartDetailsContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    width: '100%', 
    paddingHorizontal: 15,
    marginBottom: 20, 
  }
});

export default ShoppingCart;
