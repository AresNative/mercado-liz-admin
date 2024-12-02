"use client";

import { exportToExcel, exportToPDF, handleFileUpload } from "@/components/func/export-import";
import ReportInputs from "@/components/func/report-inputs";
import FileList from "@/components/ui/filelist";
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
import { Button, ButtonGroup, Select, SelectItem } from "@nextui-org/react";
import { ChartBar, ChartCandlestick, ChartLine, ChartPie, CloudUpload, Eye, FileChartColumn, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
const UserPage = () => {
    const fileInputRef: any = useRef(null);
    const [Keys, selectedKeys] = useState<string>("get-ventas")
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const itemsPerPage = 13;
    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setCurrentPage(() => { return 1 });
        selectedKeys(e.target.value);
    };
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
        setCurrentPage(() => { return 1 });
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
    console.log(startDate, endDate);

    ////////
    // ? consulta de datos
    const { data, isLoading, error } = useQueryByType(
        Keys,
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
    if (error) return <p>Error al cargar los datos</p>;
    // * data example
    const files = [
        { name: "config.json", extension: "json", size: "2.3 KB" },
        { name: "app.tsx", extension: "tsx", size: "4.1 KB" },
        { name: "styles.css", extension: "css", size: "1.8 KB" },
        { name: "utils.ts", extension: "ts", size: "892 B" },
        { name: "README.md", extension: "md", size: "4.2 KB" },
        { name: "logo.svg", extension: "svg", size: "3.1 KB" },
        { name: "index.js", extension: "js", size: "1.5 KB" },
        { name: "types.d.ts", extension: "ts", size: "567 B" },
    ];
    const headers = columns.map(column => column.label || column.Header);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    return (
        <>{/* div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700" */}
            <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2">
                <Box height="6rem">
                    <div className="w-full">
                        <ReportInputs
                            filterType={filterType}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            handleFilterTypeChange={handleFilterTypeChange}
                            handleFilterChange={handleFilterChange}
                        />
                        <ButtonGroup className="flex m-2">
                            <Button
                                onClick={() => {
                                    exportToExcel(previewData)
                                }}>
                                Exel <FileChartColumn
                                    className="stroke-green-500" />
                            </Button>
                            {/* ///////////////// */}
                            <Button
                                onClick={() => {
                                    exportToPDF(headers, previewData)
                                }}>
                                PDF <FileText
                                    className="stroke-red-500" />
                            </Button>
                            {/* ///////////////// */}
                            <Button onClick={handleButtonClick}>
                                Subir archivo <CloudUpload
                                    className="stroke-purple-500" />
                            </Button>
                        </ButtonGroup>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </div>
                </Box>
                <Box height="6rem" >
                    <FileList files={files} />
                </Box>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={({ active }: any) => setDraggedColumn(active.id)}
            >
                <section className="flex flex-col lg:flex-row gap-4 mt-3">
                    <Box>
                        <section className="flex justify-between items-center p-2">
                            <span>
                                <Select
                                    placeholder="Selecciona consulta"
                                    selectionMode="single"
                                    onChange={handleSelectionChange}
                                    selectedKeys={[Keys]}
                                    className="w-40"
                                    items={[
                                        { value: "get-compras", label: "Compras" },
                                        { value: "get-ventas", label: "Ventas" },
                                        { value: "get-mermas", label: "Mermas" },
                                        { value: "get-movimientos", label: "Movimientos" },
                                    ]}
                                >
                                    {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
                                </Select>
                            </span>

                            <div className="flex gap-2">
                                <Select
                                    placeholder="Selecciona tipo de grafica"
                                    selectionMode="single"
                                    onChange={handleSelectionChange}
                                    selectedKeys={[Keys]}
                                    className="w-40"
                                    startContent={<ChartCandlestick />}
                                    items={[
                                        {
                                            value: "get-compras",
                                            label: "Area",
                                            icon: <ChartCandlestick className="w-6 h-6" />,
                                        },
                                        {
                                            value: "get-ventas",
                                            label: "Barras",
                                            icon: <ChartBar className="w-6 h-6" />,
                                        },
                                        {
                                            value: "get-mermas",
                                            label: "Pastel",
                                            icon: <ChartPie className="w-6 h-6" />,
                                        },
                                        {
                                            value: "get-movimientos",
                                            label: "Lineas",
                                            icon: <ChartLine className="w-6 h-6" />,
                                        },
                                    ]}
                                >
                                    {(item) => (
                                        <SelectItem key={item.value} startContent={item.icon}>
                                            {item.label}
                                        </SelectItem>
                                    )}
                                </Select>
                                <Button color="secondary" variant="solid">
                                    Ver <Eye />
                                </Button>
                            </div>
                        </section>

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
        </>
    );
};
export default UserPage;