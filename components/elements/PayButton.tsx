import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Typography from '@/components/elements/Typography';
import { Colors } from '@/constants/Colors';

interface PayButtonProps {
  onPress: () => void;
  text: string;
  disabled?: boolean; 
}

const PayButton = ({ onPress, text, disabled = false }: PayButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.payButton, disabled && styles.disabledButton]} 
      onPress={onPress} 
      disabled={disabled} 
    >
      <Typography variant="subtitle" color={disabled ? 'rgba(255, 255, 255, 0.5)' : Colors.secondary} t={text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  payButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
  },
});

export default PayButton;