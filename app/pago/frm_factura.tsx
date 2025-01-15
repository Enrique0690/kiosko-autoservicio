import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const frmFactura = () => {
  const router = useRouter();
  const { total, setClientData, setIsInvoiceRequested } = useDataContext();
  const [id, setId] = useState<'Cedula' | 'Ruc' | 'Pasaporte'>('Cedula');
  const [idValue, setIdValue] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const documentTexts = {
    Cedula: {
      placeholder: 'Cédula',
      helpText: 'Ingresa el número de cédula de la empresa.'
    },
    Ruc: {
      placeholder: 'RUC',
      helpText: 'Ingresa el número de RUC de la empresa.'
    },
    Pasaporte: {
      placeholder: 'Pasaporte',
      helpText: 'Ingresa el número de pasaporte de la empresa.'
    }
  };

  useEffect(() => {
    const isLengthValid =
      (id === 'Cedula' && idValue.length === 10) ||
      (id === 'Ruc' && idValue.length === 13) ||
      (id === 'Pasaporte' && idValue.length === 8);

    if (isLengthValid) {
      const handler = setTimeout(() => {
        setDebouncedValue(idValue);
      }, 2000);

      return () => clearTimeout(handler);
    } else {
      const timeout = setTimeout(() => {
        if (idValue.length === 10 && id !== 'Cedula') {
          setId('Cedula');
          handleSearchPress(idValue); 
        } else if (idValue.length === 13 && id !== 'Ruc') {
          setId('Ruc');
          handleSearchPress(idValue); 
        } else if (idValue.length === 8 && id !== 'Pasaporte') {
          setId('Pasaporte');
          handleSearchPress(idValue); 
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [idValue, id]);

  const handleSearchPress = async (value?: string) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.get(
        `https://ec-s1.runfoodapp.com/apps/demo-digital-mind/api/v1/sri/person-public-data/?identificacion=${idValue}`
      );
      const data = response.data;
      if (data) {
        setRazonSocial(data.razonSocial || '');
        setTelefono(data.telefono || '');
        setEmail(data.email || '');
        setAddress(data.direccion || '');
      } else {
        throw new Error('No encontrado');
      }
    } catch (error) {
      setErrorMessage(
        `No se pudo encontrar el numero de ${id.toLowerCase()} proporcionado.`
      );
      setRazonSocial('');
      setTelefono('');
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDocumentTypeChange = (type: 'Cedula' | 'Ruc' | 'Pasaporte') => {
    setId(type);
    setErrorMessage('');
  };

  const handleContinuePress = () => {
    if (!idValue || !razonSocial || !telefono || !email || !address) {
      setIsModalVisible(true);
      return;
    }

    setClientData({
      identification: idValue,
      razonSocial,
      telefono,
      email,
      address,
    });
    setIsInvoiceRequested(true);
    router.replace('/pago');
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.spinnerOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <Header rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />
      <ScrollView>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Datos de facturación</Text>

        <View style={styles.buttonGroup}>
          {['Cedula', 'Ruc', 'Pasaporte'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.documentButton, id === type && styles.selectedButton, styles.buttonItem]}
              onPress={() => handleDocumentTypeChange(type as 'Cedula' | 'Ruc' | 'Pasaporte')}
            >
              <Text style={[styles.documentButtonText, id === type && styles.selectedButtonText]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={documentTexts[id].placeholder}
              value={idValue}
              onChangeText={setIdValue}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => handleSearchPress(idValue)}
            >
              <Ionicons name="search" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          {errorMessage?.trim() !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <Text style={styles.helpText}>{documentTexts[id].helpText}</Text>

          <TextInput
            style={styles.input}
            placeholder="Razón Social"
            value={razonSocial}
            onChangeText={setRazonSocial}
          />
          <Text style={styles.helpText}>Escribe el nombre completo de la empresa.</Text>

          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />
          <Text style={styles.helpText}>Ingresa un número de teléfono válido.</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.helpText}>Introduce el correo electrónico de contacto.</Text>

          <TextInput
            style={styles.input}
            placeholder="Direccion"
            value={address}
            onChangeText={setAddress}
          />
          <Text style={styles.helpText}>Introduce tu direccion.</Text>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      {isModalVisible && (
        <Modal transparent={true} animationType="fade" visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}> 
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalMessage}>Todos los campos son obligatorios</Text>
                <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  totalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F7F7F7',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  documentButton: {
    backgroundColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: '#388E3C',
  },
  documentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
  inputGroup: {
    width: '85%',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: '40%',
    transform: [{ translateY: -12 }],
  },
  helpText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
    marginLeft: 10,
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 35,
    marginTop: 20,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  spinnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '50%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 35,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default frmFactura;
