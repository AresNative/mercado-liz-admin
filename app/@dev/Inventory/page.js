"use client";

import React, { useState, useMemo } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { useGetReportQuery } from "@/store/server/reducers/api-reducer";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar las escalas y componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ITEMS_PER_PAGE = 10; // Tamaño de página para la paginación

const DataTable = React.memo(function DataTable({
  columns,
  data,
  onSort,
  sortConfig,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border shadow-md">
      <table className="min-w-full divide-y divide-gray-300 table-auto">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium uppercase whitespace-nowrap cursor-pointer"
                onClick={() => onSort(col.key)}
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
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm whitespace-nowrap"
                  >
                    {item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

export default function GestionAlmacen() {
  const [activeTab, setActiveTab] = useState("inventario");
  const [barcode, setBarcode] = useState("");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  // Construir el queryParam basado en la existencia o no del código de barras
  const queryParam = barcode
    ? `almacen?art=${encodeURIComponent(barcode)}`
    : "almacen";

  // Obtener los datos usando el hook de consulta
  const {
    data: reportData,
    error,
    isLoading,
    refetch,
  } = useGetReportQuery(queryParam);

  // Memoizar el procesamiento de datos
  const { chartData, tableData, columns } = useMemo(() => {
    if (reportData && reportData.data && reportData.data.length > 0) {
      const labels = reportData.data.map((item) => item.art);
      const data = reportData.data.map((item) => item.cant);
      const columns = Object.keys(reportData.data[0]).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      }));
      return {
        chartData: {
          labels,
          datasets: [
            {
              label: "Stock por Producto",
              data,
              backgroundColor: "rgba(59, 130, 246, 0.5)",
            },
          ],
        },
        tableData: reportData.data,
        columns,
      };
    } else {
      return {
        chartData: { labels: [], datasets: [] },
        tableData: [],
        columns: [],
      };
    }
  }, [reportData]);

  const handleExportPDF = () => {
    console.log("Exportar a PDF");
  };

  const handleExportExcel = () => {
    console.log("Exportar a Excel");
  };

  const sortedData = useMemo(() => {
    if (sortConfig.key) {
      return [...tableData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return tableData;
  }, [tableData, sortConfig]);

  const handleSort = (columnKey) => {
    let direction = "ascending";
    if (sortConfig.key === columnKey && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sortedData.slice(start, end);
  }, [sortedData, page]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error al cargar los datos.</p>
        <Button onClick={refetch}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto p-4 flex-grow">
        <Card className="mt-4">
          <CardHeader className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
            <div className="flex space-x-2">
              <Button onClick={handleExportPDF} startContent={<FileText />}>
                PDF
              </Button>
              <Button
                onClick={handleExportExcel}
                startContent={<FileSpreadsheet />}
              >
                Excel
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Tabs
              aria-label="Opciones"
              selectedKey={activeTab}
              onSelectionChange={setActiveTab}
            >
              <Tab key="inventario" title="Inventario Actual">
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Buscar por código de barras"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                  <div className="h-[300px]">
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                  <DataTable
                    columns={columns}
                    data={paginatedData}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                  />
                  <div className="flex justify-center mt-4">
                    <Pagination
                      isCompact
                      showControls
                      color="secondary"
                      total={Math.ceil(tableData.length / ITEMS_PER_PAGE)}
                      page={page}
                      onChange={(page) => setPage(page)}
                      size="lg"
                    />
                  </div>
                </div>
              </Tab>
              <Tab key="movimientos" title="Movimientos">
                <div className="p-4">
                  Contenido de movimientos de inventario
                </div>
              </Tab>
              <Tab key="ajustes" title="Ajustes de Inventario">
                <div className="p-4">Contenido de ajustes de inventario</div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
