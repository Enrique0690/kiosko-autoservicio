import React from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDataContext } from "@/components/DataContext/datacontext";
import { Colors } from "@/constants/Colors";
import IconButton from "@/components/elements/IconButton";

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
    console.log('Iniciando temporizador...');
    startTimer();
    setOrderDetails((prevDetails: any) => ({
      ...prevDetails,
      formaDespacho: 'llevar',
    }));
    router.replace("/menu");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo deseas disfrutar tu comida?</Text>
      <View style={styles.optionsContainer}>
        <IconButton iconName="restaurant-outline" text="Comer aquí" onPress={handleComerAqui} />
        <IconButton iconName="bag-outline" text="Para llevar" onPress={handleParaLlevar} />
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
  title: {
    fontSize: 60,
    fontWeight: "700", 
    color: Colors.textsecondary,
    marginBottom: 50,
    textAlign: "center",
    letterSpacing: 1.5, 
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