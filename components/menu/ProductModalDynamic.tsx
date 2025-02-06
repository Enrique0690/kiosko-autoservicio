import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback, ScrollView, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import Typography from '../elements/Typography';
import ProductImage from './productimage';
import { Ionicons } from '@expo/vector-icons';
import { useDataContext } from '../DataContext/datacontext';
import PayButton from '../elements/PayButton';
import useGetProductsdynamic from '../dynamic/useGetProductsdynamic';
import useQuantityChange from '../dynamic/useQuantityChange';
import useValidateDynamicLines from '../dynamic/useValidateDynamicLines';
import ProductListDynamic from './productlistdynamic';

type Quantities = Record<number, number>;

interface ProductModalDynamicProps {
    visible: boolean;
    onClose: () => void;
    item: any;
}

function ProductModalDynamic({ visible, onClose, item }: ProductModalDynamicProps) {
    const { products, lines, addToCart } = useDataContext();
    const [total, setTotal] = useState<number>(0);
    const [dynamicLinesInfo, setDynamicLinesInfo] = useState<any[]>([]);
    const [includedQuantities, setIncludedQuantities] = useState<Quantities>({});
    const [extraQuantities, setExtraQuantities] = useState<Quantities>({});
    const [missingLines, setMissingLines] = useState<number[]>([]);
    const [showFeedback, setShowFeedback] = useState<boolean>(false);
    const { getProductsdynamic } = useGetProductsdynamic(products);
    const { validateDynamicLines } = useValidateDynamicLines(dynamicLinesInfo, includedQuantities, setMissingLines);
    const { handleQuantityChange } = useQuantityChange(dynamicLinesInfo, includedQuantities, extraQuantities, setIncludedQuantities, setExtraQuantities);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const lineRefs = useRef<(View | null)[]>([]);
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
                animateModal(0);
            }
        }, [visible]);

    useEffect(() => {
        if (item) {
            setTotal(item.pvp1);
            const linesInfo = item.dinamicoLineas?.map((dynamicLine: any) => {
                const line = lines.find((l) => l.id === dynamicLine.id);
                const productsForLine = products.filter((p) => p.idLinea === dynamicLine.id && p.habilitado);
                return {
                    lineDescription: line ? line.descripcion : 'Sin descripción',
                    products: productsForLine,
                    cantidadIncluye: dynamicLine.cantidadIncluye,
                };
            });
            setDynamicLinesInfo(linesInfo || []);
        }
    }, [item, lines, products]);

    useEffect(() => {
        let newTotal = item ? item.pvp1 : 0;
        Object.keys(extraQuantities).forEach((productId) => {
            const product = products.find((p) => p.id === Number(productId));
            if (product) {
                newTotal += product.pvp1 * extraQuantities[Number(productId)];
            }
        });
        setTotal(newTotal);
    }, [extraQuantities, products, item]);

    useEffect(() => {
        const incompleteLines: number[] = [];
        dynamicLinesInfo.forEach((line, index) => {
            const selectedQuantity = Object.keys(includedQuantities)
                .filter((productId) =>
                    line.products.some((p: any) => p.id === Number(productId))
                )
                .reduce((acc, productId) => acc + includedQuantities[Number(productId)], 0);

            if (selectedQuantity < line.cantidadIncluye) {
                incompleteLines.push(index);
            }
        });
        setMissingLines(incompleteLines);
    }, [includedQuantities, dynamicLinesInfo]);

    const handleAddToCart = () => {
        const isValid = validateDynamicLines();
        if (!isValid) {
            setShowFeedback(true);
            const firstErrorIndex = missingLines[0];
            const targetRef = lineRefs.current[firstErrorIndex] as View;
            if (targetRef && scrollViewRef.current) {
                targetRef.measureLayout(scrollViewRef.current as any, (x, y) => {
                    scrollViewRef.current?.scrollTo({ y, animated: true });
                });
            }
            return;
        }

        if (item) {
            const includedProducts = getProductsdynamic(includedQuantities, {});
            const extraProducts = getProductsdynamic(extraQuantities, {});
            const extraTotal = extraProducts.reduce((acc, product) => acc + product.__pvp1 * product.cantidad, 0);
            const mainProduct = {
                ...item,
                articulosDinamicos: [...includedProducts, ...extraProducts],
                dinamico: true,
                pvpSeleccionado: 'pvp1',
                pvp1: item.pvp1 + extraTotal,
            };
            addToCart(mainProduct, 1);
        }
        handleReset();
        animateModal(1000, onClose);
    };

    const handleClose = () => {
        handleReset();
        animateModal(windowHeight, onClose);
    };

    const handleReset = () => {
        setIncludedQuantities({});
        setExtraQuantities({});
        setShowFeedback(false);
    }

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={handleClose}>
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[styles.modalContainer, { transform: [{ translateY }] }]}
                        >
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <Ionicons name="close-circle" size={70} color="rgba(255, 255, 240, 0.8)" />
                            </TouchableOpacity>
                            <ProductImage descripcion={item.descripcion} style={styles.productImage} type="articulo" />
                            <ScrollView ref={scrollViewRef} style={styles.content}>
                                <Typography variant="title" color={Colors.text} t={item.descripcion} style={styles.productDescription} />
                                <View style={styles.productInfoContainer}>
                                    <Typography variant="body" color={Colors.text} t={item.descripcion} style={styles.productDescription} />
                                </View>
                                {dynamicLinesInfo.map((lineInfo, index) => (
                                    <View
                                        key={index}
                                        ref={(ref) => (lineRefs.current[index] = ref)}
                                        style={[
                                            styles.dynamicLineContainer,
                                            missingLines.includes(index) && showFeedback && styles.missingLine,
                                        ]}
                                    >
                                        <Typography variant='subtitle' color={Colors.textsecondary} t={`Incluye ${lineInfo.lineDescription} - ${lineInfo.cantidadIncluye} (obligatorio)`} />
                                        <ProductListDynamic
                                            lineInfo={lineInfo}
                                            type="included"
                                            includedQuantities={includedQuantities}
                                            extraQuantities={extraQuantities}
                                            handleQuantityChange={handleQuantityChange}
                                        />
                                    </View>
                                ))}
                                {dynamicLinesInfo.map((lineInfo, index) => (
                                    <View key={index} style={styles.dynamicLineContainer}>
                                        <Typography variant='subtitle' color={Colors.textsecondary} t={`Extras ${lineInfo.lineDescription} (Opcional)`} />
                                        <ProductListDynamic
                                            lineInfo={lineInfo}
                                            type="extra"
                                            includedQuantities={includedQuantities}
                                            extraQuantities={extraQuantities}
                                            handleQuantityChange={handleQuantityChange}
                                        />
                                    </View>
                                ))}

                            </ScrollView>
                            <PayButton onPress={handleAddToCart} text={`Agregar al carrito`} />
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
        minHeight: 150,
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
    },
    dynamicLineContainer: {
        marginBottom: 20,
    },
    missingLine: {
        backgroundColor: '#ffcccc',
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    }
});

export default ProductModalDynamic;