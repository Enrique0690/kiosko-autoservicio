import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { updateOrderDetails } from '@/utils/updateOrderDetails';
import QRCode from 'react-native-qrcode-svg';

const deunaMethod = () => {
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

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleString(); 
  };

  return (
    <View style={styles.container}>
      <Header rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />

      <View style={styles.body}>
        <TouchableOpacity style={styles.showDataButton} onPress={handleShowData}>
          <Text style={styles.showDataText}>Mostrar Datos</Text>
        </TouchableOpacity>

        <View style={styles.orderDetailsContainer}>
          <Text style={styles.orderInfoText}>---------------------------------------</Text>
          <Text style={styles.orderInfoText}>Fecha: {orderDetails.date ? formatDate(orderDetails.date) : 'No disponible'}</Text>
          <Text style={styles.orderInfoText}>Número de pedido: {orderDetails.orderNumber}</Text>
          <QRCode value={orderDetails.uniqueCode || 'No disponible'} size={150} />
          <Text style={styles.orderInfoText}>Identificador: {orderDetails.uniqueCode}</Text>
          <Text style={styles.orderInfoText}>---------------------------------------</Text>
          <Text style={styles.orderInfoText}>Metodo de pago</Text>
          <Text style={styles.pendingText}>PENDIENTE DE PAGO (Deuna)</Text>
          <Text style={styles.orderInfoText}>---------------------------------------</Text>
        </View>
        <TouchableOpacity style={styles.showDataButton} >
          <Text style={styles.showDataText}>Pagar</Text>
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
    marginTop: 30,
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
    marginVertical: 20,
  },
  showDataText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orderDetailsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  orderInfoText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 5,
  },
  pendingText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
});

export default deunaMethod;