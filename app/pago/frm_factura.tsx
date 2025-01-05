import React from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const frmFactura = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalAmount}>30.00</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="RUC" />
        <TextInput style={styles.input} placeholder="Razon Social" />
        <TextInput style={styles.input} placeholder="Tel" />
        <TextInput style={styles.input} placeholder="Email" />
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={() => router.push("/pago/payment-method")}>
        <Text style={styles.continueButtonText}>Continuar</Text>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  continueButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default frmFactura;