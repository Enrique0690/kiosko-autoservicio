import React, { createContext, useContext, useMemo, useState } from 'react';

interface ImageCacheContextType {
  imageCache: Map<string, Blob>;
  addToCache: (key: string, blob: Blob) => void;
  getFromCache: (key: string) => Blob | undefined;
}

const ImageCacheContext = createContext<ImageCacheContextType | undefined>(undefined);

export const ImageCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imageCache] = useState<Map<string, Blob>>(new Map());

  const addToCache = (key: string, blob: Blob) => {
    if (!imageCache.has(key)) {
      imageCache.set(key, blob);
    }
  };

  const getFromCache = (key: string): Blob | undefined => {
    return imageCache.get(key);
  };

  const value = useMemo(
    () => ({ imageCache, addToCache, getFromCache }),
    [imageCache]
  );

  return <ImageCacheContext.Provider value={value}>{children}</ImageCacheContext.Provider>;
};

export const useImageCache = () => {
  const context = useContext(ImageCacheContext);
  if (!context) {
    throw new Error('useImageCache must be used within an ImageCacheProvider');
  }
  return context;
};