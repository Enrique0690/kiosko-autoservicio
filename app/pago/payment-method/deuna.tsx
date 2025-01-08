import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header';

const deunaMethod = () => {
  const router = useRouter();
  const { total, clearCart } = useDataContext();
  return (
    <View style={styles.container}>
      <Header rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />

      <View style={styles.body}>
        
        
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
    elevation: 8,
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

export default deunaMethod;