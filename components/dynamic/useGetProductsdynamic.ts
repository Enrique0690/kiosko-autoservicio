type Quantities = Record<number, number>;

const useGetProductsdynamic = (products: any[]) => {
  const getProductsdynamic = (
    includedQuantities: Quantities,
    extraQuantities: Quantities
  ) => {
    return Object.keys(includedQuantities)
      .map((productId) => {
        const product = products.find((p) => p.id === Number(productId));
        if (product) {
          return {
            ...product,
            pvpSeleccionado: 'pvp1',
            cantidad: includedQuantities[Number(productId)],
            __cantidad: includedQuantities[Number(productId)],
            _visualCantidad: includedQuantities[Number(productId)],
            _pagaIva: true,
            __pvp1: product.pvp1,
          };
        }
        return null;
      })
      .filter((item) => item !== null)
      .concat(
        Object.keys(extraQuantities)
          .map((productId) => {
            const product = products.find((p) => p.id === Number(productId));
            if (product) {
              return {
                ...product,
                pvpSeleccionado: 'pvp1',
                cantidad: extraQuantities[Number(productId)],
                __cantidad: extraQuantities[Number(productId)],
                _visualCantidad: extraQuantities[Number(productId)],
                _pagaIva: true,
                __pvp1: product.pvp1,
              };
            }
            return null;
          })
          .filter((item) => item !== null)
      );
  };

  return { getProductsdynamic };
};

export default useGetProductsdynamic;