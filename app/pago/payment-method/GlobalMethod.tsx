import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useDataContext } from '@/components/contexts/useDataContext';
import { Colors } from '@/constants/Colors';
import Success from '@/app/pago/payment-method/success';
import ErrorScreen from '@/app/pago/payment-method/error';

const GlobalMethod = () => {
  const { total, orderDetails, cart, clientData, sendOrderData, clearCart } = useDataContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<any | null>(null);

  const SendOrder = async () => {
    const orderData = {
      data: {
        estado: 'P',
        formaDespacho: orderDetails.formaDespacho,
        mesa: orderDetails.orderNumber,
        identificador: orderDetails.uniqueCode,
        ordenante: orderDetails.Observaciones,
        base0: orderDetails.base0,
        baseIva: orderDetails.baseIVA,
        iva: orderDetails.ivaTotal,
        total: orderDetails.total,
        descuentoTotal: 0,
        maxIdDetalle: cart.length,
        detalle: cart.map((item) => ({
          ...item,
          idDetalle: item.rowNumber,
          dinamico: item.dinamico,
          pvpSeleccionado: item.pvpSeleccionado,
          articulosDinamicos: item.articulosDinamicos,
          total: item.pvp1,
          cuenta: clientData,
        })),
      },
      token: new Date().valueOf(),
      timestamp: new Date().valueOf() + ':1736439145906:25',
      tablet: {
        usuario: 2,
        usuarioName: 'Kiosko autoservicio',
      },
    };
    try {
      const response = await sendOrderData(orderData);
      console.log('Respuesta del servidor:', response);  
      setOrderId(response);
      setError(null);
      return true;
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      setError('Hubo un error al procesar la orden. Intente nuevamente.');
      return false;
    }
  };

  const PrintOrder = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.printOrder(orderId);
        return true;
      } catch (error) {
        console.error('Error al imprimir:', error);
        return false;
      }
    } else {
      console.log('No está en el entorno de Electron');
      return true;
    }
  };

  useEffect(() => {
    const processOrder = async () => {
      const sendOrderSuccess = await SendOrder();

      if (sendOrderSuccess) {
        const printOrderSuccess = await PrintOrder();

        if (printOrderSuccess) {
        } else {
          setError('Hubo un error al intentar imprimir la orden');
        }
      } else {
        setError('Hubo un error al procesar la orden');
      }
      setLoading(false);
    };
    processOrder();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={120} color={Colors.success} />
        <Text style={styles.loadingText}>Procesando la orden...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <ErrorScreen />
      ) : (
        <Success />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.neutralWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 30,
    color: Colors.neutralGray,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
});

export default GlobalMethod;