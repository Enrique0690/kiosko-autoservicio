import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDataContext } from "@/components/menu/datacontext";

const Lines = ({ onCategoryPress, selectedCategoryId}: { onCategoryPress: (id: number) => void; selectedCategoryId: number | null }) => {
  const { lines } = useDataContext();
  const filteredLines = lines.filter((line) => line.usarEnVentas); 

  return (
    <View>
      <FlatList
        data={filteredLines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={[
              styles.item,
              item.id === selectedCategoryId && styles.selectedItem, 
            ]}
            onPress={() => onCategoryPress(item.id)}
          >
            <Text style={styles.text}>{item.descripcion}</Text>
          </TouchableOpacity>
        )}
        horizontal
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedItem: {
    backgroundColor: '#A8E6CF',
  },
});

export default Lines;
