import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';

const BuyButton = () => {
  const router = useRouter();
  const { total, orderDetails, cart, sendOrderData } = useDataContext();

  const handlePrintOrder = async () => {
    if (process.versions && process.versions.electron) {
      const { ipcRenderer } = window.require('electron');
      try {
        const pdfPath = await ipcRenderer.invoke('print-order-details', {
          date: orderDetails.date,
          orderNumber: orderDetails.orderNumber,
          uniqueCode: orderDetails.uniqueCode,
          formapago: orderDetails.formapago,
          formaDespacho: orderDetails.formaDespacho,
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

  const handleSendOrder = async () => {
    try {
      const orderData = {
        data: {
          estado: 'P',
          formaDespacho: orderDetails.formaDespacho,
          mesa: orderDetails.orderNumber,
          identificador: orderDetails.uniqueCode,
          ordenante: orderDetails.Observaciones,
          base0: total,
          baseIva: 0,
          iva: 0,
          total: total,
          descuentoTotal: 0,
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
      await sendOrderData(orderData);   
      return true;
    } catch (error) {
      console.error('Error al enviar los datos del pedido:', error);
      return false;
    }
  };

  const handleOrderProcess = async () => {
    const isOrderSent = await handleSendOrder();
    if (!isOrderSent) return; 
    const isPrinted = await handlePrintOrder();
    if (!isPrinted) return; 
    router.replace('/pago/completed'); 
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleOrderProcess}>
      <Text style={styles.buttonText}>Pagar</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BuyButton;