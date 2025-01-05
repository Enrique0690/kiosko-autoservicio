import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Lines from '../../components/menu/lines';
import Products from '../../components/menu/products';
import ShoppingCart from '../../components/menu/shopping-cart';
import { useDataContext } from "@/components/menu/datacontext";

const MenuScreen=() => {
  const {cart, total } = useDataContext();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const categoryRefs = useRef<{ [key: string]: any }>({}); 

  const handleCategoryPress = (idLinea: number) => {
    const ref = categoryRefs.current[idLinea];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth' });  
    }
    setSelectedCategoryId(idLinea);
  };

  const handleScroll = (event: any) => {
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
        <Products categoryRefs={categoryRefs} />
      </ScrollView>
      <ShoppingCart/>
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