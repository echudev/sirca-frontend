export interface EquipamientoData {
  equipoID: number;
  marca: string;
  modelo: string;
  descripcion: string;
  numeroDeSerie: string;
  fechaCompra: string;
  categoria: string;
  equipoEstado: string;
  urlImagen: string;
  precioUnitario: number;
  proveedores: string;
}
export interface OrdenesData {
  ordenID: number;
  equipo: string;
  estacion: string;
  ordenEstado: string;
  ultimaModificacion: string;
}
