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
      <Text style={styles.totalTextLeft}>Total: ${total.toFixed(2)}</Text>
      <TouchableOpacity style={styles.continueButton} onPress={() => router.replace('/menu/shopping-cart')}>
        <Text style={styles.buttonText}>Continuar</Text>
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
    fontSize: 23,
    fontWeight: '600',
    color: Colors.primary,
    marginVertical: 'auto',
  },
  continueButton: {
    backgroundColor: Colors.primary, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.secondary,
    fontSize: 23,
    fontWeight: 'bold',
  },
});

export default Carbar;