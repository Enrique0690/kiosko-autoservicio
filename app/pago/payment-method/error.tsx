import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useDataContext } from "../../../components/DataContext";

const ErrorScreen = () => {
    const router = useRouter();
    const { clearCart, stopTimer } = useDataContext();

    const handleRetry = () => {
        clearCart();
        stopTimer();
        router.replace("/");
    };

    return (
        <View style={styles.container}>
            <View style={styles.errorContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="close-circle-outline" size={100} color='white' />
                </View>
                <Text style={styles.errorText}>¡Vaya!</Text>

                <View style={styles.detailsContainer}>
                    <Text style={styles.instructionText}>Hubo un problema con tu pedido.</Text>
                    <Text style={styles.instructionText}>Acercate a caja y pide asistencia.</Text>
                </View>

                <View style={styles.separator} />

                <Text style={styles.helpText}>Pide ayuda a un encargado.</Text>
            </View>

            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
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
    errorContainer: {
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
    errorText: {
        fontSize: 40,
        fontWeight: "bold",
        color: Colors.error,
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
    separator: {
        width: "60%",
        height: 1,
        backgroundColor: "#dee2e6",
        marginVertical: 15,
    },
    helpText: {
        fontSize: 34,
        textAlign: "center",
        color: Colors.error,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
    },
    retryButtonText: {
        color: Colors.primary,
        fontSize: 30
    },
});

export default ErrorScreen;