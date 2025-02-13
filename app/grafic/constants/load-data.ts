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
  functionLoad: any,
  filter: formatLoadDate,
  nameX: string,
  nameY: string
) {
  try {
    const response: any = await functionLoad(filter);

    const dataTable = response.data.data;
    const formattedData: ChartData[] = [
      {
        name: nameX,
        data: dataTable.slice(0, 5).map((item: any) => ({
          x: item[nameX],
          y: financial(item[nameY]),
        })),
      },
    ];

    return formattedData;
  } catch (error) {
    console.log(error);
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
