"use client";
import { useEffect, useState } from "react";
import { useGetHistorialComprasQuery } from "@/hooks/reducers/api";
import MainForm from "@/components/form/main-form";
import { RenderChartProps, RenderChart } from "../components/render-grafic";

export interface ChartData {
    name: string;
    data: { x: string; y: number }[];
}

export default function Estatico() {
    const [chartType, setChartType] = useState<RenderChartProps["type"]>("bar");
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const { data, isLoading } = useGetHistorialComprasQuery({});

    useEffect(() => {

        if (data?.data) {
            const formattedData = [
                {
                    name: "Proveedores",
                    data: data.data.map((item: any) => ({
                        x: item.ProveedorNom,
                        y: item.Total,
                    })),
                },
            ];
            setPreviewData(formattedData);

        } else {
            setPreviewData([]);
        }
    }, [data]);
    if (isLoading) return <p>Cargando...</p>;

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
                    console.log(data);
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

