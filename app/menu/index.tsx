import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Lines from '../../components/menu/lines';
import Products from '../../components/menu/products';
import ShoppingCart from '../../components/menu/shopping-cart';
import { useDataContext } from "@/components/menu/datacontext";

const MenuScreen=() => {
  const {cart, addToCart, total } = useDataContext();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const categoryRefs = useRef<{ [key: string]: any }>({}); 

  const handleCategoryPress = (idLinea: number) => {
    const ref = categoryRefs.current[idLinea];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth' });  
    }
    setSelectedCategoryId(idLinea);
  };
  const handleProductSelect = (product: { id: number; descripcion: string; pvp1: number }) => {
    addToCart(product);
  };

  const handlePay = () => {
    alert('Pago realizado');
  };

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    let currentCategoryId: number | null = null;
    Object.keys(categoryRefs.current).forEach(id => {
      const ref = categoryRefs.current[id];
      if (ref) {
        const { y, height } = ref?.getBoundingClientRect();
        if (y >= 0 && y <= height) {
          currentCategoryId = parseInt(id);
        }
      }
    });

    if (currentCategoryId !== null && currentCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(currentCategoryId); 
    }
  };

  return (
    <View style={styles.container}>
      <Lines onCategoryPress={handleCategoryPress} selectedCategoryId={selectedCategoryId}/>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <Products categoryRefs={categoryRefs} onProductSelect={handleProductSelect} />
        {cart.length > 0 && <View style={styles.cartSpacer} />}
      </ScrollView>
      {cart.length > 0 && <ShoppingCart items={cart} total={total} onPay={handlePay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cartSpacer: {
    height: 40, 
  },
});

export default MenuScreen;