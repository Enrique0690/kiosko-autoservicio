import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useImageCache } from '../DataContext/Context/ImageCacheContext';

interface ProductImageProps {
  descripcion: string;
  type: 'articulo' | 'linea';
  style?: object;
}

const ProductImage = ({ descripcion, type, style }: ProductImageProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { getFromCache, addToCache } = useImageCache();
  const placeholderUri = require('../../assets/images/placeholder/products.webp');
  const possibleExtensions = ['jpg', 'png'];

  const getBaseUrl = () => {
    if (type === 'articulo') {
      return 'https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/';
    } else if (type === 'linea') {
      return 'https://ec-s1.runfoodapp.com/apps/demo.kiosk/api/v1/Imagenes_Articulos/Lineas/';
    }
    return ''; 
  };

  const fetchImage = async () => {
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      setImageUri(placeholderUri);
      return;
    }

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
  }, [descripcion, type]);

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