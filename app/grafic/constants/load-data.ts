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
  sum: boolean;
}

export async function loadDataMermasGrafic(
  functionLoad: any,
  filter: formatLoadDate
) {
  try {
    const response: any = await functionLoad(filter);

    const dataTable = response.data.data;
    const formattedData: ChartData[] = [
      {
        name: "Categoria",
        data: dataTable.slice(0, 5).map((item: any) => ({
          x: item.Categoria,
          y: financial(item.Importe),
        })),
      },
    ];

    return formattedData;
  } catch (error) {
    console.log(error);
  }
}

export async function loadDataMermas(
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
