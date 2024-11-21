"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import ReportInputs from "@/components/func/report-inputs";
import ReportTable from "@/components/ui/report-table";
import DragOverlayColumn from "@/components/func/drag-overlay-column";

import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  useGetAlmacenQuery,
  useGetComprasQuery,
  useGetMermasQuery,
  useGetMovimientosQuery,
  useGetVentasQuery,
} from "@/store/server/reducers/api-reducer";

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
import { Filter } from "lucide-react";

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

  //const [filteredColumns, setFilteredColumns] = useState([]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedKeys, setSelectedKeys] = useState(new Set(["get-compras"]));
  const [columns, setColumns] = useState([]);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

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

  const selectedQueryType = Array.from(selectedKeys)[0];
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

  function useQueryByType(selectedQueryType, buildQueryString) {
    // Ejecutar solo la consulta seleccionada
    const comprasQuery = useGetComprasQuery(
      selectedQueryType === "get-compras" ? buildQueryString() : "",
      {
        skip: selectedQueryType !== "get-compras",
        refetchOnMountOrArgChange: true,
      }
    );

    const ventasQuery = useGetVentasQuery(
      selectedQueryType === "get-ventas" ? buildQueryString() : "",
      {
        skip: selectedQueryType !== "get-ventas",
        refetchOnMountOrArgChange: true,
      }
    );

    const almacenQuery = useGetAlmacenQuery(
      selectedQueryType === "get-almacen" ? buildQueryString() : "",
      {
        skip: selectedQueryType !== "get-almacen",
        refetchOnMountOrArgChange: true,
      }
    );

    const mermasQuery = useGetMermasQuery(
      selectedQueryType === "get-mermas" ? buildQueryString() : "",
      {
        skip: selectedQueryType !== "get-mermas",
        refetchOnMountOrArgChange: true,
      }
    );

    const movimientosQuery = useGetMovimientosQuery(
      selectedQueryType === "get-movimientos" ? buildQueryString() : "",
      {
        skip: selectedQueryType !== "get-movimientos",
        refetchOnMountOrArgChange: true,
      }
    );

    // Seleccionar la consulta adecuada según el tipo
    switch (selectedQueryType) {
      case "get-compras":
        return comprasQuery;
      case "get-ventas":
        return ventasQuery;
      case "get-almacen":
        return almacenQuery;
      case "get-mermas":
        return mermasQuery;
      case "get-movimientos":
        return movimientosQuery;
      default:
        return { data: null, error: null, isLoading: false, refetch: () => {} };
    }
  }

  // Uso del hook en el componente
  const { data, error, isLoading, refetch } = useQueryByType(
    selectedQueryType,
    buildQueryString
  );

  // Refetch cuando cambia la selección
  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [selectedQueryType, refetch]);

  // Maneja los datos recibidos
  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setPreviewData(data.data);
      setTotalRecords(data.totalRecords);
    } else {
      setPreviewData([]);
    }
  }, [data, refetch]);

  const handleFilterTypeChange = (e) => {
    setCurrentPage(1);
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
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      const rows = data.data;
      if (rows.length > 0) {
        const columnsFromData = Object.keys(rows[0]).map((key) => ({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza el nombre de la columna
          accessor: key,
        }));
        setColumns(columnsFromData);
      }
    }
  }, [data]);
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
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      setColumns((items) => arrayMove(items, oldIndex, newIndex));
    }

    setDraggedColumn(null);
  };

  return (
    <DefaultPage>
      <section className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1 w-full mt-2 mx-auto p-8">
          <section className="flex justify-between">
            <h2 className="text-2xl font-bold mb-6">Búsqueda rápida</h2>
            <Button size="sm" variant="bordered">
              <Filter size={16} strokeWidth={0.75} />
            </Button>
          </section>
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
        <section className="flex flex-col lg:flex-row gap-4 mt-3">
          <Card className="flex-1 p-4 shadow-md">
            <section className="max-w-16 m-1">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="capitalize">
                    {selectedValue}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="flat"
                  closeOnSelect={false}
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                >
                  <DropdownItem key="get-compras">Compras</DropdownItem>
                  <DropdownItem key="get-ventas">Ventas</DropdownItem>
                  <DropdownItem key="get-mermas">Mermas</DropdownItem>
                  <DropdownItem key="get-movimientos">Movimientos</DropdownItem>
                  <DropdownItem key="get-almacen">Almacen</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </section>

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
        {/* <DragOverlay>
          {draggedColumn && (
            <DragOverlayColumn
              column={columns.find((col) => col.id === draggedColumn)}
            />
          )}
        </DragOverlay> */}
      </DndContext>
    </DefaultPage>
  );
}
