import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useDataContext } from "../DataContext";

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
                    <Ionicons name="close-circle-outline" size={70} color='white' />
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
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: Colors.error,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    errorText: {
        fontSize: 36,
        fontWeight: "bold",
        color: Colors.error,
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
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default ErrorScreen;