import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import axios from 'axios';

interface ProductImageProps {
  descripcion: string;
  style: object;
}

const ProductImage: React.FC<ProductImageProps> = ({ descripcion, style }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const fetchImageUrl = async () => {
    const possibleExtensions = ['jpg', 'png', 'jpeg', 'webp'];
    for (const ext of possibleExtensions) {
      try {
        const url = `https://ec-s1.runfoodapp.com/apps/demo-digital-mind/api/v1/Imagenes_Articulos/${descripcion}.${ext}`;
        await axios.head(url); 
        setImageUrl(url);
        setIsLoading(false);
        return;
      } catch (error) {
        console.log(`Image not found: ${descripcion}`);
      }
    }
    setImageUrl(require('../../assets/images/placeholder/products.webp')); 
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImageUrl();
  }, [descripcion]);

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