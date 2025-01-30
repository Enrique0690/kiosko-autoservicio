import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import ProductImage from '@/components/menu/productimage';
import ProductListDynamic from '@/components/menu/productlistdynamic';
import { Colors } from '@/constants/Colors';
import Typography from '@/components/elements/Typography';
import useQuantityChange from '@/components/dynamic/useQuantityChange';
import useGetProductsdynamic from '@/components/dynamic/useGetProductsdynamic';
import useValidateDynamicLines from '@/components/dynamic/useValidateDynamicLines';

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
  const [missingLines, setMissingLines] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const { getProductsdynamic } = useGetProductsdynamic(products);
  const { validateDynamicLines } = useValidateDynamicLines(dynamicLinesInfo, includedQuantities, setMissingLines);
  const { handleQuantityChange } = useQuantityChange(dynamicLinesInfo, includedQuantities, extraQuantities, setIncludedQuantities, setExtraQuantities);

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

  useEffect(() => {
    const incompleteLines: number[] = [];
    dynamicLinesInfo.forEach((line, index) => {
      const selectedQuantity = Object.keys(includedQuantities)
        .filter((productId) =>
          line.products.some((p: any) => p.id === Number(productId))
        )
        .reduce((acc, productId) => acc + includedQuantities[Number(productId)], 0);
      if (selectedQuantity < line.cantidadIncluye) {
        incompleteLines.push(index);
      }
    });
    setMissingLines(incompleteLines);
  }, [includedQuantities, dynamicLinesInfo]);

  const handleAddToCart = () => {
    const isValid = validateDynamicLines();
    if (!isValid) return setShowFeedback(true);

    if (currentProduct) {
      const includedProducts = getProductsdynamic(includedQuantities, {});
      const extraProducts = getProductsdynamic(extraQuantities, {});
      const extraTotal = extraProducts.reduce((acc, product) => acc + product.__pvp1 * product.cantidad, 0);
      const mainProduct = {
        ...currentProduct,
        articulosDinamicos: [...includedProducts, ...extraProducts],
        dinamico: true,
        pvpSeleccionado: 'pvp1',
        pvp1: currentProduct.pvp1 + extraTotal,
      };
      addToCart(mainProduct, 1);
      const LineId = currentProduct.idLinea;
      router.replace(`/menu?lineId=${LineId}`);
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
        <TouchableOpacity style={styles.headerItem} onPress={() => {
          const LineId = currentProduct?.idLinea;
          router.replace(`/menu?lineId=${LineId}`);
        }}>
          <Ionicons name="arrow-back" size={40} color={Colors.primary} />
          <Typography variant='subtitle' color={Colors.primary} t={currentProduct.descripcion} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={handleAddToCart}>
          <Typography variant='subtitle' color={Colors.primary} t='CONTINUAR' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <ProductImage descripcion={currentProduct.descripcion} style={styles.productImage} type='articulo' />
        </View>
        {dynamicLinesInfo.map((lineInfo, index) => (
          <View
            key={index}
            style={[
              styles.dynamicLineContainer,
              missingLines.includes(index) && showFeedback && styles.missingLine,
            ]}
          >
            <Typography variant='subtitle' color={Colors.textsecondary} t={`Incluye ${lineInfo.lineDescription} - ${lineInfo.cantidadIncluye} (obligatorio)`} />
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
            <Typography variant='subtitle' color={Colors.textsecondary} t={`Extras ${lineInfo.lineDescription}`} />
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
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  payButtonText: {
    color: Colors.secondary,
    fontSize: 23,
    fontWeight: 'bold',
  },
  productImage: {
    marginVertical: 80,
    width: 400,
    height: 400,
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
  missingLine: {
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
  },
});

export default DynamicProducts;