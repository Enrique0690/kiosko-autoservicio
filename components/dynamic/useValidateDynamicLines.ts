type Quantities = Record<number, number>;

type DynamicLine = {
  id: number;
  cantidadIncluye: number;
  products: Array<any>;
};

const useValidateDynamicLines = (
  dynamicLinesInfo: DynamicLine[], 
  includedQuantities: Quantities,
  setMissingLines: React.Dispatch<React.SetStateAction<number[]>>
) => {
  const validateDynamicLines = () => {
    const incompleteLines: number[] = [];
    dynamicLinesInfo.forEach((line, index) => {
      const selectedQuantity = Object.keys(includedQuantities)
        .filter((productId) =>
          line.products.some((p: any) => p.id === Number(productId))
        )
        .reduce((acc, productId) => acc + includedQuantities[Number(productId)], 0);

      if (selectedQuantity < line.cantidadIncluye) {
        incompleteLines.push(index);
      }
    });
    setMissingLines(incompleteLines);
    return incompleteLines.length === 0;
  };

  return { validateDynamicLines };
};

export default useValidateDynamicLines;