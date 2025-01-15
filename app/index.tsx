import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, ImageBackground} from 'react-native';
import NextButton from '@/components/elements/NextButton';

const Index = () => {
  const router = useRouter();

  const handleStart = () => {
    router.replace('/review');
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://marketplace.canva.com/EAGGr5F7vLs/2/0/1143w/canva-anuncio-restaurante-carne-costillas-masculino-negro-y-caf%C3%A9-G2vM4d2ugRE.jpg',
      }}
      style={styles.background}
      resizeMode='stretch'
    >
      <NextButton text='COMENZAR' onPress={handleStart} bottomPercentage={25} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});

export default Index;