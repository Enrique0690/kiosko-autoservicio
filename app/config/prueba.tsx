import React from 'react';
import { Button, View } from 'react-native';

const { remote } = require('electron');

const App = () => {
  const handlePrint = () => {
    console.log('Botón de imprimir presionado'); // Verifica si la función se llama
    const currentWindow = remote.getCurrentWindow(); // Obtener la ventana actual
    const options = {
      silent: false,
      printBackground: true,
    };
  
    currentWindow.webContents.print(
      options,
      (success: boolean, errorType?: string) => { // Tipos explícitos
        if (!success) {
          console.error('Error al imprimir:', errorType);
        } else {
          console.log('Impresión exitosa.');
        }
      }
    );
  };
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Imprimir" onPress={handlePrint} />
    </View>
  );
};

export default App;
