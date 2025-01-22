import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardTypeOptions } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { fetchPersonData } from '@/components/frmfactura/fetchPersonData';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { validationRules } from '@/constants/ValidationsRules';

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
  const [fieldError, setFieldError] = useState<{ [key: string]: string }>({});
  const idValueRef = useRef<TextInput>(null);
  const razonSocialRef = useRef<TextInput>(null);
  const telefonoRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

  const documentTexts = {
    Cedula: { placeholder: 'Cédula', helpText: 'Ingresa el número de cédula de la empresa.' },
    Ruc: { placeholder: 'RUC', helpText: 'Ingresa el número de RUC de la empresa.' },
    Pasaporte: { placeholder: 'Pasaporte', helpText: 'Ingresa el número de pasaporte de la empresa.' }
  };

  const formFields = [{ name: 'razonSocial', ref: razonSocialRef, value: razonSocial, setValue: setRazonSocial, placeholder: 'Razón Social' },
  { name: 'telefono', ref: telefonoRef, value: telefono, setValue: setTelefono, placeholder: 'Teléfono', keyboardType: 'phone-pad' as KeyboardTypeOptions },
  { name: 'email', ref: emailRef, value: email, setValue: setEmail, placeholder: 'Email', keyboardType: 'email-address' as KeyboardTypeOptions },
  { name: 'address', ref: addressRef, value: address, setValue: setAddress, placeholder: 'Dirección' }
  ];

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
    const result = await fetchPersonData(idValue, id);
    setRazonSocial(result.razonSocial);
    setTelefono(result.telefono);
    setEmail(result.email);
    setAddress(result.address);
    setErrorMessage(result.errorMessage);
    setIsLoading(false);
  };

  const handleDocumentTypeChange = (type: 'Cedula' | 'Ruc' | 'Pasaporte') => {
    setId(type);
    setErrorMessage('');
  };

  const validateFields = () => {
    let errors: { [key: string]: string } = {};
    if (!idValue) errors.idValue = 'Ingrese su Cédula, RUC o Pasaporte';
    else {
      const idValidation = validationRules.IDNumber(idValue);
      if (idValidation) errors.idValue = idValidation;
    }
    if (!razonSocial) errors.razonSocial = 'Ingrese su Razón Social';
    if (!telefono) errors.telefono = 'Ingrese su Teléfono';
    if (!email) errors.email = 'Ingrese su Email';
    if (!address) errors.address = 'Ingrese su Dirección';
    setFieldError(errors);
    if (Object.keys(errors).length > 0) {
      const firstErrorField = formFields.find((field) => errors[field.name]);
      firstErrorField?.ref.current?.focus();
    }
    return Object.keys(errors).length === 0;
  };

  const handleContinuePress = () => {
    if (validateFields()) {
      setClientData({
        identification: idValue,
        razonSocial,
        telefono,
        email,
        address,
      });
      setIsInvoiceRequested(true);
      router.replace('/pago/payment-method');
    }
  };

  const handleInputChange = (fieldName: string, value: string, setValue: (val: string) => void, keyboardType?: KeyboardTypeOptions) => {
    if (keyboardType === 'numeric') {
      value = value.replace(/[^0-9]/g, '');
    }
    setValue(value);
    setFieldError((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.spinnerOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <Header
        leftButtonText="Regresar"
        leftButtonRoute={'/pago'}
        centerText={'Ingrese sus datos'}
        rightButtonIcon={'arrow-forward-outline'}
        rightButtonRoute={'/pago/payment-method'}
        rightButtonText={'Contirnuar'}
      />
      <ScrollView>
        <View style={styles.formContainer}>
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
          <View style={styles.inputWrapper}>
            <TextInput
              ref={idValueRef}
              style={styles.input}
              placeholder={documentTexts[id].placeholder}
              value={idValue}
              onChangeText={(text) => handleInputChange('idValue', text, setIdValue, 'numeric')}
              keyboardType="numeric"
              maxLength={id === 'Cedula' ? 10 : id === 'Ruc' ? 13 : 8}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => handleSearchPress(idValue)}
            >
              <Ionicons name="search" size={30} color={Colors.darkGray} />
            </TouchableOpacity>
            {(fieldError.idValue || errorMessage) && (<Text style={styles.errorText}> {fieldError.idValue || errorMessage} </Text>)}
          </View>
          {formFields.map((field) => (
            <View key={field.name} style={styles.inputWrapper}>
              <TextInput
                ref={field.ref}
                style={styles.input}
                placeholder={field.placeholder}
                value={field.value}
                onChangeText={(text) => handleInputChange(field.name, text, field.setValue, field.keyboardType)}
                keyboardType={field.keyboardType}
              />
              {fieldError[field.name] && <Text style={styles.errorText}>{fieldError[field.name]}</Text>}
            </View>
          ))}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
            <Text style={styles.continueButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    borderRadius: 25,
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
    width: '85%',
    marginBottom: 40,
    position: 'relative'
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 25,
    backgroundColor: Colors.background
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
    marginTop: 50,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  continueButtonText: {
    color: Colors.secondary,
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
  errorText: { position: 'absolute', top: '100%', left: 0, fontSize: 16, color: Colors.error },
});

export default frmFactura;