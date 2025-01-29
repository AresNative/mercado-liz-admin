"use client"
import { ChartData } from "@/app/grafic/@user/page";
import { RenderChart } from "@/app/grafic/components/render-grafic";
import { useEffect, useState } from "react";
import DynamicTable from "@/components/table";
import CardResumen from "../components/card-resumen";
import { ChartBarIncreasing, ChartNetwork, ChevronLeft, ChevronRight, CircleDollarSign, Search } from "lucide-react";
import { formatLoadDate, loadDataMermas, loadDataMermasGrafic } from "@/app/grafic/constants/load-data";
import { useGetMermasMutation } from "@/hooks/reducers/api";
import { formatJSON, formatValue } from "@/utils/constants/format-values";

export default function Mermas() {
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const [total, setTotal] = useState("$000,000.00");
    const [cantidad, setCantidad] = useState("000");
    const [dataTable, setDataTable] = useState<any[]>([])
    const [getMermas] = useGetMermasMutation();


    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function load() {
        const dataFilter: formatLoadDate = {
            filters: {
                filtros: [
                    {
                        key: "Categoria",
                        value: "NULL",
                        operator: "<>", // Operador vacío como en el formato esperado.
                    },
                ],
                sumas: [
                    {
                        key: "Categoria",
                    },
                ],
            },
            page: 1,
            sum: true,
        };
        const response: ChartData[] = await loadDataMermasGrafic(getMermas, dataFilter) ?? [];
        setPreviewData(response);

        const dataTotal: formatLoadDate = {
            filters: {
                filtros: [],
                sumas: [],
            },
            page: 1,
            sum: true,
        };

        const responseTotal = await loadDataMermas(getMermas, dataTotal) ?? { data: [], totalPages: 0 };

        setTotal(formatValue(responseTotal.data[0].Importe, "currency"));
        setCantidad(formatValue(responseTotal.data[0].Cantidad, "number"));

        const dataTable: formatLoadDate = {
            filters: {
                filtros: [],
                sumas: [
                    {
                        key: "Nombre",
                    },
                    {
                        key: "Categoria",
                    },
                ],
            },
            page: currentPage,
            sum: true,
        };

        const responseTable = await loadDataMermas(getMermas, dataTable) ?? { data: [], totalPages: 0 };
        const arrayTable: any[] = formatJSON(responseTable.data);
        setTotalPages(responseTable.totalPages)
        setDataTable(arrayTable);
        //Cantidad
    }

    useEffect(() => {
        load()
    }, [currentPage]);

    return (
        <div>
            <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 my-4">
                <div className="relative flex-1">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="pl-10 w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                {/* <button
                     onClick={showAllColumns}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Show All Columns
                </button> */}
            </div>
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
                    subText={"último mes"}
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
                >{currentPage}</span>

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