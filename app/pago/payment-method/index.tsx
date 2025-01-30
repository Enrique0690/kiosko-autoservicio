import React, { useEffect } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { Colors } from '@/constants/Colors';
import AlertModal from '@/components/elements/AlertModal';
import { updateOrderDetails } from '@/utils/updateOrderDetails';
import IconButton from '@/components/elements/IconButton';
import { calcularIVA } from '@/utils/ArticuloWithCals';

const PaymentMethod = () => {
  const router = useRouter();
  const { total, cart, settings, setOrderDetails } = useDataContext();
  useEffect(() => {
    updateOrderDetails(setOrderDetails);
    const resultado = calcularIVA(cart, settings);
    setOrderDetails((prevDetails: any) => ({
      ...prevDetails,
      baseIVA: resultado.baseIVA,
      base0: resultado.base0,
      ivaTotal: resultado.ivaTotal,
      total: resultado.total,
    }));
    
  }, []);
  const handlePaymentMethod = (method: 'cash' | 'deuna' | 'card') => {
    switch (method) {
      case 'cash':
        setOrderDetails((prevDetails: any) => ({
          ...prevDetails,
          formapago: 'Pago en caja',
        }));
        break;
      case 'deuna':
        setOrderDetails((prevDetails: any) => ({
          ...prevDetails,
          formapago: 'deUna',
        }));
        break;
      case 'card':
        setOrderDetails((prevDetails: any) => ({
          ...prevDetails,
          formapago: 'Tarjeta de crédito/debito',
        }));
        break;
    }
   
    router.replace('/pago/payment-method/GlobalMethod');
  };

  return (
    <View style={styles.container}>
      <Header
        leftButtonText='Regresar'
        leftButtonRoute={'/pago'}
        centerText='Elige el método de Pago'
      />
      <View style={styles.body}>
          <View style={styles.buttonContainer}>
            <IconButton iconName='cash-outline' text='Pago en caja' onPress={() => handlePaymentMethod('cash')} />
            <IconButton iconName='qr-code-outline' text='Deuna' onPress={() => handlePaymentMethod('deuna')} />
            <IconButton iconName='card-outline' text='Tarjeta' onPress={() => handlePaymentMethod('card')} />
          </View>
        <AlertModal visible={total === 0} message='No hay elementos en el carrito' onClose={() => router.replace('/menu')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  totalText: {
    color: Colors.text,
    fontSize: 23,
    fontWeight: '600',
  },
  body: {
    flex: 0.7,
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
    flex: 1,
    flexDirection: 'column',
    width: '60%',
    height: '20%',
  }
});

export default PaymentMethod;