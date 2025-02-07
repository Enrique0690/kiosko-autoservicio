import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '../contexts/useDataContext';
import { Colors } from '@/constants/Colors';
import CurrencySymbol from './CurrencySymbol';
import Typography from '../elements/Typography';

const Carbar = () => {
  const { total, cart } = useDataContext(); 
  const router = useRouter();
  const isCartEmpty = cart.length === 0;

  return (
    <View style={styles.bottomBar}>
      <Typography variant='subtitle' color={Colors.text} t={`TOTAL: $${total.toFixed(2)}`} />
      <TouchableOpacity style={[styles.continueButton]}
       onPress={() => router.replace('/menu/shopping-cart')} disabled={isCartEmpty}>
        <Typography variant='title' color={isCartEmpty ? Colors.disable : Colors.primary} t='CONTINUAR' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.secondary,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 5, 
    height: 80,
  },
  totalTextLeft: {
    fontSize: 30,
    color: Colors.primary,
    marginVertical: 'auto',
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 0, 0.25)', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 30,
  },
  disabledButton: {
    backgroundColor: Colors.disable, 
    borderColor: Colors.disable, 
  },
});

export default Carbar;