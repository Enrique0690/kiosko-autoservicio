import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDataContext } from '@/components/DataContext/datacontext';
import ProductImage from './productimage';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';

const Lines = ({ onCategoryPress, selectedCategoryId }: { 
  onCategoryPress: (id: number) => void;
  selectedCategoryId: number | null;
}) => {
  const { lines } = useDataContext();
  const filteredLines = lines.filter((line) => line.usarEnVentas);
  
  const { lineId } = useLocalSearchParams();
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  useEffect(() => {
    if (lineId) {
      setSelectedLine(Number(lineId));
    } else {
      setSelectedLine(filteredLines.length > 0 ? filteredLines[0].id : null);
    }
  }, [lineId, filteredLines]);

  useEffect(() => {
    if (selectedLine !== null) {
      onCategoryPress(selectedLine);
    }
  }, [selectedLine, onCategoryPress]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredLines.map((item) => (
          <View key={item.id} style={styles.categoryWrapper}>
            <TouchableOpacity
              style={[
                styles.categoryItem,
                item.id === selectedCategoryId && styles.selectedCategoryItem
              ]}
              onPress={() => onCategoryPress(item.id)}
            >
              <ProductImage
                descripcion={item.descripcion}
                style={styles.categoryImage}
                baseUrl='https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/Lineas/'
              />
              <Text
                style={[
                  styles.categoryText,
                  item.id === selectedCategoryId && styles.selectedCategoryText,
                ]}
              >
                {item.descripcion}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'transparent',
  },
  selectedCategoryItem: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    marginLeft: 45
  },
  categoryImage: {
    width: 150,
    height: 150,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCategoryImage: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 30,
    color: '#555',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: Colors.primary,
  },
});

export default Lines;