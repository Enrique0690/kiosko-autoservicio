import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Typography from './elements/Typography';

interface HeaderProps {
  centerText?: string; 
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
        <Typography variant='subtitle' color={Colors.primary} t={leftButtonText} />
      </TouchableOpacity>
      <Typography variant='title' color={Colors.textsecondary} t={centerText} />
      <TouchableOpacity style={styles.headerItem} onPress={() => router.replace(rightButtonRoute)}>
        <Typography variant='subtitle' color={Colors.primary} t={rightButtonText} />
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Header;