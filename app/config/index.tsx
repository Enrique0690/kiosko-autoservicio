import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Config = () => {
  const router = useRouter();

  const handleEditOrder = () => {
    // Aquí puedes agregar la lógica para editar el orden de las categorías
    console.log('Editar orden de categorías');
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión, como limpiar el contexto, token, etc.
    router.push('/'); // Redirige a la pantalla principal
  };

  return (
    <View style={styles.container}>
      {/* Botón de editar orden de categorías */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={handleEditOrder}
      >
        <Text style={styles.editButtonText}>Editar orden de categorías</Text>
      </TouchableOpacity>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
  },
});

export default Config;