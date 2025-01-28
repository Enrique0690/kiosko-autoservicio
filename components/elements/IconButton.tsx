import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Typography from './Typography';

const IconButton = ({ iconName, text, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      <Ionicons name={iconName} size={150} color={Colors.primary} />
      <Typography variant='title' color={Colors.primary} t={text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '15px 15px 5px rgba(0, 0, 0, 0.2)',
    elevation: 6,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 50,
    fontWeight: '600',
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default IconButton;
