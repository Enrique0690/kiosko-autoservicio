import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

const Completed = () => {
  const router = useRouter();

  const handleNewOrder = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.checkmark}>✔️</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#6c757d",
  },
  newOrderButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  newOrderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Completed;
