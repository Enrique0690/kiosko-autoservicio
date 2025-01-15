import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDataContext } from '@/components/DataContext/datacontext';
import ProductImage from './productimage';
import { Colors } from '@/constants/Colors';

const Lines = ({ onCategoryPress,   selectedCategoryId}: {
  onCategoryPress: (id: number) => void;
  selectedCategoryId: number | null;
}) => {
  const { lines } = useDataContext();
  const filteredLines = lines.filter((line) => line.usarEnVentas);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredLines.map((item, index) => (
          <View key={item.id} style={styles.categoryWrapper}>
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => onCategoryPress(item.id)}
            >
              <ProductImage descripcion={item.descripcion} style={styles.categoryImage} baseUrl='https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/Lineas/' />

              <Text
                style={[
                  styles.categoryText,
                  item.id === selectedCategoryId && styles.selectedCategoryText,
                ]}
              >
                {item.descripcion}
              </Text>
            </TouchableOpacity>
            {index < filteredLines.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textsecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  categoryWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 10,
    width: '100%',
  },
  categoryImage: {
    width: 110,
    height: 110,
    borderRadius: 55, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0', 
  },
  selectedCategoryImage: {
    borderColor: '#BDECB6', 
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  selectedCategoryText: {
    fontWeight: '600', // Negrita para la categoría seleccionada
    color: '#006400', // Verde oscuro elegante
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: '#E0E0E0', // Línea sutil y elegante
    marginVertical: 10,
  },
});

export default Lines;
