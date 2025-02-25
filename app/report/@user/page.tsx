"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
    Aperture,
    BadgeDollarSign,
    ChartBarIncreasing,
    ChartNetwork,
    CircleDollarSign,
    ScanBarcode,
} from "lucide-react";
import { ChartData } from "@/app/grafic/@user/page";
import { RenderChart } from "@/app/grafic/components/render-grafic";
import {
    loadData,
    loadDataGrafic,
    formatFilter,
} from "@/app/grafic/constants/load-data";
import { useGetComprasMutation, useGetGlosariosComprasQuery, useGetGlosariosVentasQuery, useGetVentasMutation } from "@/hooks/reducers/api";
import { formatJSON, formatValue } from "@/utils/constants/format-values";
import DynamicTable from "@/components/table";
import Pagination from "@/components/pagination";
import MainForm from "@/components/form/main-form";
import CardResumen from "@/app/mermas/components/card-resumen";
import { FiltersField } from "../constants/filters";
import { ColumnsField } from "../constants/columns";

interface ReportConfig {
    type: 'compras' | 'ventas';
    title: string;
    amountKey: 'Costo' | 'Importe';
    mainField: string;
    sumKey: string;
}

interface DynamicTableItem {
    id: string;
    Nombre: string;
    Almacen: string;
    FechaEmision: string;
    [key: string]: any;
}

const formatAPIDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString();
};

export default function DynamicReport() {

    const { data: glosarioCompras } = useGetGlosariosComprasQuery("");
    const { data: glosarioVentas } = useGetGlosariosVentasQuery("");
    const [config, setconfig] = useState<ReportConfig>({
        type: 'compras',
        title: 'Compras',
        amountKey: 'Costo',
        mainField: 'Proveedor',
        sumKey: 'Proveedor'
    })
    const [rows, setrows] = useState<number>(5);
    const [columns, setcolumns] = useState<any>([]);
    const [For, setFor] = useState([{ key: "Nombre" }, { key: "Almacen" }])
    // Estados compartidos
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const [dataTable, setDataTable] = useState<DynamicTableItem[]>([]);
    const [total, setTotal] = useState("$0.00");
    const [cantidad, setCantidad] = useState("0");
    const [motivo, setMotivo] = useState("N/A");
    const [porcentajeMotivo, setPorcentajeMotivo] = useState("N/A");
    const [error, setError] = useState<string | null>(null);

    const [loading, setLoading] = useState({
        chart: false,
        summary: false,
        table: false,
    });

    // Configuración dinámica de API
    const [getCompras] = useGetComprasMutation();
    const [getVentas] = useGetVentasMutation();
    const getAPI = config.type === 'compras' ? getCompras : getVentas;

    // Estados de filtros
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

    const filtros = useMemo(() => {
        const arr: formatFilter[] = [];

        if (debouncedSearch) {
            For.forEach((col) => {
                if (["Nombre", "Proveedor", "Codigo"].includes(col.key)) {
                    debouncedSearch.split(',')
                        .map(s => s.trim())
                        .filter(Boolean)
                        .forEach(searchs => {
                            arr.push({
                                key: col.key,
                                value: `%${searchs}%`,
                                operator: "like",
                            });
                        });
                } else {
                    arr.push({
                        key: col.key,
                        value: `%${debouncedSearch}%`,
                        operator: "like",
                    });
                }
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
            if (fi) arr.push({ key: "FechaEmision", value: fi, operator: "=" });
            if (ff) arr.push({ key: "FechaEmision", value: ff, operator: "=" });
        }

        return arr;
    }, [debouncedSearch, debouncedSucursal, debouncedFechaInicial, debouncedFechaFinal, config]);
    function calcularTotalesYMayorProveedor(proveedores: any[]) {
        const totalCantidad = proveedores.reduce((sum, p) => sum + p.Cantidad, 0);
        const totalCosto = proveedores.reduce((sum, p) => sum + p[config.amountKey], 0);

        const mayorProveedor = proveedores.reduce((max, p) => (p.Cantidad > max.Cantidad ? p : max), proveedores[0]);

        const porcentajeMayor = (mayorProveedor.Cantidad / totalCantidad) * 100;

        return {
            totalCantidad,
            totalCosto,
            mayorProveedor: mayorProveedor[config.mainField],
            cantidadMayor: mayorProveedor.Cantidad,
            porcentajeMayor
        };
    }

    const loadDataFromAPI = useCallback(async () => {
        setError(null);
        setLoading({ chart: true, summary: true, table: true });

        try {
            const [chartResult, totalResult, tableResult] = await Promise.allSettled([
                loadDataGrafic(getAPI, {
                    filters: { filtros, sumas: [{ key: "Categoria" }/* , { key: "Nombre" } */] },
                    page: 1,
                    sum: true
                }, /* [ */"Categoria"/* , "Nombre"] */, config.amountKey),
                loadData(getAPI, {
                    filters: { filtros, sumas: [{ key: config.sumKey }] },
                    page: 1,
                    pageSize: rows > 5 ? rows : 3000,
                    sum: true
                }),
                loadData(getAPI, {
                    filters: { filtros, sumas: columns },
                    page: currentPage,
                    pageSize: rows,
                    sum: false
                })
            ]);

            // Procesar gráfico
            if (chartResult.status === "fulfilled") {
                setPreviewData(chartResult.value ?? []);
            } else {
                console.error("Error gráfico:", chartResult.reason);
            }
            setLoading(prev => ({ ...prev, chart: false }));

            // Procesar totales ! aqui
            if (totalResult.status === "fulfilled") {
                const resultData = totalResult.value?.data || [];
                const totals = calcularTotalesYMayorProveedor(resultData);

                setTotal(formatValue(totals.totalCosto, "currency"));
                setCantidad(formatValue(totals.totalCantidad, "number"));
                setMotivo(totals.mayorProveedor || "Sin datos");
                setPorcentajeMotivo(
                    totals.porcentajeMayor.toFixed(2)
                    ?? "0.00"
                );
            }
            setLoading(prev => ({ ...prev, summary: false }));

            // Procesar tabla
            if (tableResult.status === "fulfilled") {
                const tableData = tableResult.value ?? { data: [], totalPages: 0 };
                setTotalPages(tableData.totalPages);
                setDataTable(formatJSON(tableData.data) as DynamicTableItem[]);
            }
            setLoading(prev => ({ ...prev, table: false }));

        } catch (error) {
            console.error("Error:", error);
            setError("Error al cargar datos. Intente nuevamente.");
            setLoading({ chart: false, summary: false, table: false });
        }
    }, [getAPI, filtros, currentPage, config, columns]);

    useEffect(() => {
        loadDataFromAPI();
    }, [loadDataFromAPI, config, columns]);

    return (
        <div>
            <section className="w-full py-2 flex gap-2">
                <button
                    className="p-2 border rounded-lg bg-white flex gap-2 items-center"
                    onClick={() => setconfig({
                        type: 'ventas',
                        title: 'Ventas',
                        amountKey: 'Importe',
                        mainField: 'Cliente',
                        sumKey: 'Cliente'
                    })}
                >
                    <BadgeDollarSign className="text-gray-400 size-5" />
                    Ventas
                </button>
                <button
                    className="p-2 border rounded-lg bg-white flex gap-2"
                    onClick={() => setconfig({
                        type: 'compras',
                        title: 'Compras',
                        amountKey: 'Costo',
                        mainField: 'Proveedor',
                        sumKey: 'Proveedor'
                    })}
                >
                    <ScanBarcode className="text-gray-400 size-5" />
                    Compras
                </button>

            </section>
            {error && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}
            <MainForm
                actionType="Buscar"
                dataForm={FiltersField(config.type === "compras" ? glosarioCompras : glosarioVentas, getAPI)}
                valueAssign={["search", "columnas", "sucursal", "fecha_inicial", "fecha_final"]}
                action={(values) => {
                    let columnas: any = []
                    values.columnas.split(',')
                        .map((s: any) => s.trim())
                        .filter(Boolean)
                        .forEach((row: any) => {
                            columnas.push({
                                key: row
                            });
                        });
                    setFor(columnas)
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
                    title={`Total ${config.title}`}
                    value={loading.summary ? "Cargando..." : total}
                />
                <CardResumen
                    icon={<ChartBarIncreasing className="text-white" />}
                    title="Productos Movidos"
                    value={loading.summary ? "Cargando..." : cantidad}
                />
                <CardResumen
                    icon={<ChartNetwork className="text-white" />}
                    title={config.type === 'compras' ? "Proveedor Principal" : "Cliente Principal"}
                    value={loading.summary ? "Cargando..." : motivo}
                    subText={loading.summary ? "" : `${porcentajeMotivo}%`}
                />
            </div>

            <section className="my-2 p-2 bg-white shadow-md rounded-lg">
                {loading.chart ? (
                    <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
                ) : (
                    <RenderChart
                        type="area"
                        barData={previewData}
                        treemapData={previewData}
                    />
                )}
            </section>
            <MainForm
                actionType="Buscar"
                dataForm={ColumnsField(config.type === "compras" ? glosarioCompras : glosarioVentas)}
                valueAssign={["columnas", "rows"]}
                action={(values) => {
                    if (values.rows) setrows(values.rows);

                    let columnas: any = []
                    values.columnas.split(',')
                        .map((s: any) => s.trim())
                        .filter(Boolean)
                        .forEach((row: any) => {
                            columnas.push({
                                key: row
                            });
                        });
                    setcolumns(columnas);
                }}
                message_button="cargar"
            />
            <section className="my-2">
                <button
                    className="p-2 my-2 border rounded-lg bg-white flex gap-2 items-center"
                    onClick={() => setcolumns([
                        {
                            key: "Nombre"
                        }, {
                            key: "Proveedor"
                        }, {
                            key: "Unidad"
                        }, {
                            key: "Factor"
                        }, {
                            key: "Equivalencia"
                        }, {
                            key: "Cantidad"
                        }, {
                            key: "CantidadInventario"
                        }, {
                            key: "CostoUnitario"
                        }, {
                            key: "CostoTotal"
                        }, {
                            key: "FecahEmision"
                        },
                    ])}
                >
                    <Aperture className="text-gray-400 size-5" />
                    Expo
                </button>

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