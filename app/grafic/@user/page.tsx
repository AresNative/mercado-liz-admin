"use client";
import { useEffect, useState } from "react";
import { useGetVentasMutation } from "@/hooks/reducers/api";
import MainForm from "@/components/form/main-form";
import { RenderChartProps, RenderChart } from "../components/render-grafic";
import { formatLoadDate, loadDataGrafic } from "../constants/load-data";

export interface ChartData {
    name: string;
    data: { x: string; y: number }[];
}

export default function Estatico() {
    const [chartType, setChartType] = useState<RenderChartProps["type"]>("bar");
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const [getVentas] = useGetVentasMutation({});
    async function load() {
        const dataFilter: formatLoadDate = {
            filters: {
                filtros: [],
                sumas: [{ key: "Nombre" }],
            },
            page: 1,
            pageSize: 5,
            sum: true,
        };

        const response: ChartData[] = await loadDataGrafic(getVentas, dataFilter, "Nombre") ?? [];
        console.log(response);
        setPreviewData(response);
    }
    useEffect(() => {
        load()
    }, []);

    return (
        <>
            <MainForm
                actionType=""
                dataForm={[{
                    id: 0,
                    type: "SELECT",
                    name: "select_grafic",
                    label: "Tipo de grafica",
                    options: [
                        "pie", "bar", "line", "area", "treemap"
                    ],
                    multi: false,
                    require: false,
                }]}
                valueAssign="select_grafic"
                message_button="Cargar"
                action={(data) => {
                    setChartType(() => data)
                }}
            />
            <section className="mt-2 p-2 bg-white shadow-2xl rounded-lg">
                <RenderChart
                    type={chartType}
                    barData={previewData}
                    treemapData={previewData}
                />
            </section>
        </>
    );
}

