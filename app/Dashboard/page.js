"use client";

import { useState } from "react";
import { Button, Card } from "@nextui-org/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import Filtros from "@/components/func/filtros";
import ReportInputs from "@/components/func/report-inputs";
import ReportTable from "@/components/ui/report-table";
import DragOverlayColumn from "@/components/func/drag-overlay-column";

import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
export default function GeneradorReportes() {
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("");
  const [columns, setColumns] = useState([
    { id: "id", label: "ID" },
    { id: "fecha", label: "Fecha" },
    { id: "ventas", label: "Ventas" },
    { id: "producto", label: "Producto" },
  ]);
  const [filteredColumns, setFilteredColumns] = useState([]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Función para generar datos de muestra
  const handleGenerateReport = () => {
    const sampleData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      fecha: `2023-05-${String(i + 1).padStart(2, "0")}`,
      ventas: Math.floor(Math.random() * 5000) + 1000,
      producto: `Producto ${String.fromCharCode(65 + (i % 26))}`,
    }));

    setPreviewData(sampleData);
    setCurrentPage(1);
    alert("El reporte ha sido generado exitosamente.");
  };

  // Función de manejo de finalización de arrastre
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      const dragged = columns.find((col) => col.id === active.id);
      if (dragged) {
        setFilteredColumns((prev) => [...prev, dragged]);
        setColumns((prev) => prev.filter((col) => col.id !== active.id));
      }
    } else if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setDraggedColumn(null);
  };

  // Cálculo de datos paginados
  const paginatedData = previewData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Manejo de cambio de página
  const handlePageChange = (direction) => {
    if (direction === "next") {
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(previewData.length / itemsPerPage))
      );
    } else {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };
  const chartData = {
    labels: previewData.map((item) => item.fecha),
    datasets: [
      {
        label: "Ventas",
        data: previewData.map((item) => item.ventas),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="max-w-6xl mx-auto p-4">
      <section className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1 mt-2 mx-auto p-8">
          <h2 className="text-2xl font-bold mb-6">Generador de Reportes</h2>
          <ReportInputs
            reportType={reportType}
            setReportType={setReportType}
            filter={filter}
            setFilter={setFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            handleGenerateReport={handleGenerateReport}
          />
        </Card>
        <Card className="flex-1 mt-2 mx-auto p-8">
          {previewData.length > 0 && (
            <Bar data={chartData} options={{ responsive: true }} />
          )}
        </Card>
      </section>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => setDraggedColumn(event.active.id)}
      >
        <section className="flex flex-col lg:flex-row gap-4 mt-6">
          <Filtros
            columns={columns}
            filteredColumns={filteredColumns}
            setFilteredColumns={setFilteredColumns}
            setColumns={setColumns}
          />
          <Card className="flex-1 p-4 shadow-md">
            <ReportTable
              columns={columns}
              paginatedData={paginatedData}
              isDragging={!!draggedColumn}
            />

            {/* Información y controles de paginación */}
            <div className="flex justify-between items-center mt-4">
              <span>
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, previewData.length)} de{" "}
                {previewData.length}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                  bordered
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => handlePageChange("next")}
                  disabled={
                    currentPage === Math.ceil(previewData.length / itemsPerPage)
                  }
                  bordered
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <DragOverlay>
          {draggedColumn && (
            <DragOverlayColumn
              column={columns.find((col) => col.id === draggedColumn)}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
