import React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import NextButton from '@/components/elements/NextButton';
import Carousel from '@/components/carousel';

const Index = () => {
  const router = useRouter();

  const handleStart = () => {
    router.replace('/review');
  };

  return (
    <>
      <Carousel />
      <NextButton text='COMENZAR' onPress={handleStart} bottomPercentage={25} />
    </>
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