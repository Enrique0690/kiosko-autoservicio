import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { DataProvider } from "@/components/DataContext/datacontext";

export default function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <DataProvider>
      <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Stack
          screenOptions={{
             
            animation: 'fade',
            headerShown: false,
            contentStyle: styles.stackContent,
          }}
        />
      </View>
    </DataProvider>
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