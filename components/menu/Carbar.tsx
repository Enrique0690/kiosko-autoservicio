// components/menu/BottomBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import { Colors } from '@/constants/Colors';

const Carbar = () => {
  const { total } = useDataContext(); 
  const router = useRouter();

  return (
    <View style={styles.bottomBar}>
      <Text style={styles.totalTextLeft}>TOTAL: $ {total.toFixed(2)} </Text>
      <TouchableOpacity style={styles.continueButton} onPress={() => router.replace('/menu/shopping-cart')}>
        <Text style={styles.buttonText}>CONTINUAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
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
    color: Colors.text,
    fontSize: 30,
  },
});

export default Carbar;