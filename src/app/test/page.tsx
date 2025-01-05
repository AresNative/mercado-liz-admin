'use client';
import ReportTable from "@/components/ui/table/report-table";
import { useQueryByType, useAutocompleteByType } from "@/hooks/test";
import { Autocomplete, AutocompleteItem, Pagination, Select, SelectItem } from "@nextui-org/react";
import { ChartCandlestick } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function Ejemplo() {
    const [filterKeys, setFilterKeys] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [Keys, selectedKeys] = useState<string>("get-compras")

    const debouncedFilter = useDebounce(filterKeys, 30);

    // Función para construir la cadena de consulta
    const buildQueryString = useCallback((): string => {
        const query = new URLSearchParams({
            Descripcion1: debouncedFilter || '',
            page: currentPage.toString(),
        }).toString();
        return query;
    }, [debouncedFilter, currentPage]);

    const handleFilterChange = useCallback((value: any) => {
        setFilterKeys(value);
        setCurrentPage(1); // Reiniciar a la página 1 al buscar
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setCurrentPage(newPage);
    }, []);
    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentPage(() => { return 1 });
        selectedKeys(e.target.value);
    };

    const { data: dataCompras, isLoading: isLoadingCompras } = useQueryByType(
        Keys,
        buildQueryString
    );

    const { data: dataAutocompletar } = useAutocompleteByType(
        Keys,
        () => `searchField=A.Descripcion1&searchTerm=${debouncedFilter}`
    );

    useEffect(() => {
        if (dataCompras?.data?.length) {
            setPreviewData(dataCompras.data);
            setTotalRecords(dataCompras.totalRecords || 0);

            if (columns.length === 0 && dataCompras.data.length > 0) {
                const generatedColumns = Object.keys(dataCompras.data[0]).map((key) => ({
                    id: key,
                    label: key.charAt(0).toUpperCase() + key.slice(1),
                    accessor: key,
                }));
                setColumns(generatedColumns);
            }
        } else {
            setPreviewData([]);
        }
    }, [dataCompras]);

    return (
        <div className="flex flex-col gap-4">
            <section className="flex gap-4">
                <Select
                    placeholder="Selecciona tipo de grafica"
                    selectionMode="single"
                    onChange={handleSelectionChange}
                    selectedKeys={[Keys]}
                    className="w-40"
                    startContent={<ChartCandlestick />}
                    items={[
                        { value: "get-compras", label: "Compras" },
                        { value: "get-ventas", label: "Ventas" },
                        { value: "get-mermas", label: "Mermas" },
                        { value: "get-movimientos", label: "Movimientos" },
                    ]}
                >
                    {(item) => (
                        <SelectItem key={item.value}>
                            {item.label}
                        </SelectItem>
                    )}
                </Select>
                <Autocomplete
                    placeholder="Buscar"
                    onSelectionChange={handleFilterChange}
                    onInputChange={handleFilterChange}
                    className="w-full"
                >
                    {dataAutocompletar?.data?.length > 0 ? (
                        dataAutocompletar.data.map((row: string, index: number) => (
                            <AutocompleteItem key={`${row}-${index}`}>{row}</AutocompleteItem>
                        ))
                    ) : (
                        <AutocompleteItem key="no-data">Sin resultados</AutocompleteItem>
                    )}
                </Autocomplete>
            </section>

            <ReportTable
                isLoaded={isLoadingCompras}
                columns={columns}
                paginatedData={previewData}
                isDragging={[]}
                onSort={[]}
                sortConfig={[]}
            />

            <Pagination
                classNames={{
                    wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
                    item: "w-8 h-8 text-small rounded-none bg-transparent",
                    cursor:
                        "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold",
                }}
                page={currentPage}
                total={Math.ceil(totalRecords / 10)}
                onChange={handlePageChange}
            />
        </div>
    );
}
