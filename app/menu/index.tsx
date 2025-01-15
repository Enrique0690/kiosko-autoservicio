import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Lines from '../../components/menu/lines';
import Products from '../../components/menu/products';
import { useRouter } from 'expo-router';
import { useDataContext } from '@/components/DataContext/datacontext';
import Header from '@/components/header';
import { Colors } from '@/constants/Colors';

const Menu = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { totalItems } = useDataContext();
  const router = useRouter();

  const handleCategoryPress = useCallback((idLinea: number) => {
    setSelectedCategoryId(idLinea);
  }, []);
  
  return (
    <View style={styles.container}>
      <Header
        rightComponent={
          <TouchableOpacity style={styles.headerItem} onPress={() => router.push('/menu/shopping-cart')}>
            <Ionicons name="cart" size={24} color= {Colors.text} />
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
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push('/menu/shopping-cart')}
        >
          <View style={styles.innerCircle}>
            <Ionicons name="cart-outline" size={22} color="#4CAF50" />
            <Text style={styles.buttonText}>Ver carrito</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
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
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
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
  cartSpacer: {
    height: 20,
  },
  categoryItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 12,
    elevation: 3,
  },
  categoryItemSelected: {
    backgroundColor: '#4C6D3C',
    elevation: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombras suaves para dar profundidad
    borderRadius: 60, // Para mantener el círculo perfectamente redondeado
    overflow: 'hidden',
  },
  innerCircle: {
    width: 140, // Ajustamos el tamaño para hacerlo más visible
    height: 140,
    borderRadius: 70, // Círculo perfecto
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Fondo blanco para un look más limpio
    borderWidth: 4, // Borde más grueso para más presencia
    borderColor: '#4CAF50', // Borde verde suave
    position: 'relative',
    padding: 10, // Espaciado para que todo se vea equilibrado
    flexDirection: 'column', // Coloca los elementos en una columna
  },
  buttonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
    letterSpacing: 0.5,
  },
  badge: {
    position: 'absolute',
    top: 25, // Posicionamos el contador en la parte superior
    right: 35, // Lo alineamos a la derecha
    backgroundColor: '#FF4081', // Color vibrante para el badge
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Menu;
