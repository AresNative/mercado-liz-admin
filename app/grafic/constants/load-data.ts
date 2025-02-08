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

export async function loadDataGrafic(
  functionLoad: any,
  filter: formatLoadDate,
  name: string
) {
  try {
    const response: any = await functionLoad(filter);

    const dataTable = response.data.data;
    const formattedData: ChartData[] = [
      {
        name: name,
        data: dataTable.slice(0, 5).map((item: any) => ({
          x: item[name],
          y: financial(item.Importe),
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
