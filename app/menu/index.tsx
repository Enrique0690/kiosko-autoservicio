import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Lines from '../../components/menu/lines';
import Products from '../../components/menu/products';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { Colors } from '@/constants/Colors';
import Carbar from '@/components/menu/Carbar';
import AlertModal from '@/components/elements/AlertModal';

const Menu = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { totalItems } = useDataContext();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const handleCategoryPress = useCallback((idLinea: number) => {
    setSelectedCategoryId(idLinea);
  }, []);
  const handleContinue = () => {
    if (totalItems === 0) {
      setModalVisible(true);
    }
    else {
      router.replace('/menu/shopping-cart');
    }
  }

  return (
    <View style={styles.container}>
      <Header
        leftButtonText="Volver"
        leftButtonRoute={'/review'}
        rightComponent={
          <TouchableOpacity style={styles.headerItem} onPress={handleContinue}>
            <Ionicons name="cart" size={24} color={Colors.text} />
            <Text style={styles.totalText}> Ver carrito ({totalItems}) </Text>
          </TouchableOpacity>
        }
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
  totalText: {
    color: Colors.text,
    fontSize: 23,
    fontWeight: '600',
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
