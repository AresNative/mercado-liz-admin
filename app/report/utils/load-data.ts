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
      ...filtros,
    ];

    const [chartResult, totalResult, tableResult, totalInventario] =
      await Promise.all([
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
            sumas: [
              {
                key:
                  currentConfig.type === "COMPRA"
                    ? "CantidadInventario"
                    : "Cantidad",
              },
            ],
          },
          page: currentPage,
          pageSize: 300000,
          sum: false,
        }),
      ]);

    const newStates = {
      previewData: [] as ChartData[],
      summary: {
        total: "$0.00",
        cantidad: "0",
        motivo: "N/A",
        porcentajeMotivo: "N/A",
      },
      totalPages: 0,
      dataTable: [] as DynamicTableItem[],
    };

    let inventario = 0;

    if (chartResult) {
      newStates.previewData = chartResult;
    }

    if (totalResult) {
      const resultData = totalResult.data || [];
      const totals = calculateSummary(resultData, currentConfig);
      newStates.summary = {
        total: formatValue(totals.totalCosto, "currency"),
        cantidad: formatValue(totals.totalCantidad, "number"),
        motivo: totals.mayorProveedor,
        porcentajeMotivo: totals.porcentajeMayor.toFixed(2),
      };
    }

    if (tableResult) {
      newStates.totalPages = tableResult.totalPages;
      newStates.dataTable = formatJSON(tableResult.data) as DynamicTableItem[];
    }

    if (totalInventario) {
      const totalInventarioSum = totalInventario.data || [];
      inventario = totalInventarioSum.reduce((acc: number, item: any) => {
        const cantidad = item.CantidadInventario ?? item.Cantidad ?? 0;
        return acc + cantidad;
      }, 0);
    }

    return { newStates, inventario };
  } catch (error) {
    throw new Error("Error al cargar datos. Intente nuevamente.");
  }
};
