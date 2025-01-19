"use client";
import React, { useEffect, useState } from "react";
import TreemapChart from "../components/term-grafic";
import DynamicChart from "../components/dynamic-grafic";
import { useGetHistorialComprasQuery } from "@/hooks/reducers/api";

export interface ChartData {
    name: string;
    data: { x: string; y: number }[];
}

export default function Estatico() {
    const [chartType, setChartType] = useState<RenderChartProps["type"]>("treemap");
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const { data, isLoading, refetch } = useGetHistorialComprasQuery({});

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

    const handleChartTypeChange = (type: RenderChartProps["type"]) => {
        if (type) setChartType(type);
    };

    if (isLoading) return <p>Cargando...</p>;

    return (
        <>

            <section>
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

function RenderChart({ type, barData, treemapData }: RenderChartProps) {
    const categories = barData.flatMap((data) =>
        data.data.map((item) => item.x)
    );

    console.log(barData, categories);


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
