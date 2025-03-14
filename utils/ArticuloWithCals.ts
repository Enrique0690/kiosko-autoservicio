export const calcularIVA = (cart: any[], settings: any) => {
    let baseIVA = 0;
    let base0 = 0;
    let ivaTotal = 0;
    let total = 0;
    cart.forEach(item => {
        if (item.dinamico) {
            total += item.pvp1 * item.cantidad;
        } else if (item.pagaIva) {
            const base = item.pvp1 / (1 + settings.porcentajeIVA / 100);
            const iva = item.pvp1 - base;
            baseIVA += base * item.cantidad;
            ivaTotal += iva * item.cantidad;
        } else {
            base0 += item.pvp1 * item.cantidad;
        }
    });
    total = baseIVA + base0 + ivaTotal;

    return {
        baseIVA: parseFloat(baseIVA.toFixed(2)),
        base0: parseFloat(base0.toFixed(2)),
        ivaTotal: parseFloat(ivaTotal.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
    };
};