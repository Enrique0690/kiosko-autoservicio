export interface Product {
    id: number;
    idLinea?: number;
    codigo?: string;
    descripcion: string;
    habilitado?: boolean;
    existencia?: number;
    pvp1: number;
    dinamicoLineas?: any[];
    articulosDinamicos?: any[];
    dinamico?: boolean;
    pvpSeleccionado?: string;
    pagaIva?: boolean;
    image?: any;
  }
  
  export interface CartItem extends Product {
    cantidad: number;
    rowNumber: number;
  }
  
  export interface ClientData {
    cedula?: string;
    identification?: string;
    razonSocial?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    descripcion?: string;
  }