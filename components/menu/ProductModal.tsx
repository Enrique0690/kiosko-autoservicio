import React, { useState, useLayoutEffect, useRef } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import Typography from '../elements/Typography';
import ProductImage from './productimage';
import { Ionicons } from '@expo/vector-icons';
import { useDataContext } from '../contexts/useDataContext';
import QuantityControls from '../elements/QuantityControls';
import PayButton from '../elements/PayButton';

interface ProductModalProps {
    visible: boolean;
    onClose: () => void;
    item: any;
}

function ProductModal({ visible, onClose, item }: ProductModalProps) {
    const { addToCart, cart } = useDataContext();
    const [quantity, setQuantity] = useState(0);
    const [initialQuantity, setInitialQuantity] = useState(0);
    const windowHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(windowHeight)).current;

    const animateModal = (toValue: number, callback?: () => void) => {
        Animated.timing(translateY, {
            toValue,
            duration: 300,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start(() => {
            if (callback) callback();
        });
    };

    useLayoutEffect(() => {
        if (visible) {
            const itemInCart = cart.find(cartItem => cartItem.id === item.id);
            setInitialQuantity(itemInCart ? itemInCart.cantidad : 0);
            setQuantity(itemInCart ? itemInCart.cantidad : 0);
            animateModal(0);
        }
    }, [visible]);

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        const difference = quantity - initialQuantity;
        if (difference !== 0) addToCart(item, difference);
        animateModal(1000, onClose);
    };

    return (
        <Modal visible={visible} transparent={true} animationType="none" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={() => animateModal(windowHeight, onClose)}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[styles.modalContainer, { transform: [{ translateY }] }]}
                        >
                            <TouchableOpacity onPress={() => animateModal(windowHeight, onClose)} style={styles.closeButton}>
                                <Ionicons name="close-circle" size={70} color="rgba(247, 247, 247, 0.4)" />
                            </TouchableOpacity>
                            <ProductImage image={item.image} style={styles.productImage}/>
                            <Typography variant="title" color={Colors.text} t={item.descripcion} style={styles.productDescription} />
                            <Typography variant="subtitle" color={Colors.primary} t={`$${item.pvp1.toFixed(2)}`} style={styles.productPrice} />
                            <View style={styles.productInfoContainer}>
                                <Typography variant="body" color={Colors.text} t={item.descripcion} style={styles.productDescription} />
                            </View>
                            <QuantityControls quantity={quantity} onIncrease={handleIncrement} onDecrease={handleDecrement} sizeMultiplier={2} />
                            <View style={styles.footer}>
                                <PayButton onPress={handleAddToCart} text="Agregar al carrito" disabled={quantity === 0} />
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '100%',
        height: '95%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        position: 'absolute',
        boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.8)',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 1,
    },
    productImage: {
        width: '100%',
        height: '25%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        resizeMode: 'contain',
    },
    productInfoContainer: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productDescription: {
        marginBottom: 10,
        textAlign: 'center',
    },
    productPrice: {
        marginBottom: 20,
        textAlign: 'center',
    },
    footer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
    }
});

export default ProductModal;