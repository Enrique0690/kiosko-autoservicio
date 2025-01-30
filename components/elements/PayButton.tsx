import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Typography from '@/components/elements/Typography';
import { Colors } from '@/constants/Colors';

interface PayButtonProps {
  onPress: () => void;
  text: string;
}

const PayButton: React.FC<PayButtonProps> = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.payButton} onPress={onPress}>
      <Typography variant="subtitle" color={Colors.secondary} t={text} />
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
});

export default PayButton;