import { financial } from "@/utils/functions/format-financial";
import { ChartData } from "../@user/page";

export interface formatFilter {
  key: string;
  value: string;
  operator: "like" | "=" | ">=" | "<=" | ">" | "<" | "<>" | ""; // Incluí "" como opción para el operador.
}

interface formatSuma {
  key: string;
}

export interface formatLoadDate {
  filters: {
    filtros: formatFilter[];
    sumas: formatSuma[];
  };
  page: number;
  pageSize?: number;
  sum: boolean;
}

export async function loadDataGrafic(
  functionLoad: (filter: formatLoadDate) => Promise<any>,
  filter: formatLoadDate,
  nameX: string | string[],
  nameY: string
) {
  try {
    const response = await functionLoad(filter);
    const dataTable: any[] = response.data.data;

    // Determinar campos para agrupación y eje X
    const [groupBy, xField] = Array.isArray(nameX) ? nameX : [undefined, nameX];

    // Agrupar datos si se especificó groupBy
    const groupedData: {
      [key: string]: { name: string; data: { x: any; y: number }[] };
    } = {};

    dataTable.forEach((item: any) => {
      const groupKey = groupBy ? item[groupBy] : "default";
      const xValue = item[xField];
      const yValue = parseFloat(financial(item[nameY])); // Asegurar que sea número

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {
          name: groupKey,
          data: [],
        };
      }

      groupedData[groupKey].data.push({
        x: xValue,
        y: isNaN(yValue) ? 0 : yValue, // Manejo de valores no numéricos
      });
    });

    return Object.values(groupedData);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function loadData(
  functionLoad: any,
  filter: formatLoadDate
): Promise<{ data: any; totalPages: number } | undefined> {
  try {
    const response: any = await functionLoad(filter);

    const dataTable: any = response.data.data;
    const dataTotalPages: any = response.data.totalPages;

    return { data: dataTable, totalPages: dataTotalPages };
  } catch (error) {
    console.log(error);
  }
}
