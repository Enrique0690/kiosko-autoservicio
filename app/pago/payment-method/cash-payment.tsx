import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { updateOrderDetails } from '@/utils/updateOrderDetails';
import BuyButton from '@/components/menu/BuyButton';
import { Colors } from '@/constants/Colors';

const CashPaymentMethod = () => {
  const { total, orderDetails, setOrderDetails } = useDataContext();

  useEffect(() => {
    updateOrderDetails(setOrderDetails);
  }, []);

  return (
    <View style={styles.container}>
      <Header rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />
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
            <Text style={styles.pendingText}>PENDIENTE DE PAGO (EFECTIVO)</Text>
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
    backgroundColor: Colors.neutralWhite,
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
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  }
});

export default CashPaymentMethod;