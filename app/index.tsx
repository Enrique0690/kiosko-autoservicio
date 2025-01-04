import React from "react";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View, ImageBackground, Button, Platform } from "react-native";

const Index=() => {
  const router = useRouter();
  const handleStart = () => {
    router.push("/review");
  }
  return (
    <>
        <View style={styles.buttonContainer}>
          <Button title="COMENZAR" onPress={handleStart} />
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 'auto',
    marginVertical: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18,
    elevation: 5,
  },
});

export default Index;