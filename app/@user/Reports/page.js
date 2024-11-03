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

//import Filtros from "@/components/func/filtros";
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
import { DefaultPage } from "@/template/default-page";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GeneradorReportes() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState({
    codigo: "",
    articulo: "",
    proveedor: "",
    descripcion: "",
  });
  const [filterType, setFilterType] = useState("codigo"); // Tipo de filtro seleccionado
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
  //const [filteredColumns, setFilteredColumns] = useState([]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (columnId) => {
    let direction = "asc";
    if (sortConfig.key === columnId && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnId, direction });

    const sortedData = [...previewData].sort((a, b) => {
      if (a[columnId] < b[columnId]) return direction === "asc" ? -1 : 1;
      if (a[columnId] > b[columnId]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setPreviewData(sortedData);
  };

  const itemsPerPage = 8;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Construir el query string basado en los filtros
  const buildQueryString = () => {
    const query = new URLSearchParams();

    // Agregar el filtro seleccionado al query string
    if (filter[filterType]) query.append(filterType, filter[filterType]);
    if (startDate) query.append("startDate", startDate);
    if (endDate) query.append("endDate", endDate);

    query.append("page", currentPage);
    query.append("pageSize", itemsPerPage);

    return query.toString();
  };

  // Obtener datos usando el hook de RTK Query con el query string construido
  const { data, error, isLoading, refetch } = useGetTestQueryQuery(
    buildQueryString(),
    { refetchOnMountOrArgChange: true }
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

  // Volver a cargar los datos al cambiar la página o los filtros
  useEffect(() => {
    refetch(); // Volver a ejecutar la consulta al cambiar de página o filtro
  }, [currentPage, filter, startDate, endDate, refetch]);

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilter(""); // Reiniciar el filtro al cambiar de tipo
  };

  // Función para manejar el cambio del valor del filtro
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Función para manejar el cambio de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalRecords / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Datos para la gráfica de barras
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
        //setFilteredColumns((prev) => [...prev, dragged]);
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
    <DefaultPage>
      <section className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1 w-full mt-2 mx-auto p-8">
          <h2 className="text-2xl font-bold mb-6">Búsqueda rápida</h2>
          <ReportInputs
            filterType={filterType}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            handleFilterTypeChange={handleFilterTypeChange}
            handleFilterChange={handleFilterChange}
          />
        </Card>
        <Card className="flex-1 w-full mt-2 mx-auto p-8">
          {isLoading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>Error al cargar los datos</p>
          ) : (
            previewData.length > 0 && (
              <Bar
                data={chartData}
                options={{ responsive: true }}
                className="w-full max-h-60 min-h-44"
              />
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
        {/* <section className="mt-3">
          <Filtros
            columns={columns}
            filteredColumns={filteredColumns}
            setFilteredColumns={setFilteredColumns}
            setColumns={setColumns}
          />
        </section> */}

        <section className="flex flex-col lg:flex-row gap-4 mt-3">
          <Card className="flex-1 p-4 shadow-md">
            <ReportTable
              columns={columns}
              paginatedData={previewData}
              isDragging={!!draggedColumn}
              onSort={handleSort}
              sortConfig={sortConfig}
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
    </DefaultPage>
  );
}
