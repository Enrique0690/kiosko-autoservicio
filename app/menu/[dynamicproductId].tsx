import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDataContext } from "@/components/menu/datacontext";
import BackButton from '@/components/elements/backbutton';

interface Product {
  id: number;
  descripcion: string;
  idLinea: number;
  pvp1: number;
  habilitado: boolean;
}

const DynamicProducts = () => {
  const router = useRouter();
  const { dynamicproductId } = useLocalSearchParams();
  const { products, lines } = useDataContext();
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [quantities, setQuantities] = React.useState<{ [key: string]: number }>({});

  useEffect(() => {
    const product = products.find((p) => p.id === Number(dynamicproductId));
    if (product) {
      setCurrentProduct({
        ...product,
        dinamicoLineas: product.dinamicoLineas || [],
      });
    } else {
      setCurrentProduct(null);
    }
  }, []);

  const handleIncrease = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrease = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const renderProduct = ({ item }: { item: Product }) => {
    if (!item.habilitado) return null;
    return (
      <View style={styles.itemRow}>
        <Text style={styles.itemName}> {item.descripcion} ({item.pvp1} $)</Text>
        <View style={styles.counter}>
          <TouchableOpacity onPress={() => handleDecrease(item.id)}>
            <Ionicons name="remove-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.itemCount}>{quantities[item.id] || 0}</Text>
          <TouchableOpacity onPress={() => handleIncrease(item.id)}>
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!currentProduct) {
    return (
      <View style={styles.container}>
        <Text>Cargando producto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/placeholder/products.webp')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.productName}>{currentProduct.descripcion}</Text>
        {currentProduct.dinamicoLineas.map((linea: any) => {
          const relatedLine = lines.find((l) => l.id === linea.id);
          const productsForLine = products
            .filter((p) => p.idLinea === linea.id && p.habilitado)
            .map((p) => ({
              ...p,
              descripcion: p.descripcion,
              pvp1: p.pvp1,
            }));
          return (
            <View key={linea.id}>
              <Text style={styles.sectionTitle}> Inlcuye {linea.cantidadIncluye} {relatedLine?.descripcion}</Text>
              <FlatList
                data={productsForLine}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProduct}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.footer}>
        <Button title="Salir" onPress={() => router.back()} color="#000" />
        <Button title="Continuar" onPress={() => { }} color="#34C759" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  content: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default DynamicProducts;