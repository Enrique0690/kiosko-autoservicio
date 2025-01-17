export default class ArticuloWithCalcs {
    pvp1: number;
    _IVA_: number;
    pagaIva: boolean = true;
    _METODO_REDONDEO_DECIMALES_: "NORMAL" = "NORMAL"; 

    constructor(pvp1: number, _IVA_: number, pagaIva: boolean = true, metodoRedondeo: "NORMAL" = "NORMAL") {
        this.pvp1 = pvp1;
        this._IVA_ = _IVA_;
        this.pagaIva = pagaIva;
        this._METODO_REDONDEO_DECIMALES_ = metodoRedondeo;
    }

    pvp() {
        return this.pvp1 || 0;
    }

    iva(ivaPorcentaje?: number) {
        let iiva = ivaPorcentaje ?? this._IVA_; 
        if (!this.pagaIva) return 0;

        if (this._METODO_REDONDEO_DECIMALES_ === "NORMAL") {
            return parseFloat(((this.pvp() * iiva) / 100).toFixed(2));
        }

        return ((this.pvp() * iiva) / 100);
    }

    pvpIVA() {
        let h = this.pvp();
        let iva = (h * this._IVA_ / 100);
        return parseFloat((iva + h).toFixed(2));
    }

    neto() {
        return this.pvp() - this.iva();
    }
}