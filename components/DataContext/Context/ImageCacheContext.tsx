import React, { createContext, useContext, useMemo, useState } from 'react';

interface ImageCacheContextType {
  imageCache: Map<string, string>;
  addToCache: (key: string, value: string) => void;
}

const ImageCacheContext = createContext<ImageCacheContextType | undefined>(undefined);

export const ImageCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imageCache] = useState<Map<string, string>>(new Map());

  const addToCache = (key: string, value: string) => {
    if (!imageCache.has(key)) {
      imageCache.set(key, value);
    }
  };

  const value = useMemo(() => ({ imageCache, addToCache }), [imageCache]);

  return <ImageCacheContext.Provider value={value}>{children}</ImageCacheContext.Provider>;
};

export const useImageCache = () => {
  const context = useContext(ImageCacheContext);
  if (!context) {
    throw new Error('useImageCache must be used within an ImageCacheProvider');
  }
  return context;
};