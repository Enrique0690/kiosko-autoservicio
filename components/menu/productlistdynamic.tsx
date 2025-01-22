import React, { useRef, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import ProductImage from './productimage';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import CurrencySymbol from './CurrencySymbol';

const ProductListDynamic = ({
  lineInfo,
  type,
  includedQuantities,
  extraQuantities,
  handleQuantityChange,
}: any) => {
  const flatListRef = useRef<FlatList>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const productWidth = 210;
  const visibleWidth = Dimensions.get('window').width - 80;
  const productsPerPage = Math.floor(visibleWidth / productWidth);

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const maxOffset = contentWidth - visibleWidth;
    setScrollOffset(offset);
    setIsAtStart(offset <= 0);
    setIsAtEnd(offset >= maxOffset);
  };

  const scrollBy = (direction: 'left' | 'right') => {
    const newOffset =
      direction === 'left'
        ? Math.max(0, scrollOffset - productWidth * productsPerPage)
        : Math.min(scrollOffset + productWidth * productsPerPage, scrollOffset + visibleWidth);
    flatListRef.current?.scrollToOffset({ offset: newOffset, animated: true });
  };

  const isLineLimitReached = (lineDescription: string) => {
    const lineQuantities = lineInfo.products
      .filter((product: any) => product.lineDescription === lineDescription)
      .map((product: any) => includedQuantities[product.id] || 0);
    const totalQuantity = lineQuantities.reduce((acc: number, qty: number) => acc + qty, 0);
    return totalQuantity >= lineInfo.cantidadIncluye;
  };

  const shouldShowArrows = lineInfo.products.length > productsPerPage;

  return (
    <View style={styles.container}>
      {shouldShowArrows && (
        <TouchableOpacity
          style={[styles.arrowButton, isAtStart && styles.disabledButton]}
          onPress={() => scrollBy('left')}
          disabled={isAtStart}
        >
          <Ionicons name="chevron-back" size={32} color={isAtStart ? Colors.neutralGray : Colors.textsecondary} />
        </TouchableOpacity>
      )}
      <FlatList
        ref={flatListRef}
        data={lineInfo.products}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        snapToInterval={productWidth}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          const isSelected = type === 'included' && (includedQuantities[item.id] || 0) > 0;
          const isLineLimitReachedForProduct = isLineLimitReached(item.lineDescription);
          const isDisabled = type === 'included' && isLineLimitReachedForProduct && !isSelected;

          return (
            <View style={[styles.productContainer, isDisabled && styles.disabledProduct]}>
              <ProductImage
                descripcion={item.descripcion}
                style={styles.productImage}
                baseUrl="https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/"
              />
              <Text style={styles.productName}>{item.descripcion}</Text>
              {type === 'extra' && (
                <Text style={styles.productPrice}>
                  <CurrencySymbol />
                  {item.pvp1.toFixed(2)}
                </Text>
              )}
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.id, -1, type)}
                  style={styles.quantityButton}
                >
                  <Ionicons name="remove-outline" size={20} color={Colors.textsecondary} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {type === 'included' ? includedQuantities[item.id] || 0 : extraQuantities[item.id] || 0}
                </Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.id, 1, type)}
                  style={styles.quantityButton}
                >
                  <Ionicons name="add-outline" size={20} color={Colors.textsecondary} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      {shouldShowArrows && (
        <TouchableOpacity
          style={[styles.arrowButton, isAtEnd && styles.disabledButton]}
          onPress={() => scrollBy('right')}
          disabled={isAtEnd}
        >
          <Ionicons name="chevron-forward" size={32} color={isAtEnd ? Colors.neutralGray : Colors.textsecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  productContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 8,
    elevation: 8,
    backgroundColor: '#fff',
    width: 200, 
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  productImage: {
    width: '100%', 
    aspectRatio: 1.5, 
    resizeMode: 'contain', 
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  productName: {
    fontSize: 18,
    marginTop: 2,
    color: Colors.textsecondary,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 18,
    color: Colors.textsecondary,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    marginHorizontal: 8,
    borderRadius: 8,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    color: Colors.textsecondary,
  },
  arrowButton: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledProduct: {
    backgroundColor: '#D3D3D3',
    opacity: 0.5,
  },
});

export default ProductListDynamic;
