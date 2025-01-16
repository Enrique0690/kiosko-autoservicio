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
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const handleAddToCart = () => {
    if (!isScrolledToEnd) return setIsModalVisible(true);
    if (currentProduct) {
      const updatedDynamicLines = dynamicLinesInfo.map((lineInfo) => ({
        ...Object.keys(includedQuantities)
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
        articulosDinamicos: getProductsdynamic(includedQuantities),
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
      router.replace('/menu');
    }
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setIsScrolledToEnd(isAtBottom);
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
      </View>

      <ScrollView style={styles.content} ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handleAddToCart}>
          <Text style={styles.payButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
      <AlertModal visible={isModalVisible} message="mire todos los productos para poder continuar, Desplace hacia abajo" onClose={() => setIsModalVisible(false)}/>
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
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textsecondary,
    marginTop: 16,
    marginBottom: 8,
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
    width: 250,
    height: 250,
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
});

export default DynamicProducts;