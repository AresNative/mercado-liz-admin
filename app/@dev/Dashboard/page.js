"use client";

import { useState, useEffect } from "react";
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
import { useGetTestQueryQuery } from "@/store/server/reducers/api-reducer";

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
    { id: "Codigo", label: "Código" },
    { id: "Articulo", label: "Artículo" },
    { id: "Nombre", label: "Nombre" },
    { id: "Estatus", label: "Estatus" },
    { id: "Unidad", label: "Unidad" },
    { id: "Equivalente", label: "Equivalente" },
    { id: "CompraID", label: "Compra ID" },
    { id: "Cantidad", label: "Cantidad" },
    { id: "Costo", label: "Costo" },
    { id: "Sucursal", label: "Sucursal" },
    { id: "MovID", label: "Mov ID" },
    { id: "FechaEmision", label: "Fecha Emisión" },
    { id: "Proveedor", label: "Proveedor" },
    { id: "ProveedorNombre", label: "Nombre del Proveedor" },
    { id: "Impuestos", label: "Impuestos" },
  ]);
  const [filteredColumns, setFilteredColumns] = useState([]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 8;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Función para manejar el cambio de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalRecords / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Obtener datos usando el hook de RTK Query
  const { data, error, isLoading, refetch } = useGetTestQueryQuery(
    `?page=${currentPage}&pageSize=${itemsPerPage}`, // Corrección del query string
    { refetchOnMountOrArgChange: true } // Permite refetch cuando cambian los argumentos
  );

  // Maneja los datos recibidos
  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setPreviewData(data.data); // Asignar la data a previewData
      setTotalRecords(data.totalRecords); // Establecer el total de registros
    } else {
      setPreviewData([]);
    }
  }, [data]);

  // Volver a cargar los datos al cambiar la página
  useEffect(() => {
    refetch(); // Volver a ejecutar la consulta al cambiar de página
  }, [currentPage, refetch]);

  const chartData = {
    labels: previewData.map((item) =>
      new Date(item.FechaEmision).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Cantidad",
        data: previewData.map((item) => item.Cantidad),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <section className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1 mt-2 mx-auto p-8">
          <h2 className="text-2xl font-bold mb-6">Generador de Reportes</h2>
          <ReportInputs
            filter={filter}
            setFilter={setFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Card>
        <Card className="flex-1 mt-2 mx-auto p-8">
          {isLoading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>Error al cargar los datos</p>
          ) : (
            previewData.length > 0 && (
              <Bar data={chartData} options={{ responsive: true }} />
            )
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
              paginatedData={previewData}
              isDragging={!!draggedColumn}
            />

            <div className="flex justify-between items-center mt-4">
              <span>
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, totalRecords)} de{" "}
                {totalRecords}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  bordered
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(totalRecords / itemsPerPage)
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
