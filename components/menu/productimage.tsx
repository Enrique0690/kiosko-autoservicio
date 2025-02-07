import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image'; 

interface ProductImageProps {
  image: Blob | null;
  style?: object;
}

const ProductImage = ({ image, style }: ProductImageProps) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const placeholder = require('../../assets/images/placeholder/products.webp');

  useEffect(() => {
    let url: string | null = null;
    if (image) {
      url = URL.createObjectURL(image);
      setObjectUrl(url);
    } else {
      setObjectUrl(null);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [image]);

  return (
    <Image
      source={objectUrl ? { uri: objectUrl } : placeholder}
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