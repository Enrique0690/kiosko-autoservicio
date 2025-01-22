import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useImageCache } from '../DataContext/Context/ImageCacheContext';

interface ProductImageProps {
  descripcion: string;
  baseUrl: string;
  style?: object;
}

const ProductImage = ({ descripcion, baseUrl, style }: ProductImageProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { getFromCache, addToCache } = useImageCache();
  const placeholderUri = require('../../assets/images/placeholder/products.webp');
  const possibleExtensions = ['jpg', 'png'];

  const fetchImage = async () => {
    for (const ext of possibleExtensions) {
      const url = `${baseUrl}${descripcion}.${ext}`;

      const cachedBlob = getFromCache(url);
      if (cachedBlob) {
        setImageUri(URL.createObjectURL(cachedBlob));
        return;
      }
      try {
        const response = await fetch(url);

        if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
          const blob = await response.blob();
          addToCache(url, blob);
          setImageUri(URL.createObjectURL(blob));
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