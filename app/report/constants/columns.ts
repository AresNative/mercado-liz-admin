import { Field } from "@/utils/constants/interfaces";
import { useMemo } from "react";

interface RowData {
  Nombre: string;
}

export function ColumnsField(data: RowData[] = []): Field[] {
  const options = useMemo(() => data.map((row) => row.Nombre), [data]);

  return useMemo(
    () => [
      {
        name: "columnas",
        type: "SELECT",
        options: options,
        multi: true,
        label: "Seleccione columna(s)...",
        placeholder: "Mínimo 3 días mayor a la fecha de inicio",
        require: false,
      },
    ],
    [options]
  );
}
