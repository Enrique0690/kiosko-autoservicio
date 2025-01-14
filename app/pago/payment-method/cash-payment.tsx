import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { updateOrderDetails } from '@/utils/updateOrderDetails';
const { ipcRenderer } = window.require('electron'); 

const CashPaymentMethod = () => {
  const router = useRouter();
  const { total, clearCart, orderDetails, cart, clientData, setOrderDetails, sendOrderData } = useDataContext();

  useEffect(() => {
    updateOrderDetails(setOrderDetails);
  }, []);

  const handleShowData = () => {
    console.log('Datos almacenados en el contexto:');
    console.log('Total:', total);
    console.log('Carrito:', cart);
    console.log('Detalles del pedido:', orderDetails);
    console.log('Datos del cliente:', clientData);
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
          detalle: cart.map((item )=> ({
            id: item.id,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precio: item.pvp1,
            pagaIva: false,
            idDetalle: item.rowNumber,
            articulosDinamicos: item.dinamicoLineas,
          })),
        },
        token: new Date().valueOf(),
        timestamp: new Date().valueOf()+':1736439145906:25',
        tablet: {
          usuario: 2,
          usuarioName: 'Kiosko autoservicio'
        }
      };
      console.log('Enviando datos del pedido:', orderData);
      await sendOrderData(orderData);
      clearCart();
    } catch (error) {
      console.error('Error al enviar los datos del pedido:', error);
    }
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleString();
  };

  const handlePrintOrderDetails = async () => {
    console.log('Imprimiendo detalles del pedido...');
    if (process.versions && process.versions.electron) {
      console.log('Estamos en el entorno de Electron!');
    } else {
      console.log('No estamos en un entorno de Electron');
    }
    try {
      const pdfPath = await ipcRenderer.invoke('print-order-details', {
        date: formatDate(orderDetails.date),
        orderNumber: orderDetails.orderNumber,
        uniqueCode: orderDetails.uniqueCode,
        formapago: orderDetails.formapago,
        formaDespacho: orderDetails.formaDespacho,
      })
      console.log('PDF generado y enviado:', pdfPath);
    } catch (error) {
      console.error('Error al generar y enviar el PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header rightComponent={<Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>} />

      <View style={styles.body}>
        <TouchableOpacity style={styles.showDataButton} onPress={handleShowData}>
          <Text style={styles.showDataText}>Mostrar Datos</Text>
        </TouchableOpacity>

        <View style={styles.orderDetailsContainer}>
          <Text style={styles.orderInfoText}>---------------------------------------</Text>
          <Text style={styles.orderInfoText}>Fecha: {orderDetails.date ? formatDate(orderDetails.date) : 'No disponible'}</Text>
          <Text style={styles.orderInfoText}>Número de pedido: {orderDetails.orderNumber}</Text>
          <View style={styles.qrContainer}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(orderDetails.uniqueCode || 'No disponible')}`} alt="QR Code" />
          </View>
          <Text style={styles.orderInfoText}>Identificador: {orderDetails.uniqueCode}</Text>
          <Text style={styles.orderInfoText}>---------------------------------------</Text>
          <Text style={styles.orderInfoText}>Metodo de pago</Text>
          <Text style={styles.pendingText}>PENDIENTE DE PAGO (EFECTIVO)</Text>
          <Text style={styles.orderInfoText}>---------------------------------------</Text>
        </View>
        <TouchableOpacity style={styles.showDataButton} onPress={handleSendOrder}>
          <Text style={styles.showDataText}>Pagar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.showDataButton} onPress={handlePrintOrderDetails}>
          <Text style={styles.showDataText}>Imprimir Detalles del Pedido</Text>
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
  body: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  showDataButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    marginVertical: 20,
  },
  showDataText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orderDetailsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  orderInfoText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 5,
  },
  pendingText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  }
});

export default CashPaymentMethod;