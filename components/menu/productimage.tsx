import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import axios from 'axios';

interface ProductImageProps {
  descripcion: string;
  baseUrl: string; 
  style: object;
}

const ProductImage = ({ descripcion, baseUrl, style }: ProductImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchImageUrl = async () => {
    const possibleExtensions = ['jpg', 'png'];
    for (const ext of possibleExtensions) {
      try {
        const url = `${baseUrl}${descripcion}.${ext}`;
        await axios.head(url); 
        setImageUrl(url);
        setIsLoading(false);
        return;
      } catch (error) {
      }
    }
    setImageUrl(require('../../assets/images/placeholder/products.webp')); 
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImageUrl();
  }, []);

  return (
    <Image
      source={isLoading ? require('../../assets/images/placeholder/products.webp') : imageUrl}
      style={[styles.image, style]}
      contentFit='cover'
      cachePolicy='memory'
    />
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});

export default ProductImage;