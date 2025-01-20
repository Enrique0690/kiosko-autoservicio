import React, { useEffect, useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useImageCache } from '../DataContext/Context/ImageCacheContext';

interface ProductImageProps {
  descripcion: string;
  baseUrl: string;
  style?: object;
}

const ProductImage = ({ descripcion, baseUrl, style }: ProductImageProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { imageCache, addToCache } = useImageCache();
  const placeholderUri = require('../../assets/images/placeholder/products.webp');
  const possibleExtensions = ['jpg', 'png'];

  const fetchImage = async () => {
    for (const ext of possibleExtensions) {
      const url = `${baseUrl}${descripcion}.${ext}`;
      if (imageCache.has(url)) {
        setImageUri(imageCache.get(url) || placeholderUri);
        return;
      }
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          addToCache(url, url);
          setImageUri(url);
          return;
        }
      } catch (error) {
      }
    }
    setImageUri(placeholderUri);
  };

  useEffect(() => {
    fetchImage();
  }, [descripcion, baseUrl]);

  return (
    <Image
      source={imageUri}
      style={[styles.image, style]}
      contentFit="cover"
      cachePolicy="disk"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});

export default ProductImage;