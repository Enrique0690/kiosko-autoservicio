import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useDataContext } from "@/components/DataContext/datacontext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const Success = () => {
  const router = useRouter();
  const { stopTimer, clearCart, total, orderDetails } = useDataContext();
  const [ counter, setCounter ] = useState(30000);

  const handleNewOrder = () => {
    clearCart();
    stopTimer();
    router.replace("/");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(interval);
          handleNewOrder(); 
        }
        return prevCounter - 1;
      });
    }, 1000);
    return () => clearInterval(interval); 
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle-outline" size={100} color={Colors.primary} />
        </View>
        <Text style={styles.successText}>¡LISTO!</Text>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.instructionText}>Retira tu recibo y acércate a recibir tu producto.</Text>
          <View style={styles.separator} />
          <Text style={styles.instructionText}>Tu número de pedido es: <Text style={styles.boldText}>{orderDetails.orderNumber}</Text></Text>
          <Text style={styles.instructionText}>Método de pago: <Text style={styles.boldText}>{orderDetails.formapago}</Text></Text>
          <Text style={styles.instructionText}>Valor a cancelar: <Text style={styles.boldText}>$ {total.toFixed(2)} </Text></Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.thanksText}>¡GRACIAS POR TU COMPRA!</Text>
      </View>
      
      <TouchableOpacity style={styles.newOrderButton} onPress={handleNewOrder}>
        <Text style={styles.newOrderButtonText}>FINALIZAR</Text>
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
    paddingVertical: 40,
    borderRadius: 8,
    borderColor: Colors.secondary,
    borderWidth: 5,
    boxShadow: "15px 10px 10px rgba(0, 0, 0, 0.2)",
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#28a745",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successText: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: {
    fontSize: 25,
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
    fontSize: 35,
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
    fontSize: 30,
  },
});

export default Success;