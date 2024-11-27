"use client"
import { useGetComprasQuery, useGetVentasQuery, useGetAlmacenQuery, useGetMermasQuery, useGetMovimientosQuery } from "@/actions/reducers/api-reducer";
import ReportTable from "@/components/ui/report-table";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Button, Card } from "@nextui-org/react";
import { useEffect, useState } from "react";
const UserPage = () => {
    function useQueryByType(selectedQueryType: string, buildQueryString: any) {
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
                return { data: null, error: null, isLoading: false, refetch: () => { } };
        }
    }

    // Definir el tipo para el filtro
    interface Filter {
        codigo: string;
        articulo: string;
        proveedor: string;
        descripcion: string;
    }

    const [selectedKeys] = useState<string>("get-compras"); // El tipo ya es string
    const [previewData, setPreviewData] = useState<any[]>([]); // Se ajusta como array de cualquier tipo, puedes mejorar el tipo según los datos esperados
    const [currentPage, setCurrentPage] = useState<number>(1); // El tipo ya es number
    /* -------------------------------------------- */
    const [totalRecords, setTotalRecords] = useState(0);

    const itemsPerPage = 8;

    const [filter] = useState<Filter>({
        codigo: "",
        articulo: "",
        proveedor: "",
        descripcion: "",
    });

    const [filterType] = useState<keyof Filter>("codigo"); // Tipo restringido a las claves de Filter

    const [startDate] = useState<string>(""); // El tipo es string
    const [endDate] = useState<string>(""); // El tipo es string

    const buildQueryString = (): string => {
        const query = new URLSearchParams();

        // Agregar el filtro seleccionado al query string
        if (filter[filterType]) query.append(filterType, filter[filterType]);
        if (startDate) query.append("startDate", startDate);
        if (endDate) query.append("endDate", endDate);

        query.append("page", currentPage.toString()); // Asegurarse de convertir el número a string
        query.append("pageSize", itemsPerPage.toString()); // Asegurarse de convertir el número a string

        return query.toString();
    };
    // Uso del hook en el componente
    const { data, isLoading, refetch } = useQueryByType(
        selectedKeys,
        buildQueryString
    );
    // Maneja los datos recibidos
    useEffect(() => {
        if (data && Array.isArray(data.data)) {
            setPreviewData(data.data);
            setTotalRecords(data.totalRecords);
        } else {
            setPreviewData([]);
        }
    }, [data, refetch]);
    useEffect(() => {
        if (data?.data && Array.isArray(data.data)) {
            const rows = data.data;
            if (rows.length > 0) {
                const columnsFromData: any = Object.keys(rows[0]).map((key) => ({
                    id: key,
                    label: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza el nombre de la columna
                    accessor: key,
                }));
                setColumns(columnsFromData);
            }
        }
    }, [data, refetch]);
    // Función para manejar el cambio de página
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalRecords / itemsPerPage)) {
            setCurrentPage(newPage);
        }
    };
    /* 
        ! senor //dnd-kit
    */
    const [columns, setColumns] = useState([]);
    const [draggedColumn, setDraggedColumn] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );// Función de manejo de finalización de arrastre
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) {
            const dragged = columns.find((col: any) => col.id === active.id);
            if (dragged) {
                //setFilteredColumns((prev) => [...prev, dragged]);
                setColumns((prev) => prev.filter((col: any) => col.id !== active.id));
            }
        } else if (active.id !== over.id) {
            const oldIndex = columns.findIndex((col: any) => col.id === active.id);
            const newIndex = columns.findIndex((col: any) => col.id === over.id);
            setColumns((items) => arrayMove(items, oldIndex, newIndex));
        }

        setDraggedColumn(null);
    };

    const handleSort = (columnId: any) => {
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

    return (
        <section>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={(event: any) => setDraggedColumn(event.active.id)}
            >
                <section className="flex flex-col lg:flex-row gap-4 mt-3">
                    <Card className="flex-1 
                                    p-4 
                                    shadow-none
                                    border-2
                                    rounded-lg
                                    bg-gray-50
                                    dark:bg-gray-800
                                    border-gray-200
                                    dark:border-gray-800">

                        <ReportTable
                            isLoaded={isLoading}
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
                                >
                                    Anterior
                                </Button>
                                <Button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={
                                        currentPage === Math.ceil(totalRecords / itemsPerPage)
                                    }
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
        </section>
    );
};

export default UserPage;
