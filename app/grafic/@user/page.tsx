"use client";

import { useCallback, useEffect, useState } from "react";
import { RenderChart } from "../components/render-grafic";
import { loadDataGrafic } from "../constants/load-data";
import { useGetAllMutation } from "@/hooks/reducers/api";

export interface ChartData {
    name: string;
    data: { x: string; y: number }[];
}

export default function Estatico() {
    const [areaData, setAreaData] = useState<ChartData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [getAPI, { isLoading: isLoadingVentas }] = useGetAllMutation();

    const handleLoadData = useCallback(async () => {
        setError(null);
        try {
            const [chartCompras, chartVentas, chartMermas] = await Promise.all([
                loadDataGrafic(
                    getAPI,
                    {
                        filters: {
                            filtros: [{ key: "Tipo", value: "COMPRA", operator: "" }],
                            sumas: [{ key: "Mes" }, { key: "Tipo" }]
                        },
                        page: 1,
                        pageSize: 6,
                        sum: true,
                        distinct: false
                    },
                    ["Tipo", "Mes"],
                    "Cantidad"
                ),
                loadDataGrafic(
                    getAPI,
                    {
                        filters: {
                            filtros: [{ key: "Tipo", value: "VENTA", operator: "" }],
                            sumas: [{ key: "Mes" }, { key: "Tipo" }]
                        },
                        page: 1,
                        pageSize: 6,
                        sum: true,
                        distinct: false
                    },
                    ["Tipo", "Mes"],
                    "Cantidad"              
                ),
                loadDataGrafic(
                    getAPI,
                    {
                        filters: {
                            filtros: [{ key: "Tipo", value: "MERMA", operator: "=" }],
                            sumas: [{ key: "Mes" }, { key: "Tipo" }]
                        },
                        page: 1,
                        pageSize: 6,
                        sum: true,
                        distinct: false
                    },
                    ["Tipo", "Mes"],
                    "Cantidad"
                )
            ]);

            setAreaData([chartCompras[0], chartVentas[0], chartMermas[0]]);
            console.log(chartCompras[0], chartVentas[0], chartMermas[0]);


        } catch (error: any) {
            console.error(error);
            setError('Error al cargar los datos');
        }
    }, [getAPI]);

    useEffect(() => {
        handleLoadData();
    }, [handleLoadData]);


    const pieData: ChartData[] = [
        { name: "Compras", data: [{ x: "Producto A", y: 100 }, { x: "Producto B", y: 150 }] },
        { name: "Ventas", data: [{ x: "Producto A", y: 80 }, { x: "Producto B", y: 120 }] },
        { name: "Mermas", data: [{ x: "Producto A", y: 20 }, { x: "Producto B", y: 30 }] },
    ];

    const treemapData: ChartData[] = [
        { name: "Compras", data: [{ x: "Producto A", y: 100 }, { x: "Producto B", y: 150 }] },
        { name: "Ventas", data: [{ x: "Producto A", y: 80 }, { x: "Producto B", y: 120 }] },
        { name: "Mermas", data: [{ x: "Producto A", y: 20 }, { x: "Producto B", y: 30 }] },
    ];

    if (error) {
        <span className="text-red-500 font-bold text-2xl">{error}</span>
    }

    return (
        <div className="p-4">
            {/* Gráfico de Área */}
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full">
                <div className="mb-8 w-full">
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Comparacion COMPRA/VENTA/MERMAS</h2>
                    <RenderChart type="area" barData={areaData} treemapData={[]} />
                </div>

                {/* Gráfico de Tarta */}
                <div className="mb-8 w-full">
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Categorias</h2>
                    <RenderChart type="pie" barData={pieData} treemapData={[]} />
                </div>

            </ul>

            {/* Gráfico de Treemap */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Productos de temporada</h2>
                <RenderChart type="treemap" barData={[]} treemapData={treemapData} />
            </div>
        </div>
    );
}
