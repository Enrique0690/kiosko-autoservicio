import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import Typography from './Typography';

interface CustomButtonProps {
    text: string;
    onPress: () => void;
    bottomPercentage?: number;
}

const NextButton = ({ text, onPress, bottomPercentage = 20 }: CustomButtonProps) => {
    return (
        <View style={[styles.buttonContainer, { bottom: `${bottomPercentage}%` }]}>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                ]}
                onPress={onPress}
            >
                <Typography variant='title' color={Colors.primary} t={text} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        left: '5%',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        paddingVertical: 40,
        borderRadius: 8, 
        backgroundColor: Colors.secondary, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPressed: {
        backgroundColor: Colors.darkSecondary, 
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});

export default NextButton;