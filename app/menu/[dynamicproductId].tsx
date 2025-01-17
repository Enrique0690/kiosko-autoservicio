import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import ProductImage from '@/components/menu/productimage';
import ProductListDynamic from '@/components/menu/productlistdynamic';
import { Colors } from '@/constants/Colors';
import AlertModal from '@/components/elements/AlertModal';

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
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const getProductsdynamic = (quantities: Record<number, number>) => {
    return Object.keys(quantities)
      .map((productId) => {
        const product = products.find((p) => p.id === Number(productId));
        if (product) {
          return {
            ...product,
            pvpSeleccionado: "pvp1",
            cantidad: quantities[Number(productId)],
            __cantidad: quantities[Number(productId)],
            _visualCantidad: quantities[Number(productId)],
            _pagaIva: true,
            __pvp1: product.pvp1,
          };
        }
        return null;
      })
      .filter((item) => item !== null);
  };

  const validateIncludedProducts = () => {
    return dynamicLinesInfo.every((line) => {
      const selectedQuantity = Object.keys(includedQuantities)
        .filter((productId) =>
          line.products.some((p: any) => p.id === Number(productId))
        )
        .reduce((acc, productId) => acc + includedQuantities[Number(productId)], 0);

      return selectedQuantity >= line.cantidadIncluye;
    });
  };

  const handleAddToCart = () => {
    if (!validateIncludedProducts()) return setIsModalVisible(true);
    if (currentProduct) {
      const mainProduct = {
        ...currentProduct,
        articulosDinamicos: getProductsdynamic(includedQuantities),
        dinamico: true,
        pvpSeleccionado: 'pvp1',
      };

      const itemsToAdd = getProductsdynamic(extraQuantities)
      addToCart(mainProduct);
      itemsToAdd.forEach(item => addToCart(item));
      router.replace('/menu');
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
        <TouchableOpacity style={styles.headerItem} onPress={() => router.replace('/menu')}>
          <Ionicons name="arrow-back" size={35} color={Colors.primary} />
          <Text style={styles.headerText}>{currentProduct.descripcion}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={handleAddToCart}>
          <Text style={styles.headerText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <ProductImage descripcion={currentProduct.descripcion} style={styles.productImage} baseUrl='https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/' />
        </View>
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
        <View style={styles.footer}>
          <TouchableOpacity style={styles.payButton} onPress={handleAddToCart}>
            <Text style={styles.payButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AlertModal visible={isModalVisible} message="Seleccione los productos obligatorios" onClose={() => setIsModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutralWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    height: 80,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.primary,
    fontSize: 23,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 1,
  },
  imageContainer: {
    width: '100%',
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
    fontSize: 25,
    fontWeight: '600',
    color: Colors.textsecondary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  payButton: {
    backgroundColor: Colors.secondary,
    padding: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  payButtonText: {
    color: Colors.primary,
    fontSize: 23,
    fontWeight: 'bold',
  },
  productImage: {
    marginVertical: 80,
    width: 500,
    height: 500,
    marginBottom: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  continueButton: {
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
  },
});

export default DynamicProducts;