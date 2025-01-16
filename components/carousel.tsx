import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, PanResponder, } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, } from 'react-native-reanimated';

const images = [
    'https://w.wallhaven.cc/full/8o/wallhaven-8o61d1.jpg',
    'https://w.wallhaven.cc/full/qd/wallhaven-qdj6qr.jpg',
    'https://w.wallhaven.cc/full/43/wallhaven-432x2v.jpg',
];

const { width, height } = Dimensions.get('window');

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timer, setTimer] = useState(0);
    const currentIndexRef = useRef(currentIndex);
    const timerRef = useRef(timer);
    const opacity = useSharedValue(1);
    const translateX = useSharedValue(0);
    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);
    useEffect(() => {
        timerRef.current = timer;
    }, [timer]);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
            if (timerRef.current >= 30) {
                handleNextImage();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleNextImage = () => {
        animateImageChange(() => {
            const nextIndex = (currentIndexRef.current + 1) % images.length;
            setCurrentIndex(nextIndex);
            setTimer(0);
        });
    };

    const handlePreviousImage = () => {
        animateImageChange(() => {
            const prevIndex =
                (currentIndexRef.current - 1 + images.length) % images.length;
            setCurrentIndex(prevIndex);
            setTimer(0);
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderRelease: (_, gestureState) => {
                const { dx } = gestureState;

                if (dx > 50) {
                    handlePreviousImage();
                } else if (dx < -50) {
                    handleNextImage();
                }
            },
        })
    ).current;

    const animateImageChange = (callback: any) => {
        opacity.value = withTiming(0, { duration: 300 }, () => {
            callback();
            opacity.value = withTiming(1, { duration: 300 });
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateX: withTiming(translateX.value, { duration: 300 }) }],
    }));

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <Animated.Image
                source={{ uri: images[currentIndex] }}
                style={[styles.image, animatedStyle]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    image: {
        width: width,
        height: height,
        resizeMode: 'cover',
        position: 'absolute',
    },
});

export default Carousel;