const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const net = require('net');

let mainWindow;
let serverProcess;

const waitForServer = (port, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const interval = 500;
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
  const port = 7057;

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
    mainWindow.on('closed', () => {
      if (serverProcess) {
        serverProcess.kill('SIGTERM');
      }
    });
  } catch (error) {
    console.error('Error conectando al servidor:', error.message);
    app.quit();
  }
});

ipcMain.handle('print-order-details', async (_event, orderDetails) => {
  try {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          page-break-before: always;
        }
        @page {
          size: 80mm auto;  
          margin: 0;
        }
        body {
          border: none;
          font-family: Arial, sans-serif;
          text-align: left;
          position: relative;
          padding: 5mm;
          height: 100%;
        }
        .content {
          position: absolute;
          top: 0;
          left: 0;
          width: 80mm; 
          height: auto;
          padding: 5px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;  
          justify-content: center;
        }
        .qr-container img {
          width: 100px; 
          height: auto;
          object-fit: contain;
        }
        .separator {
          margin: 5px 0;
          border-top: 1px solid #000;
        }
        h1 {
          font-size: 14px; 
          margin: 0;
        }
        .payment-method {
          font-size: 12px; 
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <h1>Fecha: ${orderDetails.date}</h1>
        <div class="separator"></div>
        <h1>Número de pedido: ${orderDetails.orderNumber}</h1>
        <div class="qr-container">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${orderDetails.qrCode}" alt="QR Code" />
        </div>
        <h1>Identificador: ${orderDetails.uniqueCode}</h1>
        <div class="separator"></div>
        <div class="payment-method">
          <p>Método de pago</p>
          <h1>${orderDetails.formaPago || 'No especificado'}</h1>
        </div>
      </div>
    </body>
    </html>
  `;
    const printWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
      },
    });
    printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

    printWindow.webContents.on('did-finish-load', () => {
      printWindow.webContents.print({
        silent: false,
        margin: 0,
      }, (success, failureReason) => {
        if (!success) {
          console.log('Error al imprimir:', failureReason);
        } else {
          console.log('Impresión exitosa');
        }
        printWindow.close();
      });
    });
  } catch (error) {
    console.error('Error al imprmir: ', error);
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