import React from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { useDataContext } from "@/components/DataContext/datacontext";
import { Colors } from "@/constants/Colors";
import IconButton from "@/components/elements/IconButton";
import Typography from "@/components/elements/Typography";
import { Ionicons } from "@expo/vector-icons";

const Pedido = () => {
  const router = useRouter();
  const { startTimer, setOrderDetails } = useDataContext();

  const handleComerAqui = () => {
    startTimer();
    setOrderDetails((prevDetails: any) => ({
      ...prevDetails,
      formaDespacho: 'mesa',
    }));
    router.replace("/menu");
  };

  const handleParaLlevar = () => {
    startTimer();
    setOrderDetails((prevDetails: any) => ({
      ...prevDetails,
      formaDespacho: 'llevar',
    }));
    router.replace("/menu");
  };

  return (
    <View style={styles.container}>
      <Ionicons name="arrow-back" size={35} color={Colors.neutralWhite}  />
      <Typography variant='largest' color={Colors.textsecondary} t='¿Quieres comer aquí o para llevar?' />
      <View style={styles.optionsContainer}>
        <IconButton iconName="restaurant-outline" text="COMER AQUI" onPress={handleComerAqui} />
        <IconButton iconName="bag-outline" text="PARA LLEVAR" onPress={handleParaLlevar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.neutralWhite,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginTop: 150,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  }
});

export default Pedido;