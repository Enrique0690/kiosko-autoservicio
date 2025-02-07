import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { DataProvider } from "@/components/DataContext/datacontext";
import { AppProvider } from "@/components/contexts";

export default function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <AppProvider>
      <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Stack
          screenOptions={{
            animation: 'fade',
            headerShown: false,
            contentStyle: styles.stackContent,
          }}
        />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexDirection: 'row',
  },
  stackContent: {
    flex: 1,
    backgroundColor: "#fff", 
  },
});