import React, { useRef, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import ProductImage from './productimage';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import CurrencySymbol from './CurrencySymbol';
import Typography from '../elements/Typography';
import QuantityControls from '../elements/QuantityControls';

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
      {shouldShowArrows ? (
        <TouchableOpacity
          style={[styles.arrowButton, isAtStart && styles.disabledButton, !isAtStart && { width: 40 }]}
          onPress={() => scrollBy('left')}
          disabled={isAtStart}
        >
          <Ionicons name="chevron-back" size={32} color={isAtStart ? Colors.neutralGray : Colors.textsecondary} />
        </TouchableOpacity>
      ): (
        <View style={[styles.arrowButton, { minWidth: 40 }]} /> 
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
              <ProductImage image={item.image} style={styles.productImage}/>
              <View style={styles.descriptionContainer}>
                <Typography variant='body' color={Colors.text} t={item.descripcion} />
              </View>
              {type === 'extra' && (
                <Typography variant='body' color={Colors.text} t={`$${(item.pvp1).toFixed(2)}`} />
              )}
              <View style={styles.quantityContainer}>
                <QuantityControls
                  quantity={
                    type === 'included'
                      ? includedQuantities[item.id] || 0
                      : extraQuantities[item.id] || 0
                  }
                  onIncrease={() => handleQuantityChange(item.id, 1, type)}
                  onDecrease={() => handleQuantityChange(item.id, -1, type)}
                  disabled={isDisabled}
                  cantidadIncluye={lineInfo.cantidadIncluye}
                  type={type}
                />
              </View>
            </View>
          );
        }}
      />
      {shouldShowArrows ? (
        <TouchableOpacity
          style={[styles.arrowButton, isAtEnd && styles.disabledButton, !isAtEnd && { width: 40 }]}
          onPress={() => scrollBy('right')}
          disabled={isAtEnd}
        >
          <Ionicons name="chevron-forward" size={32} color={isAtEnd ? Colors.neutralGray : Colors.textsecondary} />
        </TouchableOpacity>
      ): (
        <View style={[styles.arrowButton]} /> 
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
    aspectRatio: 1,
    resizeMode: 'contain',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  descriptionContainer: {
    width: '80%',
    height: 50,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
});

export default ProductListDynamic;
