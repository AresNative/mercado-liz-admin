"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import { FileText, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { useGetReportQuery } from "@/store/server/reducers/api-reducer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartTooltip,
  Legend
);

const ITEMS_PER_PAGE = 10; // Tamaño de página para la paginación

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("ventas");
  const [barcode, setBarcode] = useState("");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [columns, setColumns] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Construcción dinámica de los parámetros de consulta
  const queryParam = `${activeTab}?codigo=${encodeURIComponent(
    barcode
  )}&page=${currentPage}&pageSize=${ITEMS_PER_PAGE}`;

  const {
    data: reportData,
    error,
    isLoading,
    refetch,
  } = useGetReportQuery(queryParam, { refetchOnMountOrArgChange: true }); // Agregar refetch dinámico

  useEffect(() => {
    if (reportData) {
      const dataToSet = Array.isArray(reportData.data) ? reportData.data : [];
      if (activeTab === "ventas" && reportData.data) {
        updateChartData(dataToSet, false); // false porque no es compras
        setColumns(generateColumns(dataToSet));
        setSortedData(dataToSet);
      } else {
        updateChartData(
          Array.isArray(reportData) ? reportData : [],
          activeTab === "compras"
        );
        setColumns(
          generateColumns(Array.isArray(reportData) ? reportData : [])
        );
        setSortedData(Array.isArray(reportData) ? reportData : []);
      }
    } else {
      setChartData({ labels: [], datasets: [] });
      setColumns([]);
      setSortedData([]);
    }
  }, [reportData, activeTab]);

  // Refetch de datos cuando cambia la página
  useEffect(() => {
    refetch(); // Re-fetch de datos al cambiar la página
  }, [currentPage, refetch]);

  const updateChartData = (items = [], isCompras = false) => {
    if (!Array.isArray(items)) {
      console.error("Items no es un array:", items);
      return;
    }

    const aggregatedData = items.reduce((acc, item) => {
      const key = isCompras
        ? new Date(item.fechaEmision).toLocaleDateString()
        : item.art || item.Articulo || "Desconocido";

      const total =
        (item.cant || item.cantidad || item.TotalCantidad || 0) *
        (item.price || item.costo || item.TotalImporte || 0);

      acc[key] = (acc[key] || 0) + total;
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(aggregatedData),
      datasets: [
        {
          label: isCompras ? "Total Compras" : "Total Ventas",
          data: Object.values(aggregatedData),
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const generateColumns = (data) =>
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
        }))
      : [];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1); // Reiniciar la página al cambiar de tab
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Cambiar la página actual
  };

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [sortedData, currentPage]);

  useEffect(() => {
    if (paginatedData.length > 0) {
      updateChartData(paginatedData, activeTab === "compras");
    } else {
      setChartData({ labels: [], datasets: [] });
    }
  }, [paginatedData, activeTab]);

  return (
    <Card className="max-w-6xl mx-auto my-12 p-8 rounded-xl shadow-lg pb-10">
      <CardHeader className="flex justify-between items-center pb-6 border-b">
        <h1 className="text-3xl font-bold">Gestión de Reportes</h1>
        <div className="flex space-x-2">
          <Button
            onClick={exportToPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          >
            <FileText className="w-5 h-5 mr-2" /> PDF
          </Button>
          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" /> Excel
          </Button>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        <Tabs
          className="py-4 border-b"
          selectedKey={activeTab}
          onSelectionChange={handleTabChange}
        >
          <Tab key="ventas" title="Reporte de Ventas" />
          <Tab key="compras" title="Reporte de Compras" />
          <Tab key="mermas" title="Reporte de Mermas" />
        </Tabs>

        <div className="flex items-center space-x-4">
          <Input
            placeholder="Código de barras"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-1/2"
          />
        </div>

        <div className="h-80">
          {activeTab === "ventas" ? (
            <Bar
              color="#9BD0F5"
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          ) : (
            <Line
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border shadow-md">
          {error ? (
            <center className="p-5">No hay datos que mostrar</center>
          ) : (
            <table className="min-w-full divide-y divide-gray-300 table-auto">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-left text-xs font-medium uppercase whitespace-nowrap cursor-pointer"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {sortConfig.key === col.key
                        ? sortConfig.direction === "ascending"
                          ? " ▲"
                          : " ▼"
                        : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      <Spinner label="Cargando..." />
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr key={index}>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-6 py-4 text-sm whitespace-nowrap"
                        >
                          {renderCell(item, col.key)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No hay datos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <Pagination
            isCompact
            showControls
            color="secondary"
            total={Math.ceil(sortedData.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={handlePageChange}
            size="lg"
          />
        </div>
      </CardBody>
    </Card>
  );
}
