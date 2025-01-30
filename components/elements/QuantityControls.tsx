import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface QuantityControlsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  cantidadIncluye?: number;
  type?: 'included' | 'extra';
  sizeMultiplier?: number;
}

const QuantityControls = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled,
  cantidadIncluye,
  type,
  sizeMultiplier = 1,
}: QuantityControlsProps) => {
  const isDecreaseDisabled = disabled || quantity === 0;
  const isIncreaseDisabled = disabled || (type === 'included' && quantity === cantidadIncluye);

  const buttonSize = 40 * sizeMultiplier;
  const textSize = 20 * sizeMultiplier;
  const marginHorizontal = 22 * sizeMultiplier;

  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        onPress={onDecrease}
        style={[styles.quantityButton, { width: buttonSize, height: buttonSize }, isDecreaseDisabled && styles.disabledButton,]} disabled={isDecreaseDisabled}>
        <Ionicons name="remove-outline" size={20 * sizeMultiplier} color="#000" />
      </TouchableOpacity>
      <Text style={[styles.quantityText, { fontSize: textSize, marginHorizontal: marginHorizontal }]}> {quantity} </Text>
      <TouchableOpacity onPress={onIncrease}
        style={[styles.quantityButton, { width: buttonSize, height: buttonSize }, isIncreaseDisabled && styles.disabledButton,]}
        disabled={isIncreaseDisabled} >
        <Ionicons name="add-outline" size={20 * sizeMultiplier} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
  },
  quantityButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#414141',
    borderWidth: 1,
  },
  disabledButton: {
    borderColor: Colors.disable,
    opacity: 0.5,
  },
  quantityText: {
    fontWeight: 'bold',
    color: Colors.text,
  },
});

export default QuantityControls;