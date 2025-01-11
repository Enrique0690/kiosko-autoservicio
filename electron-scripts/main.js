const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const url = require('url');
const Store = require('electron-store');

const preferences = new Store({
  configName: 'preferences',
  defaults: {
    window_width: 800,
    window_height: 600,
    window_fullscreen: false,
  },
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: preferences.get('window_width'),
    height: preferences.get('window_height'),
    fullscreen: preferences.get('window_fullscreen'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  const startUrl =
    process.env.ELECTRON_START_URL || 
    `file://${path.join(__dirname, '../build/index.html')}`; 
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

ipcMain.on('log', (event, log) => {
  console.log(log);
});