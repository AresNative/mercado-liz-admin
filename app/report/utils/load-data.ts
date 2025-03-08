import { ChartData } from "@/app/grafic/@user/page";
import {
  formatFilter,
  loadDataGrafic,
  loadData,
} from "@/app/grafic/constants/load-data";
import {
  calculateSummary,
  formatJSON,
  formatValue,
} from "@/utils/constants/format-values";
import { DynamicTableItem } from "../constants/interfaces";

export const loadDataFromAPI = async (
  getAPI: any,
  filtros: formatFilter[],
  currentPage: number,
  rows: number,
  columns: any[],
  currentConfig: any
) => {
  try {
    const filtrosInventario: formatFilter[] = [
      { key: "CantidadInventario", value: " ", operator: "<>" },
      { key: "Tipo", value: `%${currentConfig.type}%`, operator: "like" },
      ...filtros,
    ];

    const [chartResult, totalResult, tableResult, totalInventario] =
      await Promise.allSettled([
        loadDataGrafic(
          getAPI,
          {
            filters: { filtros, sumas: [{ key: "Categoria" }] },
            page: 1,
            pageSize: 5,
            sum: true,
          },
          "Categoria",
          currentConfig.amountKey
        ),
        loadData(getAPI, {
          filters: { filtros, sumas: [{ key: currentConfig.sumKey }] },
          page: 1,
          pageSize: 300000,
          sum: true,
        }),
        loadData(getAPI, {
          filters: { filtros, sumas: columns },
          page: currentPage,
          pageSize: rows,
          sum: false,
        }),
        loadData(getAPI, {
          filters: {
            filtros: filtrosInventario,
            sumas: [{ key: "CantidadInventario" }],
          },
          page: currentPage,
          pageSize: rows <= 5 ? 300000 : rows,
          sum: true,
        }),
      ]);

    const newStates: {
      previewData: ChartData[];
      summary: {
        total: string;
        cantidad: string;
        motivo: string;
        porcentajeMotivo: string;
      };
      totalPages: number;
      dataTable: DynamicTableItem[];
    } = {
      previewData: [{ name: "", data: [{ x: "", y: 0 }] }],
      summary: {
        total: "$0.00",
        cantidad: "0",
        motivo: "N/A",
        porcentajeMotivo: "N/A",
      },
      totalPages: 0,
      dataTable: [],
    };
    let inventario = 0;
    if (chartResult.status === "fulfilled") {
      newStates.previewData = chartResult.value ?? [];
    }

    if (totalResult.status === "fulfilled") {
      const resultData = totalResult.value?.data || [];
      const totals = calculateSummary(resultData, currentConfig);
      newStates.summary = {
        total: formatValue(totals.totalCosto, "currency"),
        cantidad: formatValue(totals.totalCantidad, "number"),
        motivo: totals.mayorProveedor,
        porcentajeMotivo: totals.porcentajeMayor.toFixed(2),
      };
    }

    if (tableResult.status === "fulfilled") {
      const tableData = tableResult.value ?? { data: [], totalPages: 0 };
      newStates.totalPages = tableData.totalPages;
      newStates.dataTable = formatJSON(tableData.data) as [];
    }
    //totalInventario
    if (totalInventario.status === "fulfilled") {
      const totalInventarioSum = Array.isArray(totalInventario.value?.data)
        ? totalInventario.value.data
        : [];

      const totalCantidadInventario = totalInventarioSum.reduce(
        (acc: number, item: { CantidadInventario?: number }) =>
          acc + (item.CantidadInventario ?? 0),
        0
      );

      inventario = totalCantidadInventario;
    }
    return { newStates, inventario };
  } catch (error) {
    throw new Error("Error al cargar datos. Intente nuevamente.");
  }
};
