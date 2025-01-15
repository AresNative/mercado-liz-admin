export interface Task {
  id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  prioridad: "alta" | "media" | "baja";
  fecha_vencimiento: string | null;
  order: number;
}

export interface Column {
  id: string;
  title: string;
}
