"use client";
import React, { useEffect, useState } from "react";
import TreemapChart from "../components/term-grafic";
import DynamicChart from "../components/dynamic-grafic";
import { useGetHistorialComprasQuery } from "@/hooks/reducers/api";
import MainForm from "@/components/form/main-form";

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

interface RenderChartProps {
    type: "pie" | "bar" | "line" | "area" | "treemap";
    barData: ChartData[];
    treemapData: ChartData[];
}

export function RenderChart({ type, barData, treemapData }: RenderChartProps) {
    const categories = barData.flatMap((data) =>
        data.data.map((item) => item.x)
    );


    switch (type) {
        case "treemap":
            return treemapData ? <TreemapChart data={treemapData} /> : <p>No hay datos disponibles</p>;
        default:
            return barData ? (
                <DynamicChart type={type} categories={categories} data={barData} />
            ) : (
                <p>No hay datos disponibles</p>
            );
    }
}
