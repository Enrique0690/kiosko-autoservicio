import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header';

const PaymentMethod = () => {
  const router = useRouter();
  const { total, clearCart } = useDataContext();
  const cash = () => {
    router.push('/pago/payment-method/cash-payment');
  }
  const deuna = () => {
    router.push('/pago/payment-method/deuna');
  }
  const card = () => {
    router.push('/pago/payment-method/card');
  }
  return (
    <View style={styles.container}>
      <Header rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />

      <View style={styles.body}>
        <Text style={styles.paymentTitle}>¿Te gustaría agregar datos de facturación?</Text>
        <TouchableOpacity style={styles.addInvoiceDataButton} onPress={() => router.push('/pago/frm_factura')}>
          <Ionicons name="file-tray" size={22} color="#fff" />
          <Text style={styles.addInvoiceDataText}>Agregar los datos de facturación</Text>
        </TouchableOpacity>

        <Text style={styles.paymentTitle}>Elige el método de pago</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={cash}>
            <Ionicons name="cash-outline" size={30} color="#fff" />
            <Text style={styles.buttonText}>Pago en caja</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={deuna}>
            <Ionicons name="qr-code-outline" size={30} color="#fff" />
            <Text style={styles.buttonText}>Deuna</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={card}>
            <Ionicons name="card-outline" size={30} color="#fff" />
            <Text style={styles.buttonText}>Tarjeta</Text>
          </TouchableOpacity>
        </View>
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
  paymentTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 30,
  },
  addInvoiceDataButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 35,
    marginVertical: 25,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 8, // Sombras suaves para darle más profundidad
  },
  addInvoiceDataText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '28%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default PaymentMethod;
