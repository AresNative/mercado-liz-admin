export type ReportType = "compras" | "ventas";

export interface ReportConfig {
  type: ReportType;
  title: string;
  amountKey: "Costo" | "Importe";
  mainField: string;
  sumKey: string;
}

export interface DynamicTableItem {
  id: string;
  Nombre: string;
  Almacen: string;
  FechaEmision: string;
  [key: string]: any;
}

export interface SummaryState {
  total: string;
  cantidad: string;
  motivo: string;
  porcentajeMotivo: string;
}

export interface LoadingState {
  chart: boolean;
  summary: boolean;
  table: boolean;
}

export const REPORT_CONFIGS: Record<ReportType, ReportConfig> = {
  compras: {
    type: "compras",
    title: "Compras",
    amountKey: "Costo",
    mainField: "Proveedor",
    sumKey: "Proveedor",
  },
  ventas: {
    type: "ventas",
    title: "Ventas",
    amountKey: "Importe",
    mainField: "Cliente",
    sumKey: "Cliente",
  },
};
