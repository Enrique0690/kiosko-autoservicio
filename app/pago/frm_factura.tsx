import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AlertModal from '@/components/elements/AlertModal';
import { Colors } from '@/constants/Colors';

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

    const timeout = setTimeout(() => {
      if (isLengthValid) {
        setDebouncedValue(idValue);
      } else {
        if (idValue.length === 10 && id !== 'Cedula') {
          setId('Cedula');
        } else if (idValue.length === 13 && id !== 'Ruc') {
          setId('Ruc');
        } else if (idValue.length === 8 && id !== 'Pasaporte') {
          setId('Pasaporte');
        }
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [idValue, id]);

  useEffect(() => {
    if (debouncedValue) {
      handleSearchPress(debouncedValue);
    }
  }, [debouncedValue]);

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
    router.replace('/pago/payment-method');
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.spinnerOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <Header
        leftButtonText="VOLVER"
        leftButtonRoute={'/pago'}
        rightButtonIcon={'arrow-forward-outline'}
        rightButtonRoute={'/pago/payment-method'}
        rightButtonText={'CONTINUAR'}
      />
      <ScrollView>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>DATOS DE FACTURACIÓN</Text>

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

            <TextInput
              style={styles.input}
              placeholder="Razón Social"
              value={razonSocial}
              onChangeText={setRazonSocial}
            />

            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Direccion"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
            <Text style={styles.continueButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AlertModal visible={isModalVisible} message="Todos los campos son obligatorios" onClose={() => setIsModalVisible(false)} />
      <AlertModal visible={total === 0} message="No hay elementos en el carrito" onClose={() => router.replace('/menu')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  formContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.textsecondary,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.neutralWhite,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  documentButton: {
    backgroundColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: Colors.secondary,
  },
  documentButtonText: {
    fontSize: 30,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedButtonText: {
    color: Colors.primary,
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
    height: 70,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 20,
    paddingHorizontal: 15,
    fontSize: 25,
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
    color: Colors.textsecondary,
    fontSize: 18,
    marginBottom: 20,
    marginLeft: 10,
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  continueButtonText: {
    color: Colors.primary,
    fontSize: 30,
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
    fontSize: 20,
    marginBottom: 15,
  },
});

export default frmFactura;