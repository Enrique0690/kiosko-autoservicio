import { useState } from 'react';

type Quantities = Record<number, number>;

const useQuantityChange = (
  dynamicLinesInfo: any[],
  includedQuantities: Quantities,
  extraQuantities: Quantities,
  setIncludedQuantities: React.Dispatch<React.SetStateAction<Quantities>>,
  setExtraQuantities: React.Dispatch<React.SetStateAction<Quantities>>
) => {
  const handleQuantityChange = (productId: number, delta: number, type: 'included' | 'extra') => {
    if (type === 'included') {
      setIncludedQuantities((prevQuantities: Quantities) => {
        const currentQuantity = prevQuantities[productId] || 0;
        const newQuantity = currentQuantity + delta;

        const line = dynamicLinesInfo.find((lineInfo) => lineInfo.products.some((p: any) => p.id === productId));
        const totalQuantityInLine = Object.keys(prevQuantities)
          .filter((id) => line && line.products.some((p: any) => p.id === Number(id)))
          .reduce((acc, id) => acc + prevQuantities[Number(id)], 0);

        const newTotalQuantityInLine = totalQuantityInLine + (delta > 0 ? 1 : -1);

        if (line && newTotalQuantityInLine <= line.cantidadIncluye) {
          return {
            ...prevQuantities,
            [productId]: newQuantity >= 0 ? newQuantity : 0,
          };
        }
        return prevQuantities;
      });
    } else {
      setExtraQuantities((prevQuantities: Quantities) => {
        const currentQuantity = prevQuantities[productId] || 0;
        const newQuantity = currentQuantity + delta;

        return {
          ...prevQuantities,
          [productId]: newQuantity >= 0 ? newQuantity : 0,
        };
      });
    }
  };

  return { handleQuantityChange };
};

export default useQuantityChange;