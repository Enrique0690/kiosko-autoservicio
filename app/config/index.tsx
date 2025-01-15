import React from 'react';
import { Button, View } from 'react-native';

const { remote } = require('electron');

const App = () => {
  const handlePrint = () => {
    console.log('Botón de imprimir presionado');
  
    const currentWindow = remote.getCurrentWindow();
    console.log('currentWindow:', currentWindow); // Verifica el valor
  
    if (!currentWindow) {
      console.error('No se pudo obtener la ventana actual.');
      return;
    }
  
    currentWindow.webContents.print({}, (success: boolean) => {  // Simplificado
      if (success) {
        console.log('Impresión exitosa');
      } else {
        console.error('Error al imprimir');
      }
    });
  };
  
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Imprimir" onPress={handlePrint} />
    </View>
  );
};

export default App;
