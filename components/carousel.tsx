import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Image, Dimensions, PanResponder } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const PRELOADED_IMAGE = 'https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/Carousel/1.jpg';

const Carousel = () => {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timer, setTimer] = useState(0);
    const currentIndexRef = useRef(currentIndex);
    const timerRef = useRef(timer);
    const opacity = useSharedValue(1);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    useEffect(() => {
        timerRef.current = timer;
    }, [timer]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
            if (timerRef.current >= 10) {
                handleNextImage();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        const fetchImages = async () => {
            const fetchedImages: string[] = [];
            let i = 1;

            while (true) {
                try {
                    const jpgUrl = `https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/Carousel/${i}.jpg`;
                    await axios.get(jpgUrl);
                    fetchedImages.push(jpgUrl);
                    i++;
                } catch (error) {
                    const pngUrl = `https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/Carousel/${i}.png`;
                    try {
                        await axios.get(pngUrl);
                        fetchedImages.push(pngUrl);
                        i++;
                    } catch (error) {
                        break;
                    }
                }
            }

            setImages(fetchedImages);
            setIsLoading(false);
        };

        fetchImages();
    }, []);

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

    const handleNextImage = () => {
        animateImageChange(() => {
            const nextIndex = (currentIndexRef.current + 1) % images.length;
            setCurrentIndex(nextIndex);
            setTimer(0);
        });
    };

    const handlePreviousImage = () => {
        animateImageChange(() => {
            const prevIndex = (currentIndexRef.current - 1 + images.length) % images.length;
            setCurrentIndex(prevIndex);
            setTimer(0);
        });
    };

    const animateImageChange = (callback: any) => {
        opacity.value = withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) }, () => {
            callback();
            opacity.value = withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) });
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View style={styles.container}>
            {isLoading || images.length === 0 ? (
                <Image
                    source={{ uri: PRELOADED_IMAGE }}
                    style={styles.image}
                    resizeMode="stretch"
                />
            ) : (
                <Animated.Image
                    source={{ uri: images[currentIndex] }}
                    style={[styles.image, animatedStyle]}
                    resizeMode="stretch"
                />
            )}
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
        position: 'absolute',
    },
});

export default Carousel;