import { Field } from "@/utils/constants/interfaces";
import { useEffect, useMemo, useState, useRef } from "react";
import { RowData } from "./columns";
import { loadData } from "@/app/grafic/constants/load-data";
import { useAppSelector } from "@/hooks/selector";

export function FiltersField(data: RowData[] = [], getAPI: any): Field[] {
  // Seleccionamos el término del store
  const term = useAppSelector((store) => store.filterData.search?.value || "");

  const filters = useAppSelector(
    (state) => state.filterData.key?.value || "Nombre"
  );
  // Estado para almacenar los resultados
  const [optionsSearch, setOptionsSearch] = useState<string[]>([]);
  const options = useMemo(
    () =>
      data.map((row) => ({
        label: `${row.Nombre} - ${row.Descripcion}`,
        value: row.Nombre,
      })),
    [data]
  );

  // useRef para almacenar el último término procesado y el controlador de abortos
  const latestTermRef = useRef(term);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función que carga la data de búsqueda
  async function loadDataSearch(currentTerm: string) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await loadData(getAPI, {
        filters: {
          filtros: [
            {
              key: filters,
              value: `${currentTerm}`,
              operator: "like",
            },
          ],
          sumas: [{ key: filters }],
        },
        page: 1,
        pageSize: 20,
        sum: false,
        distinct: true,
        signal: controller.signal, // Pasamos la señal de cancelación
      });

      if (latestTermRef.current === currentTerm && response?.data) {
        setOptionsSearch(response.data.map((row: any) => row[filters]));
      }
    } catch (error) {
      if (error) {
        console.error("Error al cargar datos:", error);
      }
    }
  }

  // Aplicamos debounce: esperamos 300ms tras el último cambio en "term"
  useEffect(() => {
    latestTermRef.current = term;
    loadDataSearch(term);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [term, getAPI, filters]);

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
            multi: false,
            label: "Seleccione columna(s)...",
            placeholder: "Mínimo 3 días mayor a la fecha de inicio",
            require: false,
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
