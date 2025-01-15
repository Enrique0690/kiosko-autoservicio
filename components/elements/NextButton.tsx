import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CustomButtonProps {
    text: string;
    onPress: () => void;
}

const NextButton = ({ text, onPress }: CustomButtonProps) => {
    const [pressed, setPressed] = useState(false);
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
        setPressed(true);
        Animated.spring(scale, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        setPressed(false);
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.buttonContainer,
                {
                    transform: [{ scale }],
                },
            ]}
        >
            <TouchableOpacity
                style={[styles.button, pressed && styles.buttonPressed]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Text style={styles.buttonText}>{text}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: '80%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
    button: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 25,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    buttonPressed: {
        backgroundColor: '#218838',
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 18,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 2,
    }
});

export default NextButton;