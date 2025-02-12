import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/contexts/useDataContext';
import Header from '@/components/header';
import { Colors } from '@/constants/Colors';
import CartItem from '@/components/menu/CarItem';
import AlertModal from '@/components/elements/AlertModal';
import PayButton from '@/components/elements/PayButton';
import Typography from '@/components/elements/Typography';

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
  const { cart, total, addToCart, removeFromCart, totalItems, setOrderDetails } = useDataContext();
  const router = useRouter();
  const [observations, setObservations] = useState('');
  const inputRef = useRef<TextInput>(null);
  const handleIncrement = (product: CartItem) => addToCart(product, 1);
  const [inputHeight, setInputHeight] = useState(40);

  const handleContentSizeChange = (e: any) => {
    const { height } = e.nativeEvent.contentSize;
    setInputHeight(Math.min(height, 250));
  };

  const handleDecrement = (product: CartItem) => {
    if (product.cantidad <= 1) {
      removeFromCart(product.id);
    } else {
      addToCart(product, -1); 
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
        leftButtonText='Regresar'
        leftButtonRoute={'/menu'}
        centerText='Confirma tu pedido'
        rightButtonIcon={'arrow-forward-outline'}
        rightButtonRoute={'/pago'}
        rightButtonText={'Pagar'}
      />
      <ScrollView>
        <View style={styles.cartContainer}>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} onIncrement={handleIncrement} onDecrement={handleDecrement} />
          ))}
        </View>
        <View style={styles.totalContainer}>
        <Typography variant='body' color={Colors.text} t={`${totalItems} producto${totalItems > 1 ? 's' : ''} - Total: $${total.toFixed(2)}`} />
      </View>
      </ScrollView>
      <TouchableOpacity onPress={handleFocusInput}>
          <TextInput
            ref={inputRef}
            placeholder="Escribe tus observaciones aquí..."
            value={observations}
            onChangeText={setObservations}
            style={[styles.observationsInput]}
            multiline
            onContentSizeChange={handleContentSizeChange}
          />
        </TouchableOpacity>
        <View style={styles.footer}>
        <PayButton onPress={handlePay} text={`Pagar $${total.toFixed(2)}`} />
      </View>
      <AlertModal visible={totalItems === 0} message="No hay elementos en el carrito" onClose={() => router.replace('/menu')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartDetails: {
    fontSize: 20,
    color: Colors.darkGray,
    marginTop: 5,
    marginHorizontal: 15,
    textAlign: 'right',
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
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  payButtonText: {
    color: Colors.secondary,
    fontSize: 30,
    fontWeight: 'bold',
  },
  observationsContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },
  observationsLabel: {
    fontSize: 30,
    color: '#333',
  },
  observationsInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    height: 125,
    textAlignVertical: 'top',
    fontSize: 25,
  },
  cartDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 20,
  }
});

export default ShoppingCart;
