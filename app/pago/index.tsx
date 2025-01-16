import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header';
import { Colors } from '@/constants/Colors';
import AlertModal from '@/components/elements/AlertModal';

const PaymentMethod = () => {
  const router = useRouter();
  const { total, setClientData, setOrderDetails } = useDataContext();

  const handleEndConsumer = () => {
    setClientData({
      identification: '9999999999999',
      razonSocial: 'Consumidor Final',
      telefono: '',
      email: '',
    });
    setOrderDetails((prevDetails: any) => ({
      ...prevDetails,
      documento: 'Nota de entrega',
    }));
    router.replace('/pago/payment-method');
  };

  const handleInvoice = () => {
    router.replace('/pago/frm_factura');
  };

  return (
    <View style={styles.container}>
      <Header
        leftButtonText="Volver"
        leftButtonRoute="/menu/shopping-cart"
        rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>}
      />
      <View style={styles.body}>
        <Text style={styles.title}>¿Deseas facturar tu pedido?</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleEndConsumer}>
            <Ionicons name="help-circle-outline" size={80} color={Colors.primary} />
            <Text style={styles.buttonText}>Consumidor Final</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleInvoice}>
            <Ionicons name="document-text-outline" size={80} color={Colors.primary} />
            <Text style={styles.buttonText}>Facturas</Text>
          </TouchableOpacity>
        </View>

        <AlertModal visible={total === 0} message="No hay elementos en el carrito" onClose={() => router.replace('/menu')} />
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
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textsecondary,
    marginBottom: 60,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: 20,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 35,
    borderRadius: 25,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});

export default PaymentMethod;
