import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
  const handleRightButtonPress = () => {
    if (typeof rightButtonRoute === 'string') {
      router.replace(rightButtonRoute as any);
    } else if (typeof rightButtonRoute === 'function') {
      rightButtonRoute();
    }
  };
  return (
    <View style={styles.header}>
      <View style={[styles.headerItem, styles.leftContainer]}>
        {leftButtonText && leftButtonRoute ? (
          <TouchableOpacity onPress={() => router.replace(leftButtonRoute)} style={styles.leftButton}>
            <Ionicons name="arrow-back" size={35} color={Colors.primary} />
            <Typography variant="body" color={Colors.primary} t={leftButtonText} />
          </TouchableOpacity>
        ) : (
          <View style={styles.empty} />  
        )}
      </View>
      <View style={styles.centerContainer}>
        {centerText ? (
          <Typography variant="title" color={Colors.textsecondary} t={centerText} />
        ) : (
          <View style={styles.empty} />  
        )}
      </View>

      {/* Botón derecho alineado a la derecha */}
      <View style={[styles.headerItem, styles.rightContainer]}>
        {rightButtonText && rightButtonRoute && rightButtonIcon ? (
          <TouchableOpacity onPress={handleRightButtonPress} style={styles.rightButton}>
            <Ionicons name={rightButtonIcon} size={35} color={Colors.primary} />
            <Typography variant="body" color={Colors.primary} t={rightButtonText} />
          </TouchableOpacity>
        ) : (
          <View style={styles.empty} />  
        )}
      </View>
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  centerContainer: {
    flex: 2.5, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    width: 50, 
  },
  leftButton: {
    flexDirection: 'column', 
    alignItems: 'flex-start', 
  },
  rightButton: {
    flexDirection: 'column', 
    alignItems: 'flex-end',
  }
});

export default Header;
