import { Field } from "@/utils/constants/interfaces";
import { useMemo } from "react";

export interface RowData {
  Nombre: string;
  Descripcion: string;
}

export function ColumnsField(data: RowData[] = []): Field[] {
  const options = useMemo(
    () =>
      data.map((row) => ({
        label: `${row.Nombre} - ${row.Descripcion}`,
        value: row.Nombre,
      })),
    [data]
  );

  return useMemo(
    () => [
      {
        type: "Flex",
        require: false,
        elements: [
          {
            name: "columnas",
            type: "SELECT",
            options: options,
            multi: true,
            label: "Seleccione columna(s)...",
            placeholder: "Mínimo 3 días mayor a la fecha de inicio",
            require: false,
          },
          {
            name: "rows",
            type: "INPUT",
            label: "Ingrese NUMERO de columnas",
            placeholder: "5 - 10 - 15 ... max 99",
            require: false,
          },
        ],
      },
    ],
    [options]
  );
}
