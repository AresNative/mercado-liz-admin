"use client";

import ReportTable from "@/components/ui/report-table";
import { useQueryByType } from "@/hooks/load-data";
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
    interface Filter {
        codigo: string;
        articulo: string;
        proveedor: string;
        descripcion: string;
    }

    const [selectedKeys] = useState("get-compras");
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const itemsPerPage = 8;

    const [filter] = useState<Filter>({
        codigo: "",
        articulo: "",
        proveedor: "",
        descripcion: "",
    });

    const [filterType] = useState<keyof Filter>("codigo");
    const [startDate] = useState("");
    const [endDate] = useState("");

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

    const { data, isLoading } = useQueryByType(
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

    const [columns, setColumns] = useState<any[]>([]);
    const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: "asc",
    });

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

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

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

    return (
        <section>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={({ active }: any) => setDraggedColumn(active.id)}
            >
                <section className="flex flex-col lg:flex-row gap-4 mt-3">
                    <Card className="flex-1 p-4 shadow-none border-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-800">
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
            </DndContext>
        </section>
    );
};

export default UserPage;
