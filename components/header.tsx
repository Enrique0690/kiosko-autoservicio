import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  centerComponent?: React.ReactNode; 
  leftButtonText?: string; 
  leftButtonRoute?: any;
  rightButtonText?: string;
  rightButtonRoute?: any;
  rightButtonIcon?: any;
}

const Header = ({ centerComponent, rightButtonText, rightButtonRoute, rightButtonIcon, leftButtonText, leftButtonRoute }: HeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerItem} onPress={() => router.replace(leftButtonRoute)}>
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
      <TouchableOpacity style={styles.headerItem} onPress={() => router.replace(rightButtonRoute)}>
        <Text style={[styles.headerText, { color: Colors.text}]}>{rightButtonText}</Text> 
        <Ionicons name={rightButtonIcon} size={35} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
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
    fontSize: 30,
    fontWeight: '700',
    marginHorizontal: 5,
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