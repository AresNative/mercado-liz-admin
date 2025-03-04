import { Field } from "@/utils/constants/interfaces";
import { useEffect, useMemo, useState } from "react";
import { RowData } from "./columns";
import { loadData } from "@/app/grafic/constants/load-data";
import { useAppSelector } from "@/hooks/selector";

export function FiltersField(data: RowData[] = [], getAPI: any): Field[] {
  // Estado para almacenar los resultados
  const [optionsSearch, setOptionsSearch] = useState([]);
  const options = useMemo(
    () =>
      data.map((row) => ({
        label: `${row.Nombre} - ${row.Descripcion}`,
        value: row.Nombre,
      })),
    [data]
  );

  async function loadDataSearch(term: string) {
    const response = await loadData(getAPI, {
      filters: {
        filtros: [
          {
            key: "Nombre",
            value: term,
            operator: "like",
          },
        ],
        sumas: [{ key: "Nombre" }],
      },
      page: 1,
      pageSize: 20,
      sum: true,
    });

    if (response?.data) {
      const tableData = response.data.map(
        (row: { Nombre: string }) => row.Nombre
      );

      setOptionsSearch(tableData);
    }
  }

  const term = useAppSelector((store) => store.filterData.value);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDataSearch(term);
  }, [term]);

  return useMemo(
    () => [
      {
        type: "Flex",
        require: false,
        elements: [
          {
            name: "search",
            type: "SEARCH",
            options: optionsSearch,
            label: "Busca algún dato de interés",
            placeholder: "Buscar productos...",
            require: false,
            saveData: true,
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
          {
            name: "fecha_inicial",
            type: "DATE_RANGE",
            label: "Fecha(s)",
            placeholder: "Buscar por fecha...",
            require: false,
            multiple: true,
          },
        ],
      },
    ],
    [options, optionsSearch]
  );
}
