"use client";

import ReportInputs from "@/components/func/report-inputs";
import PaginationTable from "@/components/ui/table/pagination";
import ReportTable from "@/components/ui/table/report-table";
import Box from "@/components/ui/template/box";
import { useQueryByType } from "@/hooks/load-data";
import { Filter } from "@/interfaces/tables";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
const UserPage = () => {
    const [selectedKeys] = useState("get-compras");
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const itemsPerPage = 13;
    ////////
    // ? filtros y funcionalidad
    const [filter, setFilter] = useState<Filter>({
        codigo: "",
        articulo: "",
        proveedor: "",
        descripcion: "",
    });
    const [filterType, setFilterType] = useState<keyof Filter>("codigo");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleFilterTypeChange = (e: any) => {
        console.log(e);

        setCurrentPage(1);
        setFilterType(e.anchorKey);
    };
    const handleFilterChange = (e: any) => {
        const value = e.target.value;
        setFilter((prev) => ({
            ...prev,
            [filterType]: value,
        }));
    };

    const buildQueryString = (): string => {
        const query = new URLSearchParams({
            page: currentPage.toString(),
            pageSize: itemsPerPage.toString(),
            ...(filter[filterType] && { [filterType]: filter[filterType] }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
        });
        return query.toString();
    };
    ////////
    // ? consulta de datos
    const { data, isLoading, error } = useQueryByType(
        selectedKeys,
        buildQueryString
    );

    useEffect(() => {
        if (data?.data) {
            setPreviewData(data.data);
            setTotalRecords(data.totalRecords || 0);
        } else {
            setPreviewData([]);
        }
    }, [data]);
    ////////
    // ? construccion de la tabla
    const [columns, setColumns] = useState<any[]>([]);
    useEffect(() => {
        if (data?.data?.length) {
            const columnsFromData = Object.keys(data.data[0]).map((key) => ({
                id: key,
                label: key.charAt(0).toUpperCase() + key.slice(1),
                accessor: key,
            }));
            setColumns(columnsFromData);
        }
    }, [data]);
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalRecords / itemsPerPage)) {
            setCurrentPage(newPage);
        }
    };
    ////////
    // ? configuracion de drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );
    const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
    const handleDragEnd = ({ active, over }: any) => {
        if (over && active.id !== over.id) {
            setColumns((items) =>
                arrayMove(
                    items,
                    items.findIndex((col) => col.id === active.id),
                    items.findIndex((col) => col.id === over.id)
                )
            );
        }
        setDraggedColumn(null);
    };
    ////////
    // ? configuracion de sorteable (orden alfabetico y numerico)
    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: "asc",
    });
    const handleSort = (columnId: string) => {
        const newDirection =
            sortConfig.key === columnId && sortConfig.direction === "asc"
                ? "desc"
                : "asc";
        setSortConfig({ key: columnId, direction: newDirection });

        setPreviewData((prevData) =>
            [...prevData].sort((a, b) =>
                newDirection === "asc"
                    ? a[columnId] < b[columnId]
                        ? -1
                        : 1
                    : a[columnId] > b[columnId]
                        ? -1
                        : 1
            )
        );
    };
    // ? estados de consultas
    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los datos</p>;
    return (
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <Box height="6rem">
                    <ReportInputs
                        filterType={filterType}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        handleFilterTypeChange={handleFilterTypeChange}
                        handleFilterChange={handleFilterChange}
                    />
                </ Box>
                <Box height="6rem" />
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={({ active }: any) => setDraggedColumn(active.id)}
            >
                <section className="flex flex-col lg:flex-row gap-4 mt-3">
                    <Box>
                        <ReportTable
                            isLoaded={isLoading}
                            columns={columns}
                            paginatedData={previewData}
                            isDragging={!!draggedColumn}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                        />
                        <PaginationTable
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalRecords={totalRecords}
                            handlePageChange={handlePageChange}
                        />
                    </Box>
                </section>
            </DndContext>
        </div>
    );
};
export default UserPage;