import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useDataContext } from "@/components/DataContext/datacontext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
const Completed = () => {
  const router = useRouter();
  const { stopTimer, clearCart } = useDataContext();
  const handleNewOrder = () => {
    clearCart();
    stopTimer();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle-outline" size={70} color={Colors.primary} />
        </View>
        <Text style={styles.successText}>Listo!</Text>
        <Text style={styles.instructionText}>
          Retira tu recibo y acercate a recibir tu producto
        </Text>
      </View>
      <TouchableOpacity style={styles.newOrderButton} onPress={handleNewOrder}>
        <Text style={styles.newOrderButtonText}>Nuevo Pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  successContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#28a745",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkmark: {
    color: "#fff",
    fontSize: 40,
  },
  successText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 23,
    textAlign: "center",
    color: "#6c757d",
  },
  newOrderButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  newOrderButtonText: {
    color: Colors.primary,
    fontSize: 23,
    fontWeight: "bold",
  },
});

export default Completed;
