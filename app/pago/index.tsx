import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header';
import { Colors } from '@/constants/Colors';
import AlertModal from '@/components/elements/AlertModal';
import IconButton from '@/components/elements/IconButton';

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
        leftButtonText='VOLVER'
        leftButtonRoute='/menu/shopping-cart'
      />
      <View style={styles.body}>
        <Text style={styles.title}>¿Datos para la facturación?</Text>
        <View style={styles.buttonContainer}>
          <IconButton iconName='help-circle-outline' text='Consumidor Final' onPress={handleEndConsumer} />
          <IconButton iconName='document-text-outline' text='Ingresa tus datos' onPress={handleInvoice} />
        </View>
        <AlertModal visible={total === 0} message='No hay elementos en el carrito' onClose={() => router.replace('/menu')} />
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
    backgroundColor: 'transparent',
  },
  title: {
    marginTop: 50,
    fontSize: 40,
    fontWeight: '700',
    color: Colors.textsecondary,
    marginBottom: 60,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '65%',
    height: '50%',
  }
});

export default PaymentMethod;
