import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, ImageBackground, Text, TouchableOpacity, Animated } from 'react-native';

const Index = () => {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const scale = new Animated.Value(1);

  const handleStart = () => {
    router.push('/review');
  };

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://marketplace.canva.com/EAGGr5F7vLs/2/0/1143w/canva-anuncio-restaurante-carne-costillas-masculino-negro-y-caf%C3%A9-G2vM4d2ugRE.jpg',
      }}
      style={styles.background}
      resizeMode='stretch'
    >
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, pressed && styles.buttonPressed]}
          onPress={handleStart}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>COMENZAR</Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25, 
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonPressed: {
    backgroundColor: '#218838', 
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500', 
    textTransform: 'uppercase', 
    letterSpacing: 2, 
  },
});

export default Index;