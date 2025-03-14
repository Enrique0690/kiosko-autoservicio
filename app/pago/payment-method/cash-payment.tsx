import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useDataContext } from '@/components/contexts/useDataContext';
import { Colors } from '@/constants/Colors';
import Success from '@/app/pago/payment-method/success';
import ErrorScreen from '@/app/pago/payment-method/error';

const CashPaymentMethod = () => {
  const { total, orderDetails, cart, sendOrderData, clearCart } = useDataContext();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null); 
  const [error, setError] = useState<string | null>(null);

  const SendOrder = async () => {
    const orderData = {
      data: {
        estado: 'P',
        formaDespacho: orderDetails.formaDespacho,
        mesa: orderDetails.orderNumber,
        identificador: orderDetails.uniqueCode,
        ordenante: orderDetails.Observaciones,
        base0: 0,
        baseIva: total,
        iva: 0,
        total: total,
        descuentoTotal: 0,
        maxIdDetalle: cart.length,
        detalle: cart.map((item) => ({
          id: item.id,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precio: item.pvp1,
          pagaIva: false,
          idDetalle: item.rowNumber,
          articulosDinamicos: item.articulosDinamicos,
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
      await sendOrderData(orderData); 
      setMessage('Pedido enviado correctamente');
      setError(null);  
      return true;
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      setMessage(null);  
      setError('Hubo un error al procesar la orden. Intente nuevamente.');  
      return false;
    } 
  };
  
  const PrintOrder = async () => {
    if (process.versions && process.versions.electron) {
      const { ipcRenderer } = window.require('electron');
      try {
        const pdfPath = await ipcRenderer.invoke('print-order-details', {
          date: orderDetails.date,
          orderNumber: orderDetails.orderNumber,
          uniqueCode: orderDetails.uniqueCode,
          formapago: orderDetails.formapago,
          formaDespacho: orderDetails.formaDespacho,
          total: total,
        });
        console.log('datos enviados: ', pdfPath);
        return true;
      } catch (error) {
        console.error('Error al imprimir:', error);
        return false;
      }
    } else {
      console.log('No esta en el entorno de Electron');
      return true;
    }
  };

  useEffect(() => {
    const processOrder = async () => {
      const sendOrderSuccess = await SendOrder();
      const printOrderSuccess = await PrintOrder();
      
      if (sendOrderSuccess && printOrderSuccess) {
        setMessage('Orden procesada correctamente');
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
        <ActivityIndicator size="large" color={Colors.secondary} />
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
    fontSize: 16,
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

export default CashPaymentMethod;