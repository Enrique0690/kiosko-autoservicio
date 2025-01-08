import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Platform, Animated, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview'; 

const Review = () => {
  const router = useRouter();
  const [videoPlaying, setVideoPlaying] = useState(true); 
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleStartPress = () => {
    setVideoPlaying(false);
    router.push('/pedido');
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {videoPlaying ? (
          Platform.OS === 'android' ? (
            <WebView
              source={{
                uri: 'https://www.youtube.com/watch?v=GQ1A6V1eoZs&pp=ygUHcnVuZm9vZA%3D%3D',
              }}
              style={styles.video}
              allowsFullscreenVideo
            />
          ) : (
            <View style={styles.iframeContainer}>
              <iframe
                src="https://www.youtube.com/embed/GQ1A6V1eoZs?autoplay=1"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </View>
          )
        ) : (
          <View style={styles.emptyVideo}></View> 
        )}
      </View>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handleStartPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>COMENZAR</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', 
    paddingHorizontal: 20,
  },
  videoContainer: {
    width: '100%',
    height: '70%',
    maxWidth: 800,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4, 
    marginVertical: 20,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  iframeContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000', 
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default Review;