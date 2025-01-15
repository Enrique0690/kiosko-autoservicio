import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  centerComponent?: React.ReactNode; 
  rightComponent?: React.ReactNode; 
  leftButtonText?: string; 
  leftButtonRoute?: any;
}

const Header = ({ centerComponent, rightComponent, leftButtonText, leftButtonRoute }: HeaderProps) => {
  const router = useRouter();

  const handleBackPress = () => {
    router.replace(leftButtonRoute);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerItem} onPress={handleBackPress}>
        <Ionicons name='arrow-back' size={35} color={Colors.primary} />
        <Text style={styles.headerText}>{leftButtonText}</Text> 
      </TouchableOpacity>
      <View style={styles.centerContainer}>
        {centerComponent || (
          <Image
            source={{ uri: 'https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/logo.png' }}
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
    height: 80,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.primary,
    fontSize: 25,
    fontWeight: '700',
    marginLeft: 5,
    letterSpacing: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
  },
});

export default Header;