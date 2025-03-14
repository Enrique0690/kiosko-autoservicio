import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/contexts/useDataContext';
import Header from '@/components/header';
import { updateOrderDetails } from '@/utils/updateOrderDetails';
import BuyButton from '@/components/menu/BuyButton';
import { Colors } from '@/constants/Colors';

const cardMethod = () => {
  const router = useRouter();
  const { total, clearCart, orderDetails, cart, clientData, setOrderDetails } = useDataContext();

  useEffect(() => {
    updateOrderDetails(setOrderDetails);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ScrollView>
          <View style={styles.orderDetailsContainer}>
            <Text style={styles.orderInfoText}>---------------------------------------</Text>
            <Text style={styles.orderInfoText}>Fecha: {orderDetails.date ? orderDetails.date : 'No disponible'}</Text>
            <Text style={styles.orderInfoText}>Número de pedido: {orderDetails.orderNumber}</Text>
            <View style={styles.qrContainer}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(orderDetails.uniqueCode || 'No disponible')}`} alt="QR Code" />
            </View>
            <Text style={styles.orderInfoText}>Identificador: {orderDetails.uniqueCode}</Text>
            <Text style={styles.orderInfoText}>---------------------------------------</Text>
            <Text style={styles.orderInfoText}>Metodo de pago</Text>
            <Text style={styles.pendingText}> Visa Mastercard</Text>
            <Text style={styles.orderInfoText}>---------------------------------------</Text>
          </View>
          <BuyButton />
        </ScrollView>
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
    color: Colors.text,
    fontSize: 23,
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
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  }
});

export default cardMethod;