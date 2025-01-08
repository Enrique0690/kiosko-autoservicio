import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  centerComponent?: React.ReactNode; // Permite un componente personalizado en el centro
  rightComponent?: React.ReactNode; // Permite un componente personalizado a la derecha
}

const Header = ({ centerComponent, rightComponent }: HeaderProps) => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerItem} onPress={handleBackPress}>
        <Ionicons name='arrow-back' size={24} color='#fff' />
        <Text style={styles.headerText}>Volver</Text>
      </TouchableOpacity>
      <View style={styles.centerContainer}>
        {centerComponent || (
          <Image
            source={{ uri: 'https://i.postimg.cc/yYqJJvYZ/tuitui.png' }}
            style={styles.logo}
          />
        )}
      </View>
      <View style={styles.headerItem}>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#388E3C',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B1D0B0',
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});

export default Header;