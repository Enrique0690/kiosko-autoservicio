import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  centerText?: string; // Nuevo argumento para texto central
  leftButtonText?: string; 
  leftButtonRoute?: any;
  rightButtonText?: string;
  rightButtonRoute?: any;
  rightButtonIcon?: any;
}

const Header = ({ centerText, rightButtonText, rightButtonRoute, rightButtonIcon, leftButtonText, leftButtonRoute }: HeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerItem} onPress={() => router.replace(leftButtonRoute)}>
        <Ionicons name='arrow-back' size={35} color={Colors.primary} />
        <Text style={styles.headerText}>{leftButtonText}</Text> 
      </TouchableOpacity>
       <Text style={styles.headerText}>{centerText}</Text>
      <TouchableOpacity style={styles.headerItem} onPress={() => router.replace(rightButtonRoute)}>
        <Text style={styles.headerText}>{rightButtonText}</Text> 
        <Ionicons name={rightButtonIcon} size={35} color={Colors.primary} />
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
    marginHorizontal: 5,
    letterSpacing: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    paddingTop: 20,
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default Header;