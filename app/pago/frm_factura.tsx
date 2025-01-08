import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
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

  const handleSearchPress = async () => {
    console.log('Buscando datos de la persona...', id);
    try {
      const response = await axios.get(`https://ec-s1.runfoodapp.com/apps/demo-digital-mind/api/v1/sri/person-public-data/?identificacion=${idValue}`);
      console.log('Resultado de la consulta:', response.data);
      const data = response.data;
      setRazonSocial(data.razonSocial || '');
      setTelefono(data.telefono || ''); 
      setEmail(data.email || '');
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
    }
  };

  const handleDocumentTypeChange = (type: 'Cedula' | 'Ruc' | 'Pasaporte') => {
    setId(type);
    setIdValue('');
    setRazonSocial('');
    setTelefono('');
    setEmail('');
  };

  const handleContinuePress = () => {
    if (!idValue || !razonSocial || !telefono || !email) {
      console.error('Todos los campos son obligatorios');
      return;
    }

    setClientData({
      identification: idValue,
      razonSocial,
      telefono,
      email,
    });
    setIsInvoiceRequested(true);
    router.push('/pago/payment-method');
  };

  return (
    <View style={styles.container}>
      <Header rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />
      
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
            />
            <TouchableOpacity 
              style={styles.icon} 
              onPress={handleSearchPress} 
            >
              <Ionicons name="search" size={24} color="#000" />  
            </TouchableOpacity>
          </View>
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
        </View>
        
        <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
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
});

export default frmFactura;
