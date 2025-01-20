import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Lines from '../../components/menu/lines';
import Products from '../../components/menu/products';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { Colors } from '@/constants/Colors';
import Carbar from '@/components/menu/Carbar';
import AlertModal from '@/components/elements/AlertModal';

const Menu = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { totalItems } = useDataContext();
  const [modalVisible, setModalVisible] = useState(false);
  const handleCategoryPress = useCallback((idLinea: number) => {
    setSelectedCategoryId(idLinea);
  }, []);

  return (
    <View style={styles.container}>
      <Header
        leftButtonText="VOLVER"
        leftButtonRoute={'/pedido'}
        rightButtonIcon={'cart-outline'}
        rightButtonRoute={'/menu/shopping-cart'}
        rightButtonText={'VER CARRITO (' + totalItems + ')'}
      />
      <View style={styles.columns}>
        <View style={styles.categoriesColumn}>
          <Lines onCategoryPress={handleCategoryPress} selectedCategoryId={selectedCategoryId} />
        </View>
        <View style={styles.productsColumn}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Products selectedCategoryId={selectedCategoryId} />
          </ScrollView>
        </View>
      </View>

      {totalItems > 0 && (
        <Carbar />
      )}
      <AlertModal
        visible={modalVisible}
        message="El carrito no puede estar vacío, seleccione un producto"
        onClose={() => setModalVisible(false)}
      />
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
    marginBottom: 10,
  },
  categoriesColumn: {
    flex: 1.1,
    marginRight: 15,
    backgroundColor: Colors.neutralWhite,
    padding: 10,
    elevation: 5,
  },
  productsColumn: {
    flex: 2.9,
  },
  scrollContent: {
    paddingBottom: 80,
  },
});

export default Menu;
