"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
    ChartBarIncreasing,
    ChartNetwork,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
} from "lucide-react";
import { ChartData } from "@/app/grafic/@user/page";
import { RenderChart } from "@/app/grafic/components/render-grafic";
import {
    loadData,
    loadDataGrafic,
    formatFilter,
    formatLoadDate,
} from "@/app/grafic/constants/load-data";
import { useGetVentasMutation } from "@/hooks/reducers/api";
import { formatJSON, formatValue } from "@/utils/constants/format-values";
import MainForm from "@/components/form/main-form";
import DynamicTable from "@/components/table";
import CardResumen from "@/app/mermas/components/card-resumen";

export default function Ventas() {
    // Estados para datos y resúmenes
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const [dataTable, setDataTable] = useState<any[]>([]);
    const [total, setTotal] = useState("$000,000.00");
    const [cantidad, setCantidad] = useState("000");
    const [motivo, setMotivo] = useState("N/A");
    const [porcentajeMotivo, setPorcentajeMotivo] = useState("N/A");

    // Estados de carga para cada sección
    const [loadingChart, setLoadingChart] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);

    // Hook para la llamada a la API
    const [getVentas] = useGetVentasMutation();

    // Estados para filtros y paginación
    const [searchParam, setSearchParam] = useState("");
    const [sucursal, setSucursal] = useState("");
    const [fechaInicial, setFechaInicial] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Estados debounced para evitar llamadas excesivas mientras el usuario escribe o selecciona
    const [debouncedSearch, setDebouncedSearch] = useState(searchParam);
    const [debouncedSucursal, setDebouncedSucursal] = useState(sucursal);
    const [debouncedFechaInicial, setDebouncedFechaInicial] = useState(fechaInicial);
    const [debouncedFechaFinal, setDebouncedFechaFinal] = useState(fechaFinal);

    // Actualiza los valores debounced después de 500ms de inactividad
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchParam);
            setDebouncedSucursal(sucursal);
            setDebouncedFechaInicial(fechaInicial);
            setDebouncedFechaFinal(fechaFinal);
            setCurrentPage(1); // Reinicia la paginación al cambiar los filtros
        }, 500);
        return () => clearTimeout(timer);
    }, [searchParam, sucursal, fechaInicial, fechaFinal]);

    // Genera los filtros de búsqueda (se memoiza para evitar cálculos innecesarios)
    const filtros: formatFilter[] = useMemo(() => {
        const arr: formatFilter[] = [];
        if (debouncedSearch) {
            arr.push({ key: "Nombre", value: `%${debouncedSearch}%`, operator: "like" });
        }
        if (debouncedSucursal) {// Dividir el valor por comas y crear un objeto por cada elemento
            debouncedSucursal
                ?.split(',') // Separa los valores por coma
                ?.map(s => s.trim()) // Elimina espacios en blanco alrededor de cada valor
                ?.filter(s => s) // Filtra valores vacíos (por si hay comas duplicadas)
                ?.forEach(sucursal => {
                    arr.push({
                        key: "Almacen",
                        value: `%${sucursal}%`,
                        operator: "like"
                    });
                });
        }
        if (debouncedFechaInicial && debouncedFechaFinal) {
            arr.push({
                key: "FechaEmision",
                value: debouncedFechaInicial.slice(0, -1),
                operator: ">=",
            });
            arr.push({
                key: "FechaEmision",
                value: debouncedFechaFinal.slice(0, -1),
                operator: "<=",
            });
        } else {
            if (debouncedFechaInicial) {
                arr.push({
                    key: "FechaEmision",
                    value: debouncedFechaInicial.slice(0, -1),
                    operator: "=",
                });
            }
            if (debouncedFechaFinal) {
                arr.push({
                    key: "FechaEmision",
                    value: debouncedFechaFinal.slice(0, -1),
                    operator: "=",
                });
            }
        }
        return arr;
    }, [debouncedSearch, debouncedSucursal, debouncedFechaInicial, debouncedFechaFinal]);

    // Función que carga la data desde la API
    const loadDataFromAPI = useCallback(async () => {
        // Configuración de filtros para cada sección
        const chartFilter: formatLoadDate = {
            filters: { filtros, sumas: [{ key: "Categoria" }] },
            page: 1,
            sum: true,
        };

        const totalFilter: formatLoadDate = {
            filters: { filtros, sumas: [{ key: "Cliente" }] },
            page: 1,
            pageSize: 100,
            sum: true,
        };

        const tableFilter: formatLoadDate = {
            filters: { filtros, sumas: [{ key: "Nombre" }, { key: "Almacen" }, { key: "FechaEmision" }] },
            page: currentPage,
            sum: true,
        };

        // Inicia los estados de carga
        setLoadingChart(true);
        setLoadingSummary(true);
        setLoadingTable(true);

        try {
            // Se ejecutan las tres peticiones de forma concurrente con Promise.allSettled
            const [chartResult, totalResult, tableResult] = await Promise.allSettled([
                loadDataGrafic(getVentas, chartFilter, "Categoria"),
                loadData(getVentas, totalFilter),
                loadData(getVentas, tableFilter),
            ]);

            // Procesa la respuesta del gráfico
            if (chartResult.status === "fulfilled") {
                setPreviewData(chartResult.value ?? []);
            } else {
                console.error("Error al cargar datos del gráfico:", chartResult.reason);
                setPreviewData([]);
            }
            setLoadingChart(false);

            // Procesa la respuesta para los resúmenes y totales
            if (totalResult.status === "fulfilled") {
                const totalData = totalResult.value ?? { data: [], totalPages: 0 };
                if (totalData.data.length > 0) {
                    const { totalImporte, totalCantidad, maxItem } = totalData.data.reduce(
                        (acc: any, item: any) => {
                            acc.totalImporte += item.Importe;
                            acc.totalCantidad += item.Cantidad;
                            if (!acc.maxItem || item.Importe > acc.maxItem.Importe) {
                                acc.maxItem = item;
                            }
                            return acc;
                        },
                        {
                            totalImporte: 0,
                            totalCantidad: 0,
                            maxItem: totalData.data[0],
                        }
                    );
                    const porcentajeCliente = totalImporte
                        ? ((maxItem.Importe / totalImporte) * 100).toFixed(2)
                        : "0.00";

                    setTotal(formatValue(totalImporte, "currency"));
                    setCantidad(formatValue(totalCantidad, "number"));
                    setMotivo(maxItem.Cliente || "Sin datos");
                    setPorcentajeMotivo(porcentajeCliente);
                } else {
                    setTotal(formatValue(0, "currency"));
                    setCantidad(formatValue(0, "number"));
                    setMotivo("Sin datos");
                    setPorcentajeMotivo("0.00");
                }
            } else {
                console.error("Error al cargar datos del resumen:", totalResult.reason);
                setTotal(formatValue(0, "currency"));
                setCantidad(formatValue(0, "number"));
                setMotivo("Sin datos");
                setPorcentajeMotivo("0.00");
            }
            setLoadingSummary(false);

            // Procesa la respuesta para la tabla
            if (tableResult.status === "fulfilled") {
                const tableData = tableResult.value ?? { data: [], totalPages: 0 };
                setTotalPages(tableData.totalPages);
                setDataTable(formatJSON(tableData.data));
            } else {
                console.error("Error al cargar datos de la tabla:", tableResult.reason);
                setTotalPages(0);
                setDataTable([]);
            }
            setLoadingTable(false);
        } catch (error) {
            console.error("Error general en la carga de datos:", error);
            setLoadingChart(false);
            setLoadingSummary(false);
            setLoadingTable(false);
        }
    }, [getVentas, filtros, currentPage]);

    // Se ejecuta la carga de datos cada vez que cambian los filtros o la paginación
    useEffect(() => {
        loadDataFromAPI();
    }, [loadDataFromAPI]);

    return (
        <div>
            <MainForm
                actionType="Buscar"
                dataForm={[
                    {
                        type: "Flex",
                        require: false,
                        elements: [
                            {
                                name: "search",
                                type: "SEARCH",
                                label: "Busca algún dato de interés",
                                placeholder: "Buscar productos...",
                                require: false,
                            },
                            {
                                name: "sucursal",
                                type: "SELECT",
                                options: [
                                    { label: "Guadalupe", value: "LIZ" },
                                    { label: "Testerazo", value: "TESTERAZO" },
                                    { label: "Palmas", value: "PALMAS" },
                                    { label: "Mayoreo", value: "MAYOREO" }],
                                multi: true,
                                label: "Seleccione sucursal...",
                                placeholder: "Mínimo 3 días mayor a la fecha de inicio",
                                require: false,
                            },
                        ],
                    },
                    {
                        type: "Flex",
                        require: false,
                        elements: [
                            {
                                name: "fecha_inicial",
                                type: "DATE",
                                label: "Fecha de inicio",
                                placeholder: "Buscar por fecha...",
                                require: false,
                            },
                            {
                                name: "fecha_final",
                                type: "DATE",
                                label: "Fecha final",
                                placeholder: "Buscar por fecha...",
                                require: false,
                            },
                        ],
                    },
                ]}
                valueAssign={["search", "sucursal", "fecha_inicial", "fecha_final"]}
                action={(values) => {
                    setSearchParam(values.search);
                    setSucursal(values.sucursal);

                    const fi = values.fecha_inicial?.trim();
                    const ff = values.fecha_final?.trim();

                    setFechaInicial(fi ? new Date(fi).toISOString() : "");
                    setFechaFinal(ff ? new Date(ff).toISOString() : "");
                }}
                message_button="Buscar"
            />

            {/* Sección de resúmenes */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <CardResumen
                    icon={<CircleDollarSign className="text-white" />}
                    subText=""
                    title="Total Ventas"
                    value={
                        loadingSummary ? (
                            <div className="animate-pulse">Cargando...</div>
                        ) : (
                            total
                        )
                    }
                />
                <CardResumen
                    icon={<ChartBarIncreasing className="text-white" />}
                    subText="general"
                    title="Productos Afectados"
                    value={
                        loadingSummary ? (
                            <div className="animate-pulse">Cargando...</div>
                        ) : (
                            cantidad
                        )
                    }
                />
                <CardResumen
                    icon={<ChartNetwork className="text-white" />}
                    title="Causa Principal"
                    value={
                        loadingSummary ? (
                            <div className="animate-pulse">Cargando...</div>
                        ) : (
                            motivo
                        )
                    }
                    subText={
                        loadingSummary ? (
                            <div className="animate-pulse">Cargando...</div>
                        ) : (
                            `${porcentajeMotivo}%`
                        )
                    }
                />
            </div>

            {/* Sección del gráfico */}
            <section className="my-2 p-2 bg-white shadow-md rounded-lg">
                {loadingChart ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-pulse">Cargando gráfico...</div>
                    </div>
                ) : (
                    <RenderChart type="bar" barData={previewData} treemapData={previewData} />
                )}
            </section>

            {/* Sección de la tabla */}
            <section className="my-2">
                {loadingTable ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-pulse">Cargando tabla...</div>
                    </div>
                ) : (
                    <DynamicTable data={dataTable} />
                )}
            </section>

            {/* Paginación */}
            <div className="flex items-center justify-center space-x-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loadingTable}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700">
                    {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || loadingTable}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
