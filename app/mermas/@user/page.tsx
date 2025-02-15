"use client"
import { ChartData } from "@/app/grafic/@user/page";
import { RenderChart } from "@/app/grafic/components/render-grafic";
import { useEffect, useState } from "react";
import { ChartBarIncreasing, ChartNetwork, ChevronLeft, ChevronRight, CircleDollarSign, Search } from "lucide-react";
import { formatFilter, formatLoadDate, loadData, loadDataGrafic } from "@/app/grafic/constants/load-data";
import { useGetMermasMutation } from "@/hooks/reducers/api";
import { formatJSON, formatValue } from "@/utils/constants/format-values";
import MainForm from "@/components/form/main-form";
import DynamicTable from "@/components/table";
import CardResumen from "../components/card-resumen";

export default function Mermas() {
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const [dataTable, setDataTable] = useState<any[]>([]);
    const [total, setTotal] = useState("$000,000.00");
    const [cantidad, setCantidad] = useState("000");
    const [getMermas] = useGetMermasMutation();

    const [serachParam, setSerachParam] = useState("");
    const [sucursal, setSucursal] = useState("");

    const [fechaInicial, setFechaInicial] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function load() {
        const filtros: formatFilter[] = [];
        if (serachParam) {
            filtros.push({ key: "Nombre", value: `%${serachParam}%`, operator: "like" });
        }

        if (sucursal) {
            filtros.push({ key: "Sucursal", value: `%${sucursal}%`, operator: "like" });
        }

        if (fechaInicial && fechaFinal) {
            filtros.push({ key: "FechaEmision", value: `${fechaInicial.slice(0, -1)}`, operator: ">=" });
            filtros.push({ key: "FechaEmision", value: `${fechaFinal.slice(0, -1)}`, operator: "<=" });
        } else {
            if (fechaInicial) {
                filtros.push({ key: "FechaEmision", value: `${fechaInicial.slice(0, -1)}`, operator: "=" });
            }
            if (fechaFinal) {
                filtros.push({ key: "FechaEmision", value: `${fechaFinal.slice(0, -1)}`, operator: "=" });
            }
        }

        const dataFilter: formatLoadDate = {
            filters: {
                filtros,
                sumas: [{ key: "Categoria" }],
            },
            page: 1,
            sum: true,
        };

        const response: ChartData[] = await loadDataGrafic(getMermas, dataFilter, "Categoria", "Importe") ?? [];
        setPreviewData(response);

        const dataTotal: formatLoadDate = {
            filters: {
                filtros,
                sumas: [],
            },
            page: 1,
            sum: true,
        };

        const responseTotal = await loadData(getMermas, dataTotal) ?? { data: [], totalPages: 0 };

        setTotal(formatValue(responseTotal.data[0]?.Importe || 0, "currency"));
        setCantidad(formatValue(responseTotal.data[0]?.Cantidad || 0, "number"));

        const dataTable: formatLoadDate = {
            filters: {
                filtros,
                sumas: [
                    { key: "Nombre" },
                    { key: "Categoria" }
                ],
            },
            page: currentPage,
            sum: true,
        };

        const responseTable = await loadData(getMermas, dataTable) ?? { data: [], totalPages: 0 };
        setTotalPages(responseTable.totalPages);
        setDataTable(formatJSON(responseTable.data));
    }


    useEffect(() => {
        load()
    }, [currentPage, serachParam, sucursal, fechaInicial, fechaFinal]);

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
                                label: "Busca algun dato de interes",
                                placeholder: "Buscar productos...",
                                require: false,
                            },
                            {
                                name: "sucursal",
                                type: "SELECT",
                                options: [
                                    "Guadalupe", "Testerazo", "Palmas", "Myoreo"
                                ],
                                multi: true,
                                label: "Seleccione sucursal...",
                                placeholder: "Minimo 3 dias mayor a la fecha de inicio",
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
                    setSerachParam(values.search);
                    setSucursal(values.sucursal);

                    const fechaInicial = values.fecha_inicial?.trim();
                    const fechaFinal = values.fecha_final?.trim();

                    setFechaInicial(fechaInicial ? new Date(fechaInicial).toISOString() : "");
                    setFechaFinal(fechaFinal ? new Date(fechaFinal).toISOString() : "");
                }}

                message_button="Buscar"
            />
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <CardResumen
                    icon={<CircleDollarSign className="text-white" />}
                    subText={"+ 5.2%"}
                    title="Total Mermas"
                    value={total}
                />
                <CardResumen
                    icon={<ChartBarIncreasing className="text-white" />}
                    /* subText={"último mes"} */
                    subText={"general"}
                    title="Productos Afectados"
                    value={cantidad}
                />

                <CardResumen
                    icon={<ChartNetwork className="text-white" />}
                    value={"Caducidad"}
                    title="Causa Principal"
                    subText={"45%"}
                />
            </div>
            <section className="my-2 p-2 bg-white shadow-md rounded-lg">
                <RenderChart
                    type={"bar"}
                    barData={previewData}
                    treemapData={previewData}
                />
            </section>
            <DynamicTable data={dataTable} />

            <div className="flex items-center justify-center space-x-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <span
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700"
                >{currentPage} de {totalPages}</span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>


            </div>
        </div>
    )
}