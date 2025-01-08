import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';

export const LoadingComponent = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
};

export const ErrorComponent = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <Button title="Reintentar" onPress={onRetry} color="#ff0000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});