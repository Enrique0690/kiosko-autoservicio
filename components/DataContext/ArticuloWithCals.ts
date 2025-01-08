declare const window;
import AppModels from "../AppModels";
import PCuenta from "../../components/pedido-component/p-clases";
import ArticuloVisible from "./articulo-visible";
import RedondeoStandard from "../../utils/RedondeoMatematico";
import RedondeoMatematico from "../../utils/RedondeoMatematico";

export default class ArticuloWithCalcs extends ArticuloVisible {
    porcentajeServicio: number;
    /** Igual que aplicar servicio, pero solo aplica para  servicio()*/
    APLICAR_SERVICIO?: boolean;
    /** Valor IVA con el que fue instanciado */
    _IVA_: number;
    /** Metodo de redondeo de decimales con el que fue instanciado */
    _METODO_REDONDEO_DECIMALES_: AppModels.Configuracion["MetodoRedondeoTotales"];
    /** Valor pagaIva Original/Inicial */
    _pagaIva: boolean;
    descuento: number;
    /** Valor descuento Original/Inicial */
    _descuento: number;
    descuentoPorcentaje: number;
    /** el PVP que se está usando actualmente */
    pvpSeleccionado: "pvp1" | "pvp2" | "pvp3" | "pvp4" | "pvp5" | "pvp6" = "pvp1";

    /**  `DINAMICOS` - La cantidad en productos dinamicos escogidos que excede el Maximo */
    cantidadExceso: number;
    /**  `DINAMICOS` - Es producto Dinamico? */
    dinamico: boolean = false;
    /** `DINAMICOS` - La cantidad que incluye de dinamicos ??? */
    cantidadIncluye?: number;
    /** `DINAMICOS` - Almaceno los ArticulosDinamicos Seleccionados */
    articulosDinamicos?: ArticuloWithCalcs[];
    /** `PRODUCTO DINAMICO SELECCIONADO` - Aquí se guarda si el ingreso de cantidad es manual, cuando se usa la opción `cantidad_proporcional` para productos dinamicos */
    producto_dinamico_ingreso_cantidad_manual?: boolean;
    /** `DINAMICOS` - Almaceno el PVP original del Articulo. Esto sirve para hacer calculos por aumento excesivo de productos dinamicos */
    pvpX?: number;
    /** Cantidad con la que fue instanciada */
    private __cantidad: number = 0;
    /** La propiedad 'Cantidad' que se visualiza en la pantalla. Se utiliza en Pedido-row.onCantidadChange para denegar-permitir el cambio */
    _visualCantidad: number = 0;
    /** esto es para cuando se cambian los precios, Almaceno el PVP1 xq lo reemplazo por el precio NEGOCIADO */
    __pvp1?: number;
    /** Indica si este registro fue creado para dar un valor de SERVICIO A DOMICILIO */
    esServicioADomicilio: boolean;
    /** Almacena la PCuenta a la que pertenece */
    cuenta?: PCuenta;

    /* `CALCULADO` - Porcentaje sobre el cual se calcula su valor (-|+) */
    porcentaje?: number;

    /** `TARJETA DE CONSUMO` Indica que la cantidad no se puede mover */
    no_modificable?: boolean;
    /** `TARJETA DE CONSUMO` Identificador de la tarjeta de consumo a Recargar/Activar */
    tarjeta?: string;

    /** La cantidad original con la que vino el registro, no se modifica */
    public readonly _cantidadInicial?: number;

    /** Identifico que el registro viene de un pedido guardado. */
    noEsNuevo?: boolean;
    /** ID del Detalle, dentro del Pedido */
    idDetalle?: number;
    /** ID del Detalle Padre, dentro del Pedido */
    idDetalleServ?: number;
    /** Este regostrp  se va a reasignar entre cuentas */
    __reasignar?: boolean;
    /** Unidades digitadas */
    unidades?: number;
    /** Tiempo - Seccion */
    seccion?: AppModels.SeccionPedido;
    /** Integracion con Modulo de Comandas Electronicas */
    retirado?: number;
    /** Referencia al ID del articulo dinamico padre */
    productoFinal?: number;

    /** Identifico a un Articulo seleccionado por NEGOCIACION (Lista de Precios por Cliente) */
    articuloNegociado?: boolean;

    bodega: number;

    constructor(row, cf: IArticuloConfigs = {}, _IVA_: number = undefined) {
        super();
        if (!row) return;
        var x = JSON.parse(angular.toJson(row));
        for (var key in x) {
            if (x.hasOwnProperty(key)) {
                this[key] = x[key];
            }
        }

        if (row.idBodegaInventario) this.bodega = row.idBodegaInventario;
        // cuando se copian los datos
        if (this.porcentajeServicio === undefined) {
            this.porcentajeServicio = cf.porcentajeServicio;
        }
        if (this._IVA_ === undefined) {
            this._IVA_ = cf.porcentajeIVA || _IVA_;
        }
        if (this._METODO_REDONDEO_DECIMALES_ === undefined) {
            this._METODO_REDONDEO_DECIMALES_ = cf.MetodoRedondeoTotales;
        }
        let pagaIva: string = <any>this.pagaIva;
        if (!pagaIva) { pagaIva = 'false'; }
        this.pagaIva = (pagaIva.toString().trim().toLowerCase() === 'true');
        this._pagaIva = this.pagaIva;
        if (!this.descuento) this.descuento = 0;
        if (this.descuento) {
            this._descuento = this.descuento;
            this.descuentoPorcentaje = this.descuentoPorcentaje;
            if (!this.descuentoPorcentaje) {
                this.descuentoPorcentaje = ((this.descuento / this[this.pvpSeleccionado]) * 100).round(2);
            }
        }
        this.cantidadExceso = 0;
        // ARTICULOS DINAMICOS
        this.dinamico = (this.dinamicoLineas && this.dinamicoLineas.length > 0);
        // si no esta declarado desde el inicio, la propiedad no funciona bien. y no se registra en el WebService
        this.cantidad = (this.cantidad || 0);
        this.__cantidad = (this.cantidad || 0);
        /** almaceno la cantidad inicial */
        this._cantidadInicial = this.cantidad;
        Object.defineProperty(this, 'cantidad', {
            get(this: ArticuloWithCalcs) {
                return this.__cantidad;
            },
            set(this: ArticuloWithCalcs, value: number) {
                this.__cantidad = value;
                this._visualCantidad = this.__cantidad;
            }
        });
        this.cantidad = this.cantidad;
        if (this.pvp1) this.__pvp1 = this.pvp1;
    }
    pvp() {
        var h = this[this.pvpSeleccionado];
        if (h == null || h == undefined) {
            return 0;
        } else {
            return h;
        }
    }
    iva(ivaPorcentaje?) {
        let iiva = ivaPorcentaje;
        if (iiva == undefined) {
            iiva = this._IVA_;
        }
        if (!this.pagaIva) return 0;
        if (this._METODO_REDONDEO_DECIMALES_ === "MATEMATICO") {
            return RedondeoMatematico.redondear((this.pvp() * iiva) / 100);
        }
        return ((this.pvp() * iiva) / 100).round(2);
    }
    pvpIVA() {
        var h = this[this.pvpSeleccionado];
        if (h == null || h == undefined) {
            h = 0;
        } else {
            h = h - (this.descuento || 0);
        }
        if (!this.pagaIva) return h.round(2);
        if (this._METODO_REDONDEO_DECIMALES_ === "MATEMATICO") {
            let iva = RedondeoMatematico.redondear(h * this._IVA_ / 100);
            let servicio = 0;
            if (this.APLICAR_SERVICIO)
                servicio = RedondeoMatematico.redondear(h * this.porcentajeServicio / 100);
            return RedondeoMatematico.redondear(iva + servicio + h);
        }
        let iva = (h * this._IVA_ / 100);
        let servicio = 0;
        if (this.APLICAR_SERVICIO)
            servicio = h * this.porcentajeServicio / 100;

        return (iva + servicio + h).round(2);
    }
    servicio(roundTo = 6) {
        if (!this.APLICAR_SERVICIO) return 0;
        if (this.porcentajeServicio && this.cantidad) {
            //_val_ = round(this.pvp() * this.porcentajeServicio / 100, 4);
            //_val_ = round(_val_ * this.cantidad,4);
            return (this.neto() * this.porcentajeServicio / 100).round(roundTo);
        }
        return 0;
    }
    total() {
        if (this._METODO_REDONDEO_DECIMALES_ === "MATEMATICO") {
            return RedondeoMatematico.redondear(this.subtotalIva() + this.neto());
        }
        return (this.neto(6) + this.subtotalIva(6)).round(2);
    }
    subtotalIva(roundTo = 2) {
        if (!this.pagaIva) this.pagaIva = false;
        if (!this.pagaIva) return 0;
        if (this._METODO_REDONDEO_DECIMALES_ === "MATEMATICO")
            return RedondeoMatematico.redondear((this.neto() * this._IVA_) / 100);
        return (this.neto() * this._IVA_ / 100).round(roundTo);
    }
    neto(rountTo = 6) {
        var cant = this.cantidad;
        if (this.cantidadIncluye) cant = this.cantidadExceso();
        if (!(cant > 0)) return 0;
        if (this._METODO_REDONDEO_DECIMALES_ === "MATEMATICO") {
            return RedondeoMatematico.redondear(
                RedondeoMatematico.redondear(this.pvp() * cant) - RedondeoMatematico.redondear(+this.descuento || 0)
            );
        }
        return ((this.pvp() * cant) - (this.descuento || 0)).round(rountTo);
    }
    valorExceso(usaIva: boolean) {
        if (this._METODO_REDONDEO_DECIMALES_ === "MATEMATICO") {
            let neto = +(this.cantidadExceso * this.pvp()).toFixed(2);
            if (!usaIva) return neto;
            return +(RedondeoMatematico.redondear(neto * this._IVA_ / 100) + neto).toFixed(2);
        }
        return this.cantidadExceso * (this.pvp() + ((usaIva) ? this.iva() : 0))
    }
    updateDescuento(porcentaje: number) {
        this.descuentoPorcentaje = porcentaje;
        this.descuento = 0;
        if (!(this.descuentoPorcentaje && this.neto())) return;
        if (this._METODO_REDONDEO_DECIMALES_ === "MATEMATICO") {
            this.descuento = +((this.neto() * this.descuentoPorcentaje) / 100).toFixed(2);
            return;
        }
        this.descuento = (this.neto() * this.descuentoPorcentaje) / 100;
    }
}
window.Articulo = ArticuloWithCalcs;

interface IArticuloConfigs {
    porcentajeServicio?: number;
    porcentajeIVA?: number;
    MetodoRedondeoTotales?: AppModels.Configuracion["MetodoRedondeoTotales"];
}