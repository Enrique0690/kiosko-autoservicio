import React, {useEffect} from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Carousel from '@/components/carousel';
import { Colors } from '@/constants/Colors';
import Typography from '@/components/elements/Typography';
import { useDataContext } from '@/components/contexts/useDataContext';

const Index = () => {
  const router = useRouter();
  const { clearCart } = useDataContext();

  useEffect(() => {
    clearCart();
  }, []);

  const handleStart = () => {
    router.replace('/review');
  };

  return (
    <>
      <Carousel />
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleStart}
        >
          <Typography variant='largest' color={Colors.secondary} t='COMENZAR'></Typography>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    left: '5%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '25%',
  },
  button: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 0, 0.05)', 
  },
  buttonPressed: {
    backgroundColor: 'rgba(0, 255, 0, 0.50)',
  },
  textBackground: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default Index;