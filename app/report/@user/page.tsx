"use client";
import { useEffect, useMemo, useCallback, useState } from "react";
import {
    Aperture,
    BadgeDollarSign,
    ChartBarIncreasing,
    ChartNetwork,
    CircleDollarSign,
    Eye,
    EyeClosed,
    Package,
    ScanBarcode,
} from "lucide-react";
import { ChartData } from "@/app/grafic/@user/page";
import { RenderChart } from "@/app/grafic/components/render-grafic";
import {
    loadData,
    loadDataGrafic,
    formatFilter,
} from "@/app/grafic/constants/load-data";
import {
    useGetComprasMutation,
    useGetGlosariosComprasQuery,
    useGetGlosariosVentasQuery,
    useGetVentasMutation,
    useGetAllMutation
} from "@/hooks/reducers/api";
import { formatJSON, formatValue } from "@/utils/constants/format-values";
import DynamicTable from "@/components/table";
import Pagination from "@/components/pagination";
import MainForm from "@/components/form/main-form";
import CardResumen from "@/app/mermas/components/card-resumen";
import { FiltersField } from "../constants/filters";
import { ColumnsField } from "../constants/columns";
import { Expo, Totales } from "../constants/models-table";
import {
    ReportConfig,
    ReportType,
    DynamicTableItem,
    LoadingState,
    SummaryState,
    REPORT_CONFIGS
} from "../constants/interfaces";

const formatAPIDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString();
};

const calculateSummary = (proveedores: any[], config: ReportConfig) => {
    if (proveedores.length === 0) {
        return {
            totalCantidad: 0,
            totalCosto: 0,
            mayorProveedor: "N/A",
            cantidadMayor: 0,
            porcentajeMayor: 0
        };
    }

    let totalCantidad = 0;
    let totalCosto = 0;
    let maxCantidad = -Infinity;
    let mayorProveedor = proveedores[0];

    for (const p of proveedores) {
        totalCantidad += p.Cantidad;
        totalCosto += p[config.amountKey];

        if (p.Cantidad > maxCantidad) {
            maxCantidad = p.Cantidad;
            mayorProveedor = p;
        }
    }

    const porcentajeMayor = (mayorProveedor.Cantidad / totalCantidad) * 100 || 0;

    return {
        totalCantidad,
        totalCosto,
        mayorProveedor: mayorProveedor[config.mainField] || "N/A",
        cantidadMayor: mayorProveedor.Cantidad,
        porcentajeMayor
    };
};

export default function DynamicReport() {
    const { data: glosarioCompras } = useGetGlosariosComprasQuery("");
    const { data: glosarioVentas } = useGetGlosariosVentasQuery("");
    const [getCompras] = useGetComprasMutation();
    const [getVentas] = useGetVentasMutation();
    const [getAll] = useGetAllMutation();

    // Estado principal
    const [config, setConfig] = useState<ReportType>('COMPRA');
    const [rows, setRows] = useState(5);
    const [columns, setColumns] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useState({
        search: "",
        rowSearch: "",
        sucursal: "",
        fechaInicial: "",
        fechaFinal: "",
    });
    const [viewSecctions, setViewSecctions] = useState({
        Filtros: true,
        Resumen: false,
        Grafica: false,
        Cuestionario: false,
        Tabla: true,
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Estados derivados
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const [dataTable, setDataTable] = useState<DynamicTableItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    // Estado combinado para loading
    const [loading, setLoading] = useState<LoadingState>({
        chart: false,
        summary: false,
        table: false
    });

    // Estado combinado para summary
    const [summary, setSummary] = useState<SummaryState>({
        total: "$0.00",
        cantidad: "0",
        motivo: "N/A",
        porcentajeMotivo: "N/A"
    });

    const currentConfig = useMemo(() => REPORT_CONFIGS[config], [config]);
    const getAPI = useMemo(() => getAll, [getAll]);

    const filtros = useMemo(() => {
        const arr: formatFilter[] = [];
        const { search, rowSearch, sucursal, fechaInicial, fechaFinal } = searchParams;

        arr.push({
            key: "Tipo",//7501020540666
            value: `%${config}%`,
            operator: "like",
        });

        if (search) {
            const searchTerms = search.split(',').map(s => s.trim()).filter(Boolean);
            const searchRows = rowSearch.split(',').map(s => s.trim()).filter(Boolean);
            searchRows.forEach((col) => {
                searchTerms.forEach(term => {
                    arr.push({
                        key: col,//7501020540666
                        value: `%${term}%`,
                        operator: "like",
                    });
                })
            })
        }

        if (sucursal) {
            sucursal.split(',').map(s => s.trim()).filter(Boolean).forEach(sucursal => {
                arr.push({
                    key: "Almacen",
                    value: sucursal,
                    operator: "="
                });
            });
        }

        const fi = formatAPIDate(fechaInicial);
        const ff = formatAPIDate(fechaFinal);

        if (fi && ff) {
            arr.push(
                { key: "FechaEmision", value: fi, operator: ">=" },
                { key: "FechaEmision", value: ff, operator: "<=" }
            );
        } else if (fi) {
            arr.push({ key: "FechaEmision", value: fi, operator: "=" });
        } else if (ff) {
            arr.push({ key: "FechaEmision", value: ff, operator: "=" });
        }

        return arr;
    }, [searchParams]);

    const loadDataFromAPI = useCallback(async () => {
        // Se resetean los errores y se indica que se está cargando todo
        setError(null);
        setLoading({ chart: true, summary: true, table: true });

        try {
            // Disparamos todas las peticiones en paralelo
            const [chartResult, totalResult, tableResult, totalUnidad] = await Promise.allSettled([
                loadDataGrafic(getAPI, {
                    filters: { filtros, sumas: [{ key: "Categoria" }] },
                    page: 1,
                    pageSize: 5,
                    sum: true
                }, "Categoria", currentConfig.amountKey),
                loadData(getAPI, {
                    filters: { filtros, sumas: [{ key: currentConfig.sumKey }] },
                    page: 1,
                    pageSize: rows > 5 ? rows : 3000,
                    sum: true
                }),
                loadData(getAPI, {
                    filters: { filtros, sumas: columns },
                    page: currentPage,
                    pageSize: rows,
                    sum: false
                }),
                loadData(getAPI, {
                    filters: {
                        filtros: [
                            { key: "Unidad", value: "Pieza", operator: "" },
                            { key: "Unidad", value: "Caja", operator: "" },
                            { key: "Tipo", value: `%${config}%`, operator: "like" }
                        ],
                        sumas: [{ key: "Unidad" }]
                    },
                    page: currentPage,
                    pageSize: 1500,
                    sum: true
                })
            ]);

            // Opcional: puedes revisar o loggear totalUnidad si lo necesitas
            console.log(totalUnidad);

            // Creamos un objeto temporal para agrupar las actualizaciones
            const newStates: {
                previewData: ChartData[];
                summary: {
                    total: string;
                    cantidad: string;
                    motivo: string;
                    porcentajeMotivo: string;
                };
                totalPages: number;
                dataTable: DynamicTableItem[];
            } = {
                previewData: [{ name: "", data: [{ x: "", y: 0 }] }],
                summary: {
                    total: "$0.00",
                    cantidad: "0",
                    motivo: "N/A",
                    porcentajeMotivo: "N/A"
                },
                totalPages: 0,
                dataTable: []
            };

            // Procesar gráfico
            if (chartResult.status === "fulfilled") {
                newStates.previewData = chartResult.value ?? [];
            }

            // Procesar totales
            if (totalResult.status === "fulfilled") {
                const resultData = totalResult.value?.data || [];
                const totals = calculateSummary(resultData, currentConfig);
                newStates.summary = {
                    total: formatValue(totals.totalCosto, "currency"),
                    cantidad: formatValue(totals.totalCantidad, "number"),
                    motivo: totals.mayorProveedor,
                    porcentajeMotivo: totals.porcentajeMayor.toFixed(2)
                };
            }

            // Procesar tabla
            if (tableResult.status === "fulfilled") {
                const tableData = tableResult.value ?? { data: [], totalPages: 0 };
                newStates.totalPages = tableData.totalPages;
                newStates.dataTable = formatJSON(tableData.data) as [];
            }

            // Actualizamos los estados en bloque para minimizar re-renderizados
            setPreviewData(newStates.previewData);
            setSummary(newStates.summary);
            setTotalPages(newStates.totalPages);
            setDataTable(newStates.dataTable);
            setLoading({ chart: false, summary: false, table: false });

        } catch (error) {
            // En caso de error se limpian los datos y se notifica el error
            setPreviewData([]);
            setDataTable([]);
            setSummary({
                total: "$0.00",
                cantidad: "0",
                motivo: "N/A",
                porcentajeMotivo: "N/A"
            });
            setError("Error al cargar datos. Intente nuevamente.");
            setLoading({ chart: false, summary: false, table: false });
        }
    }, [getAPI, filtros, currentPage, rows, columns, currentConfig]);


    useEffect(() => {
        loadDataFromAPI();
    }, [loadDataFromAPI]);

    const handleConfigChange = useCallback((type: ReportType) => {
        setConfig(type);
        setSearchParams({
            search: "",
            sucursal: "",
            rowSearch: "",
            fechaInicial: "",
            fechaFinal: "",
        });
    }, []);

    function separarFechas(fechaRango: string) {
        const fechas = fechaRango.split(" - ");
        return {
            fechaInicial: fechas[0] || "",
            fechaFinal: fechas[1] || ""
        };
    }
    const handleSearch = useCallback((values: any) => {
        const { fechaInicial, fechaFinal } = separarFechas(values.fecha_inicial);
        setSearchParams({
            search: values.search,
            rowSearch: values.columnas,
            sucursal: values.sucursal,
            fechaInicial: fechaInicial,
            fechaFinal: fechaFinal,
        });
    }, []);

    const handleColumnsChange = useCallback((values: any) => {
        if (values.rows) setRows(values.rows);

        const newColumns = values.columnas
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
            .map((key: string) => ({ key }));

        setColumns(newColumns);
    }, []);


    const dataFormModelTable = ColumnsField(
        currentConfig.type === "COMPRA" ? glosarioCompras : glosarioVentas
    );

    const dataFormFilter = FiltersField(
        currentConfig.type === "COMPRA"
            ? glosarioCompras
            : glosarioVentas,
        getAPI,
        config
    )
    return (
        <div>

            {/* Sección de selección de reporte */}
            <ul className="w-full py-2 flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 mb-6">
                <li className="py-2 flex flex-wrap gap-1 md:gap-2 mb-6">
                    {Object.entries(REPORT_CONFIGS).map(([type, cfg]) => (
                        <button
                            key={type}
                            className={`px-2 py-1 md:px-3 md:py-2 border rounded-lg flex gap-1 md:gap-2 items-center transition-colors ${config === type
                                ? 'bg-indigo-500 text-white border-indigo-600'
                                : 'bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                            onClick={() => handleConfigChange(type as ReportType)}
                        >
                            {type === 'ventas' ? (
                                <BadgeDollarSign className="w-4 h-4 md:w-5 md:h-5" />
                            ) : (
                                <ScanBarcode className="w-4 h-4 md:w-5 md:h-5" />
                            )}
                            <span className="text-xs md:text-sm">{cfg.title}</span>
                        </button>
                    ))}
                </li>
                <li className="py-2 flex flex-wrap gap-1 md:gap-2 mb-6">
                    {Object.entries(viewSecctions).map(([key, section]) => (
                        <button
                            key={key}
                            className={`px-2 py-1 md:px-3 md:py-2 border rounded-lg flex gap-1 md:gap-2 items-center transition-colors ${section
                                ? 'bg-indigo-500 text-white border-indigo-600'
                                : 'bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                            onClick={() =>
                                setViewSecctions((prev) => ({ ...prev, [key]: !section }))
                            }
                        >
                            {section ? (
                                <Eye className="w-4 h-4 md:w-5 md:h-5" />
                            ) : (
                                <EyeClosed className="w-4 h-4 md:w-5 md:h-5" />
                            )}
                            <span className="text-xs md:text-sm">Ver {key}</span>
                        </button>
                    ))}
                </li>
            </ul>

            {/* Mensaje de error */}
            {error && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {/* Formulario principal de búsqueda */}
            {viewSecctions.Filtros && (<div className="mb-8 bg-white border p-6 rounded-xl shadow-sm">
                <MainForm
                    actionType="Buscar"
                    dataForm={dataFormFilter}
                    valueAssign={["search", "columnas", "sucursal", "fecha_inicial", "fecha_final"]}
                    action={handleSearch}
                    message_button="Aplicar Filtros"
                />
            </div>)}

            {/* Tarjetas de resumen */}
            {viewSecctions.Resumen && (<div className="flex flex-row gap-2 mb-8 sm:justify-between">
                <CardResumen
                    icon={<CircleDollarSign className="text-white" />}
                    title={`Total ${currentConfig.title}`}
                    value={loading.summary ? "Cargando..." : summary.total}
                />
                <CardResumen
                    icon={<ChartBarIncreasing className="text-white" />}
                    title="Productos Movidos"
                    value={loading.summary ? "Cargando..." : summary.cantidad}
                />
                <CardResumen
                    icon={<ChartNetwork className="text-white" />}
                    title={currentConfig.type === 'COMPRA'
                        ? "Proveedor Principal"
                        : "Cliente Principal"}
                    value={loading.summary ? "Cargando..." : summary.motivo}
                    subText={loading.summary ? "" : `${summary.porcentajeMotivo}%`}
                />
                <CardResumen
                    icon={<Package className="text-white" />}
                    title={"Inventario"}
                    value={loading.summary ? "Cargando..." : summary.motivo}
                    subText={loading.summary ? "" : `${summary.porcentajeMotivo}%`}
                />
            </div>)}

            {/* Gráfico */}
            {viewSecctions.Grafica && (<section className="my-6 p-6 bg-white shadow-sm rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Tendencias</h2>
                {loading.chart ? (
                    <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
                ) : (
                    <RenderChart
                        type="area"
                        barData={previewData}
                        treemapData={previewData}
                    />
                )}
            </section>)}

            {/* Selector de columnas y filas */}
            {viewSecctions.Cuestionario && (
                <div className="my-6 bg-white border p-6 rounded-xl shadow-sm">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[300px]">
                            <MainForm
                                actionType="Configurar"
                                dataForm={dataFormModelTable}
                                valueAssign={["columnas", "rows"]}
                                action={handleColumnsChange}
                                message_button="Actualizar Tabla"
                            />
                        </div>
                        <button
                            className="p-2 h-fit border rounded-lg bg-white flex gap-2 items-center hover:bg-gray-50 transition-colors text-gray-700"
                            onClick={() => setColumns(Totales)}
                        >
                            <Aperture className="text-gray-400 size-5" />
                            Vista Totales
                        </button>
                        <button
                            className="p-2 h-fit border rounded-lg bg-white flex gap-2 items-center hover:bg-gray-50 transition-colors text-gray-700"
                            onClick={() => { setColumns(Expo); setRows(30) }}
                        >
                            <Aperture className="text-gray-400 size-5" />
                            Vista Expo
                        </button>
                    </div>
                </div>
            )}

            {/* Tabla de datos */}
            {viewSecctions.Tabla && (<section className="my-6 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold">Detalle de {currentConfig.title}</h2>
                </div>

                {loading.table ? (
                    <div className="h-64 animate-pulse bg-gray-100" />
                ) : (
                    <>
                        <DynamicTable
                            data={dataTable}
                        />

                        <div className="p-4 border-t">
                            <Pagination
                                currentPage={currentPage}
                                loading={loading.table}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        </div>
                    </>
                )}
            </section>)}
        </div >
    );
}