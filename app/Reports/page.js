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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = `http://matrizmercadoliz.dyndns.org:29010/api/v1/reporteria/${activeTab}`;
      const query =
        activeTab === "compras" ? `?codigo=${encodeURIComponent(barcode)}` : "";
      const res = await fetch(`${url}${query}`);

      if (!res.ok)
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      const json = await res.json();
      setReportData(json);
      updateChartData(json);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setReportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChartData = (items) => {
    const aggregatedData = items.reduce((acc, item) => {
      const cuenta = item.cuenta || item.art || item.codigo || "Desconocido";
      const totalVentas =
        (item.cantidad || item.cant || 0) *
        (item.precio || item.price || item.costo || 0);

      acc[cuenta] = (acc[cuenta] || 0) + totalVentas;
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(aggregatedData),
      datasets: [
        {
          label: "Total Ventas",
          data: Object.values(aggregatedData),
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    if (barcode) fetchData();
  }, [activeTab, barcode]);

  const generateColumns = (data) =>
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
        }))
      : [];

  useEffect(() => setColumns(generateColumns(reportData)), [reportData]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map((col) => col.label);
    const tableRows = reportData.map((item) =>
      columns.map((col) => item[col.key] || "-")
    );
    doc.autoTable({ head: [tableColumn], body: tableRows });
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

  const renderCell = useCallback(
    (item, columnKey) => item?.[columnKey] || "-",
    []
  );

  return (
    <Card className="max-w-6xl mx-auto my-12 p-8 rounded-xl shadow-lg bg-white">
      <CardHeader className="flex justify-between items-center pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Reportes
        </h1>
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
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          className="border-b border-gray-200"
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
          <Button onClick={fetchData} className="bg-black text-white">
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

        <div className="overflow-auto rounded-lg shadow">
          {columns.length > 0 ? (
            <Table className="min-w-full border border-gray-300">
              <TableHeader>
                {columns.map((col) => (
                  <TableColumn key={col.key} className="p-4 text-left">
                    {col.label}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-4"
                    >
                      <Spinner label="Cargando..." />
                    </TableCell>
                  </TableRow>
                ) : reportData.length > 0 ? (
                  reportData.map((item, index) => (
                    <TableRow key={index} className="even:bg-gray-50">
                      {columns.map((col) => (
                        <TableCell key={col.key} className="p-4">
                          {renderCell(item, col.key)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-4 text-gray-500"
                    >
                      No hay datos para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500">
              No hay columnas disponibles para mostrar.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
