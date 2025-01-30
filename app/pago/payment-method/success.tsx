import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useDataContext } from "@/components/DataContext/datacontext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import CurrencySymbol from "@/components/menu/CurrencySymbol";
import Typography from "@/components/elements/Typography";

const Success = () => {
  const router = useRouter();
  const { stopTimer, clearCart, total, orderDetails } = useDataContext();
  const [ counter, setCounter ] = useState(30000);

  const handleNewOrder = () => {
    clearCart();
    stopTimer();
    router.replace('/');
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
          <Ionicons name='checkmark-circle-outline' size={100} color={Colors.primary} />
        </View>
        <Typography variant='title' color={Colors.primary} t='¡LISTO!' />
        
        <View style={styles.detailsContainer}>
          <Typography variant='body' color={Colors.text} t='Retira tu recibo y acércate a recibir tu producto.' />
          <View style={styles.separator} />
          <Typography variant='body' color={Colors.text} t='Tu numero de pedido es:' />
          <Typography variant='subtitle' color={Colors.text} t={orderDetails.orderNumber} />
        </View>
      </View>
      
      <TouchableOpacity style={styles.newOrderButton} onPress={handleNewOrder}>
        <Typography variant='subtitle' color={Colors.secondary} t='Nuevo pedido' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutralWhite,
    padding: 20,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 8,
    borderColor: Colors.success,
    borderWidth: 5,
    boxShadow: '15px 10px 10px rgba(0, 0, 0, 0.2)',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: '60%',
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 15,
  },
  newOrderButton: {
    backgroundColor: Colors.success,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  newOrderButtonText: {
    color: Colors.secondary,
    fontSize: 30,
  },
});

export default Success;