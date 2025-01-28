import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const QuantityControls = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}) => {
  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        onPress={onDecrease}
        style={[
          styles.quantityButton,
          disabled && styles.disabledButton,
        ]}
        disabled={disabled}
      >
        <Ionicons
          name="remove-outline"
          size={20}
          color={Colors.secondary}
        />
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity
        onPress={onIncrease}
        style={[
          styles.quantityButton,
          disabled && styles.disabledButton,
        ]}
        disabled={disabled}
      >
        <Ionicons
          name="add-outline"
          size={20}
          color={Colors.secondary}
        />
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
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.disable,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginHorizontal: 12,
  },
});

export default QuantityControls;
