"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
    ChartBarIncreasing,
    ChartNetwork,
    CircleDollarSign,
} from "lucide-react";
import { ChartData } from "@/app/grafic/@user/page";
import { RenderChart } from "@/app/grafic/components/render-grafic";
import {
    loadData,
    loadDataGrafic,
    formatFilter,
} from "@/app/grafic/constants/load-data";
import { useGetVentasMutation } from "@/hooks/reducers/api";
import { formatJSON, formatValue } from "@/utils/constants/format-values";
import MainForm from "@/components/form/main-form";
import DynamicTable from "@/components/table";
import CardResumen from "@/app/mermas/components/card-resumen";
import { FiltersField } from "../constants/filters";
import Pagination from "@/components/pagination";

interface VentasTableItem {
    id: string;
    Nombre: string;
    Almacen: string;
    FechaEmision: string;
    Importe: number;
    Cantidad: number;
    [key: string]: any;
}

const formatAPIDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

export default function Ventas() {
    // Estados para datos y resúmenes
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const [dataTable, setDataTable] = useState<VentasTableItem[]>([]);
    const [total, setTotal] = useState("$0.00");
    const [cantidad, setCantidad] = useState("0");
    const [motivo, setMotivo] = useState("N/A");
    const [porcentajeMotivo, setPorcentajeMotivo] = useState("N/A");
    const [error, setError] = useState<string | null>(null);

    // Estados de carga
    const [loading, setLoading] = useState({
        chart: false,
        summary: false,
        table: false,
    });

    // Hook para la llamada a la API
    const [getVentas] = useGetVentasMutation();

    // Estados para filtros y paginación
    const [searchParam, setSearchParam] = useState("");
    const [sucursal, setSucursal] = useState("");
    const [fechaInicial, setFechaInicial] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Estados debounced
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [debouncedSucursal, setDebouncedSucursal] = useState("");
    const [debouncedFechaInicial, setDebouncedFechaInicial] = useState("");
    const [debouncedFechaFinal, setDebouncedFechaFinal] = useState("");

    // Debounce de 50ms para filtros
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchParam);
            setDebouncedSucursal(sucursal);
            setDebouncedFechaInicial(fechaInicial);
            setDebouncedFechaFinal(fechaFinal);
            setCurrentPage(1);
        }, 50);
        return () => clearTimeout(timer);
    }, [searchParam, sucursal, fechaInicial, fechaFinal]);

    // Generación de filtros optimizada
    const filtros = useMemo(() => {
        const arr: formatFilter[] = [];

        if (debouncedSearch) {
            arr.push({
                key: "Nombre",
                value: `%${debouncedSearch}%`,
                operator: "like"
            });
        }

        if (debouncedSucursal) {
            debouncedSucursal.split(',')
                .map(s => s.trim())
                .filter(Boolean)
                .forEach(sucursal => {
                    arr.push({
                        key: "Almacen",
                        value: sucursal,
                        operator: "="
                    });
                });
        }

        const fi = formatAPIDate(debouncedFechaInicial);
        const ff = formatAPIDate(debouncedFechaFinal);

        if (fi && ff) {
            arr.push(
                { key: "FechaEmision", value: fi, operator: ">=" },
                { key: "FechaEmision", value: ff, operator: "<=" }
            );
        } else {
            if (fi) arr.push({ key: "FechaEmision", value: fi, operator: ">=" });
            if (ff) arr.push({ key: "FechaEmision", value: ff, operator: "<=" });
        }

        return arr;
    }, [debouncedSearch, debouncedSucursal, debouncedFechaInicial, debouncedFechaFinal]);

    // Función para procesar totales
    const processTotals = (data: any[]) => {
        if (data.length === 0) {
            return {
                totalImporte: 0,
                totalCantidad: 0,
                maxItem: { Cliente: "Sin datos", Importe: 0 }
            };
        }

        return data.reduce((acc, item) => {
            acc.totalImporte += item.Importe || 0;
            acc.totalCantidad += item.Cantidad || 0;

            if (item.Importe > (acc.maxItem?.Importe || 0)) {
                acc.maxItem = item;
            }

            return acc;
        }, {
            totalImporte: 0,
            totalCantidad: 0,
            maxItem: data[0]
        });
    };

    // Carga de datos
    const loadDataFromAPI = useCallback(async () => {
        setError(null);
        setLoading({ chart: true, summary: true, table: true });

        try {
            const [chartResult, totalResult, tableResult] = await Promise.allSettled([
                loadDataGrafic(getVentas, {
                    filters: { filtros, sumas: [{ key: "Categoria" }] },
                    page: 1,
                    sum: true
                }, "Categoria"),
                loadData(getVentas, {
                    filters: { filtros, sumas: [{ key: "Cliente" }] },
                    page: 1,
                    pageSize: 100,
                    sum: true
                }),
                loadData(getVentas, {
                    filters: { filtros, sumas: [{ key: "Nombre" }, { key: "Almacen" }, { key: "FechaEmision" }] },
                    page: currentPage,
                    sum: true
                })
            ]);

            // Procesar gráfico
            if (chartResult.status === "fulfilled") {
                setPreviewData(chartResult.value ?? []);
            } else {
                console.error("Error gráfico:", chartResult.reason);
            }
            setLoading(prev => ({ ...prev, chart: false }));

            // Procesar totales
            if (totalResult.status === "fulfilled") {
                const resultData = totalResult.value?.data || [];
                const { totalImporte, totalCantidad, maxItem } = processTotals(resultData);

                setTotal(formatValue(totalImporte, "currency"));
                setCantidad(formatValue(totalCantidad, "number"));
                setMotivo(maxItem.Cliente || "Sin datos");
                setPorcentajeMotivo(
                    totalImporte
                        ? ((maxItem.Importe / totalImporte) * 100).toFixed(2)
                        : "0.00"
                );
            }
            setLoading(prev => ({ ...prev, summary: false }));

            // Procesar tabla
            if (tableResult.status === "fulfilled") {
                const tableData = tableResult.value ?? { data: [], totalPages: 0 };
                setTotalPages(tableData.totalPages);
                setDataTable(formatJSON(tableData.data) as VentasTableItem[]);
            }
            setLoading(prev => ({ ...prev, table: false }));

        } catch (error) {
            console.error("Error:", error);
            setError("Error al cargar datos. Intente nuevamente.");
            setLoading({ chart: false, summary: false, table: false });
        }
    }, [getVentas, filtros, currentPage]);

    useEffect(() => {
        loadDataFromAPI();
    }, [loadDataFromAPI]);

    return (
        <div>
            {error && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <MainForm
                actionType="Buscar"
                dataForm={FiltersField()}
                valueAssign={["search", "sucursal", "fecha_inicial", "fecha_final"]}
                action={(values) => {
                    setSearchParam(values.search);
                    setSucursal(values.sucursal);
                    setFechaInicial(values.fecha_inicial || "");
                    setFechaFinal(values.fecha_final || "");
                }}
                message_button="Buscar"
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <CardResumen
                    icon={<CircleDollarSign className="text-white" />}
                    title="Total Ventas"
                    value={loading.summary ? "Cargando..." : total}
                />
                <CardResumen
                    icon={<ChartBarIncreasing className="text-white" />}
                    title="Productos Afectados"
                    value={loading.summary ? "Cargando..." : cantidad}
                />
                <CardResumen
                    icon={<ChartNetwork className="text-white" />}
                    title="Causa Principal"
                    value={loading.summary ? "Cargando..." : motivo}
                    subText={loading.summary ? "" : `${porcentajeMotivo}%`}
                />
            </div>

            <section className="my-2 p-2 bg-white shadow-md rounded-lg">
                {loading.chart ? (
                    <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
                ) : (
                    <RenderChart
                        type="bar"
                        barData={previewData}
                        treemapData={previewData}
                    />
                )}
            </section>

            <section className="my-2">
                {loading.table ? (
                    <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
                ) : (
                    <DynamicTable
                        data={dataTable}
                    />
                )}
            </section>

            <Pagination
                currentPage={currentPage}
                loading={loading.table}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </div>
    );
}