const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');

const net = require('net');

let mainWindow;
let serverProcess;

const waitForServer = (port, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const interval = 500; // Verificar cada 500ms
    let elapsedTime = 0;

    const timer = setInterval(() => {
      const client = net.createConnection({ port }, () => {
        clearInterval(timer);
        client.end();
        resolve();
      });

      client.on('error', () => {
        elapsedTime += interval;
        if (elapsedTime >= timeout) {
          clearInterval(timer);
          reject(new Error('No se pudo conectar al servidor en el tiempo especificado.'));
        }
      });
    }, interval);
  });
};

app.on('ready', async () => {
  const distPath = path.join(__dirname, 'dist');
  const port = 6000;

  serverProcess = exec(`npx serve ${distPath} -l ${port}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al iniciar el servidor: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });

  try {
    console.log('Esperando a que el servidor esté listo...');
    await waitForServer(port, 10000);
    console.log('Servidor listo. Iniciando ventana...');

    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: true,
        nodeIntegration: true,
      },
    });

    mainWindow.loadURL(`http://localhost:${port}`);
  } catch (error) {
    console.error('Error conectando al servidor:', error.message);
    app.quit();
  }
});

ipcMain.handle('print-order-details', async (_event, orderDetails) => {
  try {
    const pdfPath = path.join(app.getPath('desktop'), `Order_${orderDetails.orderNumber}.pdf`);
    const doc = new PDFDocument();

    // Crear un stream de escritura para el archivo PDF
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Agregar encabezado
    doc
      .fontSize(16)
      .text(orderDetails.date, { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(20)
      .text(`Order Number: ${orderDetails.orderNumber}`, { align: 'center' })
      .moveDown(1);

    // Generar código QR y agregarlo al PDF
    const qrImage = await QRCode.toDataURL(orderDetails.uniqueCode);
    const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');

    doc
      .image(qrBuffer, { fit: [150, 150], align: 'center', valign: 'center' })
      .moveDown(1);

    doc
      .fontSize(16)
      .text(`Unique Code: ${orderDetails.uniqueCode}`, { align: 'center' })
      .moveDown(2);

    // Agregar método de pago
    doc
      .fontSize(16)
      .text('Método de pago', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(18)
      .text(orderDetails.formaPago || 'No especificado', { align: 'center' })
      .moveDown(2);

    // Finalizar y cerrar el documento PDF
    doc.end();

    // Esperar a que se termine de escribir el archivo
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    console.log(`PDF generado: ${pdfPath}`);
    return pdfPath; // Devolver la ruta del PDF generado
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  }
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
    serverProcess.on('exit', () => {
      app.quit();
    });
  } else {
    app.quit();
  }
});