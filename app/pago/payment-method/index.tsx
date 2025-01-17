import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header';
import { Colors } from '@/constants/Colors';
import AlertModal from '@/components/elements/AlertModal';
import { updateOrderDetails } from '@/utils/updateOrderDetails';

const PaymentMethod = () => {
  const router = useRouter();
  const { total, setOrderDetails } = useDataContext();
  useEffect(() => {
    updateOrderDetails(setOrderDetails);
  }, []);
  const handlePaymentMethod = (method: 'cash' | 'deuna' | 'card') => {
    switch (method) {
      case 'cash':
        setOrderDetails((prevDetails: any) => ({
          ...prevDetails,
          formapago: 'efectivo',
        }));
        break;
      case 'deuna':
        setOrderDetails((prevDetails: any) => ({
          ...prevDetails,
          formapago: 'deuna',
        }));
        break;
      case 'card':
        setOrderDetails((prevDetails: any) => ({
          ...prevDetails,
          formapago: 'card',
        }));
        break;
    }
    router.replace('/pago/payment-method/GlobalMethod');
  };

  return (
    <View style={styles.container}>
      <Header
        leftButtonText="Volver"
        leftButtonRoute={'/pago'}
        rightComponent={<Text style={styles.totalText}>Total: {total.toFixed(2)} $</Text>}
      />
      <View style={styles.body}>
        <ScrollView>
          <Text style={styles.paymentTitle}>Elige el método de pago</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handlePaymentMethod('cash')}>
              <Ionicons name="cash-outline" size={70} color={Colors.primary} />
              <Text style={styles.buttonText}>Pago en caja</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePaymentMethod('deuna')}>
              <Ionicons name="qr-code-outline" size={70} color={Colors.primary} />
              <Text style={styles.buttonText}>Deuna</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePaymentMethod('card')}>
              <Ionicons name="card-outline" size={70} color={Colors.primary} />
              <Text style={styles.buttonText}>Tarjeta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginVertical: 'auto',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  paymentTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: Colors.textsecondary,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 30,
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 25,
    width: 350,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default PaymentMethod;