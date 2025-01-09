import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { updateOrderDetails } from '@/utils/updateOrderDetails';

const CashPaymentMethod = () => {
  const router = useRouter();
  const { total, clearCart, orderDetails, cart, clientData, setOrderDetails } = useDataContext();

  useEffect(() => {
    updateOrderDetails(setOrderDetails);
  }, []);

  const handleShowData = () => {
    console.log('Datos almacenados en el contexto:');
    console.log('Total:', total);
    console.log('Carrito:', cart);
    console.log('Detalles del pedido:', orderDetails);
    console.log('Datos del cliente:', clientData);
  };

  return (
    <View style={styles.container}>
      <Header rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />

      <View style={styles.body}>
        <TouchableOpacity style={styles.showDataButton} onPress={handleShowData}>
          <Text style={styles.showDataText}>Mostrar Datos</Text>
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
  body: {
    marginTop: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  showDataButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  showDataText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CashPaymentMethod;
