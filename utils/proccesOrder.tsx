export const handlePrintOrder = async (orderDetails: any, total: any): Promise<boolean> => {
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

      console.log('Impresión exitosa, datos enviados: ', pdfPath);
      return true; 
    } catch (error: any) {
      console.error('Error al imprimir:', error.message || error);
      throw new Error('Error al intentar imprimir la orden'); 
    }
  } else {
    console.error('Error: La aplicación no se está ejecutando en un entorno de Electron');
    throw new Error('Impresión no soportada fuera del entorno de Electron'); 
  }
};

export const handleSendOrder = async (orderDetails: any, total: number, cart: any, sendOrderData: Function): Promise<boolean> => {
  try {
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
        detalle: cart.map((item: any) => ({
          ...item,
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
    console.log('Datos enviados: ', orderData);
    const response = await sendOrderData(orderData);
    if (!response.ok) {
      throw new Error(`Error en el servidor: ${response.statusText || 'Error desconocido'}`);
    }
    return true;
  } catch (error: any) {
    console.error('Error al enviar los datos del pedido:', error.message || error);
    throw new Error('Error al enviar el pedido');
  }
};
