import React from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDataContext } from "@/components/DataContext/datacontext";

const Pedido = () => {
  const router = useRouter();
  const { startTimer, setOrderDetails } = useDataContext();

  const handleComerAqui = () => {
    startTimer();
    setOrderDetails((prevDetails: any) => ({
      ...prevDetails,
      formaDespacho: 'llevar',
    }));
    router.push("/menu");
  };

  const handleParaLlevar = () => {
    console.log('Iniciando temporizador...');
    startTimer();
    setOrderDetails((prevDetails: any) => ({
      ...prevDetails,
      formaDespacho: 'mesa',
    }));
    router.push("/menu");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo deseas disfrutar tu comida?</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={handleComerAqui}>
          <Ionicons name="restaurant-outline" size={70} color="#fff" />
          <Text style={styles.buttonText}>Comer Aquí</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={handleParaLlevar}>
          <Ionicons name="bag-outline" size={70} color="#fff" />
          <Text style={styles.buttonText}>Para Llevar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700", 
    color: "#333",
    marginBottom: 50,
    textAlign: "center",
    letterSpacing: 1.5, 
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    maxWidth: 800,
    paddingHorizontal: 20,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#4CAF50", 
    paddingVertical: 25,
    borderRadius: 20,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600", 
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default Pedido;