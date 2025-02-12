import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface ProductImageProps {
  image: { uri: string },
  style?: object;
}

const ProductImage = ({ image, style }: ProductImageProps) => {
  return (
    <Image
      source={image}
      style={[styles.image, style]}
      contentFit="cover"
      cachePolicy="none"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});

export default ProductImage;