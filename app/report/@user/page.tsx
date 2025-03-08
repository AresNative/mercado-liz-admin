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
    useGetGlosariosComprasQuery,
    useGetGlosariosVentasQuery,
    useGetAllMutation,
    useGetComprasMutation,
    useGetVentasMutation
} from "@/hooks/reducers/api";
import DynamicTable from "@/components/table";
import Pagination from "@/components/pagination";
import MainForm from "@/components/form/main-form";
import CardResumen from "@/app/mermas/components/card-resumen";
import { Expo, Totales } from "../constants/models-table";
import {
    ReportType,
    DynamicTableItem,
    SummaryState,
    REPORT_CONFIGS
} from "../constants/interfaces";
import { loadDataFromAPI } from "../utils/load-data";
import { separarFechas } from "@/utils/constants/format-values";
import { buildFilters } from "../utils/filters";
import { ColumnsField } from "../constants/columns";
import { FiltersField } from "../constants/filters";

export default function DynamicReport() {
    // Llamar a todos los hooks en el nivel superior
    const { data: glosarioCompras } = useGetGlosariosComprasQuery("");
    const { data: glosarioVentas } = useGetGlosariosVentasQuery("");
    const [apiVentas, { isLoading: isLoadingVentas }] = useGetVentasMutation()
    const [apiCompras, { isLoading: isLoadingCompras }] = useGetComprasMutation();
    // Estado principal
    const [config, setConfig] = useState<ReportType>("COMPRA");

    const getAPI = config === "COMPRA" ? apiCompras : apiVentas;
    const loading = config === "COMPRA" ? isLoadingCompras : isLoadingVentas;

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

    // Estado combinado para summary
    const [summary, setSummary] = useState<SummaryState>({
        total: "$0.00",
        cantidad: "0",
        motivo: "N/A",
        porcentajeMotivo: "N/A",
    });
    const [totalsParams, setTotalParams] = useState([{
        Unidad: "",
        Cantidad: 0,
    }]);

    const currentConfig = useMemo(() => REPORT_CONFIGS[config], [config]);

    const dataFormModelTable = ColumnsField(
        currentConfig.type === "COMPRA" ? glosarioCompras : glosarioVentas
    );

    const dataFormFilter = FiltersField(
        currentConfig.type === "COMPRA"
            ? glosarioCompras
            : glosarioVentas,
        getAPI
    )

    const filtros = useMemo(() => {
        return buildFilters(searchParams);
    }, [searchParams, config]);

    const handleLoadData = useCallback(async () => {
        setError(null);

        try {
            const { newStates, inventario } = await loadDataFromAPI(getAPI, filtros, currentPage, rows, columns, currentConfig);
            setPreviewData(newStates.previewData);
            setSummary(newStates.summary);
            setDataTable(newStates.dataTable);
            setTotalPages(newStates.totalPages);
            setTotalParams([{
                Unidad: "Total",
                Cantidad: inventario,
            }])
        } catch (error) {
            console.error(error);
        }
    }, [getAPI, filtros, currentPage, rows, columns, currentConfig]);

    useEffect(() => {
        handleLoadData();
    }, [handleLoadData]);

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

    const resumenPorUnidad = totalsParams.reduce((acc: any, item) => {
        const unidad = item.Unidad;

        if (!acc[unidad]) {
            acc[unidad] = { Cantidad: 0, Costo: 0 };
        }

        acc[unidad].Cantidad += item.Cantidad;

        return acc;
    }, {});

    return (
        <>
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
            {viewSecctions.Resumen && (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <CardResumen
                    icon={<CircleDollarSign className="text-white" />}
                    title={`Total ${currentConfig.title}`}
                    value={loading ? "Cargando..." : summary.total}
                />
                <CardResumen
                    icon={<ChartBarIncreasing className="text-white" />}
                    title="Productos Movidos"
                    value={loading ? "Cargando..." : summary.cantidad}
                />
                <CardResumen
                    icon={<ChartNetwork className="text-white" />}
                    title={currentConfig.type === 'COMPRA'
                        ? "Proveedor Principal"
                        : "Cliente Principal"}
                    value={loading ? "Cargando..." : summary.motivo}
                    subText={loading ? "" : `${summary.porcentajeMotivo}%`}
                />

            </div>)}

            {/* Gráfico */}
            {viewSecctions.Grafica && (<section className="my-6 p-6 bg-white shadow-sm rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Tendencias</h2>
                {loading ? (
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

                {loading ? (
                    <div className="h-64 animate-pulse bg-gray-100" />
                ) : (
                    <>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {Object.entries(resumenPorUnidad).map(([unidad, data]: any) => unidad && (
                                <CardResumen
                                    key={unidad}
                                    icon={<Package className="text-white" />}
                                    title={`Inventario - ${unidad}`}
                                    value={loading ? "Cargando..." : data.Cantidad.toLocaleString()}
                                    subText={data.Costo <= 0 ? "" : `Costo Total: $${data.Costo.toLocaleString()}`}
                                />
                            ))}</div>

                        <DynamicTable
                            data={dataTable}
                        />

                        <div className="p-4 border-t">
                            <Pagination
                                currentPage={currentPage}
                                loading={loading}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        </div>
                    </>
                )}
            </section>)}
        </ >
    );
}