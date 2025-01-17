import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useDataContext } from "@/components/DataContext/datacontext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const Success = () => {
  const router = useRouter();
  const { stopTimer, clearCart, total, orderDetails } = useDataContext();

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
        <Text style={styles.successText}>¡Listo!</Text>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.instructionText}>Retira tu recibo y acércate a recibir tu producto.</Text>
          <Text style={styles.instructionText}>Tu número de pedido es: <Text style={styles.boldText}>{orderDetails.orderNumber}</Text></Text>
          <Text style={styles.instructionText}>Método de pago: <Text style={styles.boldText}>{orderDetails.formapago}</Text></Text>
          <Text style={styles.instructionText}>Valor a cancelar: <Text style={styles.boldText}>{total.toFixed(2)} $</Text></Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.thanksText}>¡Gracias por tu compra!</Text>
      </View>
      
      <TouchableOpacity style={styles.newOrderButton} onPress={handleNewOrder}>
        <Text style={styles.newOrderButtonText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.neutralWhite,
    padding: 20,
  },
  successContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
    maxWidth: 500,
    paddingHorizontal: 20,
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
  successText: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.neutralGray,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.text,
    marginVertical: 5,
  },
  boldText: {
    fontWeight: "bold",
    color: Colors.textsecondary,
  },
  separator: {
    width: "60%",
    height: 1,
    backgroundColor: "#dee2e6",
    marginVertical: 15,
  },
  thanksText: {
    fontSize: 34,
    textAlign: "center",
    color: Colors.secondary,
    marginBottom: 20,
  },
  newOrderButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  newOrderButtonText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Success;