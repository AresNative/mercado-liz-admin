"use client"
import { ChartData } from "@/app/grafic/@user/page";
import { RenderChart } from "@/app/grafic/components/render-grafic";
import { use, useEffect, useState } from "react";
import DynamicTable from "@/components/table";
import CardResumen from "../components/card-resumen";
import { ChartBarIncreasing, ChartNetwork, ChevronLeft, ChevronRight, CircleDollarSign, Search } from "lucide-react";
import { formatLoadDate, loadDataMermas, loadDataMermasGrafic } from "@/app/grafic/constants/load-data";
import { useGetMermasMutation } from "@/hooks/reducers/api";
import { formatJSON, formatValue } from "@/utils/constants/format-values";
import MainForm from "@/components/form/main-form";

interface formatFilter {
    key: string;
    value: string;
    operator: "like" | "=" | ">=" | "<=" | ">" | "<" | "<>" | "";
}
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
        const filtros: formatFilter[] = [
            { key: "Nombre", value: `%${serachParam}%`, operator: "like" },
            { key: "Sucursal", value: `%${sucursal}%`, operator: "like" }
        ];

        if (fechaInicial || fechaFinal) {
            filtros.push({ key: "FechaEmision", value: fechaInicial, operator: ">=" });
            filtros.push({ key: "FechaEmision", value: fechaFinal, operator: "<=" });
        }

        const dataFilter: formatLoadDate = {
            filters: {
                filtros,
                sumas: [{ key: "Categoria" }],
            },
            page: 1,
            sum: true,
        };

        const response: ChartData[] = await loadDataMermasGrafic(getMermas, dataFilter) ?? [];
        setPreviewData(response);

        const dataTotal: formatLoadDate = {
            filters: {
                filtros,
                sumas: [],
            },
            page: 1,
            sum: true,
        };

        const responseTotal = await loadDataMermas(getMermas, dataTotal) ?? { data: [], totalPages: 0 };

        setTotal(formatValue(responseTotal.data[0]?.Importe || 0, "currency"));
        setCantidad(formatValue(responseTotal.data[0]?.Cantidad || 0, "number"));

        const dataTable: formatLoadDate = {
            filters: {
                filtros,
                sumas: [
                    { key: "Nombre" },
                    { key: "Sucursal" },
                    { key: "FechaEmision" },
                    { key: "Categoria" }
                ],
            },
            page: currentPage,
            sum: true,
        };

        const responseTable = await loadDataMermas(getMermas, dataTable) ?? { data: [], totalPages: 0 };
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
                    setFechaInicial(new Date(values.fecha_inicial).toISOString());
                    setFechaFinal(new Date(values.fecha_final).toISOString());
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