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
    const [chartType, setChartType] = useState("bar");
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const { data, isLoading, refetch } = useGetHistorialComprasQuery({});

    useEffect(() => {
        if (data?.data?.length) {
            const formattedData = [
                {
                    name: "Proveedores",
                    data: data.data.map((item: any) => ({
                        x: item.ProveedorNom || "Desconocido",
                        y: item.Total || 0,
                    })),
                },
            ];
            setPreviewData(formattedData);
        } else {
            setPreviewData([]);
        }
    }, [data]);

    const handleChartTypeChange = (type: string | undefined) => {
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
    type: string;
    barData: any[];
    treemapData: any[];
}

function RenderChart({ type, barData, treemapData }: RenderChartProps) {
    const categories: string[] = barData[0]?.data?.slice(0, 6).map((item: any) => item.x) || [];
    console.log(treemapData);

    switch (type) {
        case "treemap":
            return treemapData ? <TreemapChart data={treemapData} /> : <p>No hay datos disponibles</p>;
        default:
            return barData ? (
                <DynamicChart type="bar" categories={categories} data={barData} />
            ) : (
                <p>No hay datos disponibles</p>
            );
    }
}
