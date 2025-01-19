import React, { useRef, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Dimensions, PanResponder } from 'react-native';
import ProductImage from './productimage';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import CurrencySymbol from './CurrencySymbol';

const ProductListDynamic = ({   lineInfo,   type,   includedQuantities,   extraQuantities,   handleQuantityChange
}: any) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentOffset, setCurrentOffset] = useState(0); 
  const productWidth = 210; 
  const visibleWidth = Dimensions.get('window').width - 80; 
  const productsPerPage = Math.floor(visibleWidth / productWidth);
  const scrollLeft = () => {
    const newOffset = Math.max(0, currentOffset - productWidth * productsPerPage);
    flatListRef.current?.scrollToOffset({ offset: newOffset, animated: true });
    setCurrentOffset(newOffset);
  };
  const scrollRight = () => {
    const maxOffset = Math.max(0, lineInfo.products.length * productWidth - visibleWidth);
    const newOffset = Math.min(maxOffset, currentOffset + productWidth * productsPerPage);
    flatListRef.current?.scrollToOffset({ offset: newOffset, animated: true });
    setCurrentOffset(newOffset);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx > 0) {
          scrollLeft();
        } else if (gestureState.dx < 0) {
          scrollRight();
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const isLineLimitReached = (lineDescription: string) => {
    const lineQuantities = lineInfo.products
      .filter((product: any) => product.lineDescription === lineDescription)
      .map((product: any) => includedQuantities[product.id] || 0);
    
    const totalQuantity = lineQuantities.reduce((acc: number, qty: number) => acc + qty, 0);
    return totalQuantity >= lineInfo.cantidadIncluye;
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.arrowButton} onPress={scrollLeft}>
        <Ionicons name="chevron-back" size={32} color={Colors.textsecondary} />
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={lineInfo.products}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        snapToInterval={250} 
        decelerationRate="fast" 
        renderItem={({ item }) => {
          const isSelected = type === 'included' && (includedQuantities[item.id] || 0) > 0;
          const isLineLimitReachedForProduct = isLineLimitReached(item.lineDescription); 
          const isDisabled = type === 'included' && isLineLimitReachedForProduct && !isSelected; 

          return (
            <View style={[styles.productContainer, isDisabled && styles.disabledProduct]}>
              <ProductImage
                descripcion={item.descripcion}
                style={styles.productImage}
                baseUrl='https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/'
              />
              <Text style={styles.productName}>{item.descripcion}</Text>
              {type === 'extra' && <Text style={styles.productPrice}><CurrencySymbol />{item.pvp1.toFixed(2)}</Text>}
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.id, -1, type)}
                  style={styles.quantityButton}>
                  <Ionicons name="remove-outline" size={20} color={Colors.textsecondary} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {type === 'included' ? includedQuantities[item.id] || 0 : extraQuantities[item.id] || 0}
                </Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.id, 1, type)}
                  style={styles.quantityButton}>
                  <Ionicons name="add-outline" size={20} color={Colors.textsecondary} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      <TouchableOpacity style={styles.arrowButton} onPress={scrollRight}>
        <Ionicons name="chevron-forward" size={32} color={Colors.textsecondary} />
      </TouchableOpacity>
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
    marginHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 20,
    elevation: 8,
    backgroundColor: '#fff',
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2)',
    width: 200, 
    overflow: 'hidden',
  },
  disabledProduct: {
    backgroundColor: '#D3D3D3', 
    opacity: 0.5, 
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textsecondary,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textsecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    bottom: '1%',
  },
  quantityButton: {
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 1,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textsecondary,
  },
  arrowButton: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductListDynamic;