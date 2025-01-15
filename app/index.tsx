import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, ImageBackground, Text, TouchableOpacity, Animated, Modal, TextInput, View } from 'react-native';
import { useDataContext } from '@/components/DataContext/datacontext';
import { Ionicons } from '@expo/vector-icons';
import NextButton from '@/components/elements/NextButton';

const Index = () => {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const scale = new Animated.Value(1);
  const { users } = useDataContext();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleStart = () => {
    router.push('/review');
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLogin = () => {
    const user = users.find(u => u.nombre === username && u.password === password);
    if (user) {
      router.push('/config');
      closeModal();
    } else {
      setErrorMessage('Usuario o contraseña incorrectos');
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://marketplace.canva.com/EAGGr5F7vLs/2/0/1143w/canva-anuncio-restaurante-carne-costillas-masculino-negro-y-caf%C3%A9-G2vM4d2ugRE.jpg',
      }}
      style={styles.background}
      resizeMode='stretch'
    >
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={openModal}
      >
        <Ionicons name="settings" size={30} color="#ffffff" />
      </TouchableOpacity>

      <NextButton text='COMENZAR' onPress={handleStart} />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Iniciar sesión</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 50,
  },
  
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    color: '#007BFF',
    marginTop: 10,
  },
});

export default Index;