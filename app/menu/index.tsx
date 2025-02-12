import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Lines from '../../components/menu/lines';
import Products from '../../components/menu/products';
import { useDataContext } from '@/components/contexts/useDataContext';
import Header from '@/components/header';
import Carbar from '@/components/menu/Carbar';
import { Colors } from '@/constants/Colors';
import AlertModal from '@/components/elements/AlertModal';
import ConfirmModal from '@/components/elements/ConfirmModal';

const Menu = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { totalItems, clearCart } = useDataContext();
  const router = useRouter();
  const [AlertModalVisible, setAlertModalVisible] = useState(false);
  const [ConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const handleCategoryPress = useCallback((idLinea: number) => { setSelectedCategoryId(idLinea); }, []);
  const viewcart = () => {
    if (totalItems === 0) {
      setAlertModalVisible(true);
    } else {
      router.replace('/menu/shopping-cart');
    }
  }
  const back = () => {
    setConfirmModalVisible(true);
  };
  const handleConfirmBack = () => {
    clearCart();
    router.replace('/pedido');
    setConfirmModalVisible(false); 
  };

  return (
    <View style={styles.container}>
      <Header
        leftButtonText="Regresar"
        leftButtonRoute={back}
        centerText="Selecciona tus productos"
        rightButtonIcon={'cart-outline'}
        rightButtonRoute={viewcart}
        rightButtonText={'Ver carrrito (' + totalItems + ')'}
      />
      <View style={styles.columns}>
        <View style={styles.categoriesColumn}>
          <Lines onCategoryPress={handleCategoryPress} selectedCategoryId={selectedCategoryId} />
        </View>
        <View style={styles.productsColumn}>
          <ScrollView>
            <Products selectedCategoryId={selectedCategoryId} />
          </ScrollView>
        </View>
      </View>
      <Carbar />
      <AlertModal visible={AlertModalVisible} message="No hay elementos en el carrito" onClose={() => setAlertModalVisible(false)} />
      <ConfirmModal visible={ConfirmModalVisible} message="¿Deseas regresar? Se vaciará el carrito." onClose={() => setConfirmModalVisible(false)} onConfirm={handleConfirmBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
  },
  categoriesColumn: {
    flex: 0.8,
  },
  productsColumn: {
    flex: 2.9,
    backgroundColor: Colors.background,

  }
});

export default Menu;
