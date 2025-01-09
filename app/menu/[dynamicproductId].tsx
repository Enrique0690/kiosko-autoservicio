import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import ProductImage from '@/components/menu/productimage';
import ProductListDynamic from '@/components/menu/productlistdynamic';

type Quantities = Record<number, number>;

const DynamicProducts = () => {
  const router = useRouter();
  const { dynamicproductId } = useLocalSearchParams();
  const { products, lines, addToCart } = useDataContext();
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [dynamicLinesInfo, setDynamicLinesInfo] = useState<any[]>([]);
  const [includedQuantities, setIncludedQuantities] = useState<Quantities>({});
  const [extraQuantities, setExtraQuantities] = useState<Quantities>({});

  useEffect(() => {
    const product = products.find((p) => p.id === Number(dynamicproductId));
    if (product) {
      setCurrentProduct({
        ...product,
        dinamicoLineas: product.dinamicoLineas || [],
      });
      const linesInfo = product.dinamicoLineas!.map((dynamicLine) => {
        const line = lines.find((l) => l.id === dynamicLine.id);
        const productsForLine = products.filter((p) => p.idLinea === dynamicLine.id && p.habilitado);
        return {
          lineDescription: line ? line.descripcion : 'Sin descripción',
          products: productsForLine,
          cantidadIncluye: dynamicLine.cantidadIncluye, 
        };
      });
      setDynamicLinesInfo(linesInfo);
      setTotal(product.pvp1);
    } else {
      setCurrentProduct(null);
    }
  }, []);

  useEffect(() => {
    let newTotal = currentProduct ? currentProduct.pvp1 : 0;
    Object.keys(extraQuantities).forEach((productId) => {
      const product = products.find((p) => p.id === Number(productId));
      if (product) {
        newTotal += product.pvp1 * extraQuantities[Number(productId)];
      }
    });
    setTotal(newTotal);
  }, [extraQuantities, products, currentProduct]);

  const handleQuantityChange = (productId: number, delta: number, type: 'included' | 'extra') => {
    if (type === 'included') {
      setIncludedQuantities((prevQuantities: Quantities) => {
        const currentQuantity = prevQuantities[productId] || 0;
        const newQuantity = currentQuantity + delta;

        const line = dynamicLinesInfo.find((lineInfo) => lineInfo.products.some((p: unknown) => {
          if (typeof p === 'object' && p !== null && 'id' in p) {
            return (p as { id: number }).id === productId;
          }
          return false;
        }));
        const totalQuantityInLine = Object.keys(prevQuantities)
          .filter((id) => line && line.products.some((p: unknown) => {
            if (typeof p === 'object' && p !== null && 'id' in p) {
              return (p as { id: number }).id === Number(id);
            }
            return false;
          }))
          .reduce((acc, id) => acc + prevQuantities[Number(id)], 0);

        const newTotalQuantityInLine = totalQuantityInLine + (delta > 0 ? 1 : -1);

        if (line && newTotalQuantityInLine <= line.cantidadIncluye) {
          return {
            ...prevQuantities,
            [productId]: newQuantity >= 0 ? newQuantity : 0,
          };
        }
        return prevQuantities; 
      });
    } else {
      setExtraQuantities((prevQuantities: Quantities) => {
        const currentQuantity = prevQuantities[productId] || 0;
        const newQuantity = currentQuantity + delta;

        return {
          ...prevQuantities,
          [productId]: newQuantity >= 0 ? newQuantity : 0,
        };
      });
    }
  };

  const generateMainProductDescription = () => {
    if (!currentProduct) return '';
    const includedDescriptions = currentProduct.dinamicoLineas
      .flatMap((line: any) => { 
        const selectedProductsForLine = products.filter(
          (p) => p.idLinea === line.id && p.habilitado && includedQuantities[p.id] > 0
        );
        return selectedProductsForLine.map((product) => {
          const quantity = includedQuantities[product.id] || 0;
          return `${product.descripcion} x${quantity}`;
        });
      })
      .join(', '); 
    if (includedDescriptions) {
      return `${currentProduct.descripcion} (${includedDescriptions})`;
    }
    return currentProduct.descripcion; 
  };
  

  const handleAddToCart = () => {
    if (currentProduct) {
      const mainProduct = {
        id: currentProduct.id,
        descripcion: generateMainProductDescription(),
        pvp1: currentProduct.pvp1,
        cantidad: 1, 
      };

      const itemsToAdd = Object.keys(extraQuantities)
        .map((productId) => {
          const product = products.find((p) => p.id === Number(productId));
          if (product) {
            return {
              id: product.id,
              descripcion: product.descripcion,
              pvp1: product.pvp1,
              cantidad: extraQuantities[Number(productId)], 
            };
          }
          return null;
        })
        .filter(item => item !== null);

      addToCart(mainProduct);
      itemsToAdd.forEach(item => addToCart(item));
      router.push('/menu');
    }
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerItem} onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color='#fff' />
          <Text style={styles.headerText}>{currentProduct.descripcion}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <ProductImage descripcion={currentProduct.descripcion} style={styles.productImage} />
      </View>

      <ScrollView style={styles.content}>
      {dynamicLinesInfo.map((lineInfo, index) => (
          <View key={index} style={styles.dynamicLineContainer}>
            <Text style={styles.sectionTitle}>Incluye {lineInfo.lineDescription} - {lineInfo.cantidadIncluye} (obligatorio)</Text>
            <ProductListDynamic
              lineInfo={lineInfo}
              type="included"
              includedQuantities={includedQuantities}
              extraQuantities={extraQuantities}
              handleQuantityChange={handleQuantityChange}
            />
          </View>
        ))}
        
        {dynamicLinesInfo.map((lineInfo, index) => (
          <View key={index} style={styles.dynamicLineContainer}>
            <Text style={styles.sectionTitle}>Extras {lineInfo.lineDescription}</Text>
            <ProductListDynamic
              lineInfo={lineInfo}
              type="extra"
              includedQuantities={includedQuantities}
              extraQuantities={extraQuantities}
              handleQuantityChange={handleQuantityChange}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continuar" onPress={handleAddToCart} color="#34C759" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#388E3C',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B1D0B0',
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  dynamicLineContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  productImage: {
    width: 110, 
    height: 110,
    marginVertical: 16,
    borderRadius: 12,
    resizeMode: 'cover',
  },
});

export default DynamicProducts;