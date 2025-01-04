import React from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, ImageBackground, Button, Platform, Text } from "react-native";
import { WebView } from "react-native-webview";

const Review = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push("/menu");
  }

  return (
    <>
        <View style={styles.videoContainer}>
          {Platform.OS === 'android' ? (
            <WebView
              source={{ uri: "https://www.youtube.com/watch?v=GQ1A6V1eoZs&pp=ygUHcnVuZm9vZA%3D%3D" }}
              style={styles.video}
              allowsFullscreenVideo
            />
          ) : (
              <iframe
                src="https://www.youtube.com/embed/GQ1A6V1eoZs?autoplay=1"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="COMENZAR" onPress={handleStart} />
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 18,
    borderRadius: 18,
    elevation: 5,
  },
  videoContainer: {
    flex: 1,
    width: "85%",
    marginHorizontal: 'auto',
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  video: {
    flex: 1,
  }
});

export default Review;