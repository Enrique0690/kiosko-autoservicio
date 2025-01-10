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
  const handleAddToCart = () => {
    if (currentProduct) {
      // Construimos un nuevo objeto con las líneas dinámicas reemplazadas
      const updatedDynamicLines = dynamicLinesInfo.map((lineInfo) => ({
        id: lineInfo.products[0]?.idLinea, // Asegúrate de usar el ID correcto de la línea
        productos: Object.keys(includedQuantities)
          .filter((productId) =>
            lineInfo.products.some((p: { id: number }) => p.id === Number(productId))
          )
          .map((productId) => {
            const product = products.find(p => p.id === Number(productId));
            if (product) {
              return {
                id: product.id,
                idLinea: product.idLinea,
                codigo: product.codigo,
                descripcion: product.descripcion,
                pvp1: product.pvp1,
                cantidad: includedQuantities[Number(productId)],  
              };
            }
            return null;
          })
          .filter(item => item !== null),
      }));
  
      const mainProduct = {
        ...currentProduct,
        dinamicoLineas: updatedDynamicLines, 
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
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerItem} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
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
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  dynamicLineContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#388E3C',
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
    width: 120,
    height: 120,
    marginVertical: 16,
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#388E3C',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DynamicProducts;