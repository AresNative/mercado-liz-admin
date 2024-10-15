"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Spinner,
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartTooltip,
  Legend
);

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("ventas");
  const [barcode, setBarcode] = useState("");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setIsLoading(true);
    setReportData([]); // Limpiamos el estado de los datos
    setColumns([]); // Limpiamos las columnas

    try {
      const url = `http://matrizmercadoliz.dyndns.org:29010/api/v1/reporteria/${tab}`;
      const query =
        tab === "compras" ? `?codigo=${encodeURIComponent(barcode)}` : "";
      const res = await fetch(`${url}${query}`);

      if (!res.ok)
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      const json = await res.json();
      setReportData(json);
      const isCompras = tab === "compras";
      updateChartData(json, isCompras);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setReportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChartData = (items, isCompras = false) => {
    const aggregatedData = items.reduce((acc, item) => {
      const key = isCompras
        ? new Date(item.fechaEmision).toLocaleDateString()
        : item.cuenta || item.art || item.codigo || "Desconocido";

      const total =
        (item.cantidad || item.cant || 0) *
        (item.precio || item.price || item.costo || 0);

      acc[key] = (acc[key] || 0) + total;
      return acc;
    }, {});

    // Formatear los valores con símbolo de moneda
    const formatter = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    });

    const formattedData = Object.values(aggregatedData).map((value) =>
      formatter.format(value)
    );

    setChartData({
      labels: Object.keys(aggregatedData), // Fechas o cuentas
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

    console.log("Datos formateados:", formattedData);
  };

  const generateColumns = (data) =>
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
        }))
      : [];

  useEffect(() => {
    setColumns(generateColumns(reportData));
  }, [reportData]);

  const exportToPDF = () => {
    // Crear el documento con orientación 'landscape'
    const doc = new jsPDF({
      orientation: "landscape", // Horizontal
      unit: "px", // Unidades en pixeles para mayor control
      format: "a4", // Formato de hoja A4
    });

    const tableColumn = columns.map((col) => col.label);
    const tableRows = reportData.map((item) =>
      columns.map((col) => item[col.key] || "-")
    );

    // Agregar tabla con autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Margen superior para que no choque con el borde
      theme: "striped", // Tema opcional (puede ser 'grid', 'striped', 'plain')
      headStyles: { fillColor: [41, 128, 185] }, // Estilo del encabezado
    });

    // Guardar el documento como PDF
    doc.save("reporte.pdf");
  };

  const exportToExcel = () => {
    const dataToExport = reportData.map((item) =>
      columns.reduce(
        (row, col) => ({ ...row, [col.label]: item[col.key] || "-" }),
        {}
      )
    );
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, "reporte.xlsx");
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    fetchData(key); // Al cambiar de pestaña, se hace una nueva petición.
  };

  const renderCell = useCallback((item, columnKey) => {
    const value = item?.[columnKey] || "-";

    // Verificar si el campo es 'fechaEmision'
    if (columnKey === "fechaEmision" && value !== "-") {
      return new Date(value).toLocaleDateString();
    }

    // Verificar si el campo es 'costo' o 'price'
    if ((columnKey === "costo" || columnKey === "price") && value !== "-") {
      return parseFloat(value).toFixed(2); // Formatear a 2 decimales
    }

    // Retornar el valor tal cual para otros campos
    return value;
  }, []);

  return (
    <Card className="max-w-6xl mx-auto my-12 p-8 rounded-xl shadow-lg">
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
        </Tabs>

        <div className="flex items-center space-x-4">
          <Input
            placeholder="Código de barras"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-1/2"
          />
          <Button
            onClick={() => fetchData(activeTab)}
            className="bg-black text-white"
          >
            Buscar
          </Button>
        </div>

        <div className="h-80">
          {activeTab === "ventas" ? (
            <Bar
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
          <table className="min-w-full divide-y divide-gray-300 table-auto">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium uppercase whitespace-nowrap"
                  >
                    {col.label}
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
              ) : reportData.length > 0 ? (
                reportData.map((item, index) => (
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
        </div>
      </CardBody>
    </Card>
  );
}
