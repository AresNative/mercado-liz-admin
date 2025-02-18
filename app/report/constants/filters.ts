import { Field } from "@/utils/constants/interfaces";
import { useMemo } from "react";
import { RowData } from "./columns";

export function FiltersField(data: RowData[] = []): Field[] {
  const options = useMemo(() => data.map((row) => row.Nombre), [data]);
  return useMemo(
    () => [
      {
        type: "Flex",
        require: false,
        elements: [
          {
            name: "search",
            type: "SEARCH",
            /* options: ["Guadalupe", "TESTERAZO", "Palmas", "MAYOREO"], */
            label: "Busca algún dato de interés",
            placeholder: "Buscar productos...",
            require: false,
          },
          {
            name: "columnas",
            type: "SELECT",
            options: options,
            multi: true,
            label: "Seleccione columna(s)...",
            placeholder: "Mínimo 3 días mayor a la fecha de inicio",
            require: true,
          },
          {
            name: "sucursal",
            type: "SELECT",
            options: [
              { label: "Guadalupe", value: "LIZ" },
              { label: "Testerazo", value: "TESTERAZO" },
              { label: "Palmas", value: "PALMAS" },
              { label: "Mayoreo", value: "MAYOREO" },
            ],
            multi: true,
            label: "Seleccione sucursal...",
            placeholder: "Mínimo 3 días mayor a la fecha de inicio",
            require: false,
          },
        ],
      },
      {
        type: "Flex",
        require: false,
        elements: [
          {
            name: "fecha_inicial",
            type: "DATE",
            label: "Fecha inicial",
            placeholder: "Buscar por fecha...",
            require: false,
          },
          {
            name: "fecha_final",
            type: "DATE",
            label: "Fecha final",
            placeholder: "Buscar por fecha...",
            require: false,
          },
        ],
      },
    ],
    [options]
  );
}
