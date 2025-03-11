"use client";

import { useCallback, useEffect } from "react";
import { RenderChart } from "../components/render-grafic";
import { loadDataGrafic } from "../constants/load-data";
import { useGetAllMutation } from "@/hooks/reducers/api";

export interface ChartData {
    name: string;
    data: { x: string; y: number }[];
}

export default function Estatico() {
    const [getAPI, { isLoading: isLoadingVentas }] = useGetAllMutation();
    const handleLoadData = useCallback(async () => {
        //setError(null);
        try {
            const [chartCompras, chartVentas, chartMermas] =
                await Promise.all([
                    loadDataGrafic(
                        getAPI,
                        {
                            filters: {
                                filtros: [{
                                    key: "Tipo",
                                    value: "COMPRA",
                                    operator: "="
                                }],
                                sumas: [{
                                    key: "FechaEmision"
                                }, {
                                    key: "Tipo"
                                }]
                            },
                            page: 1,
                            pageSize: 4,
                            sum: false,
                        },
                        ["Tipo", "FechaEmision"],
                        "Cantidad"

                    ), loadDataGrafic(
                        getAPI,
                        {
                            filters: {
                                filtros: [{
                                    key: "Tipo",
                                    value: "VENTA",
                                    operator: "="
                                }],
                                sumas: [{
                                    key: "FechaEmision"
                                }, {
                                    key: "Tipo"
                                }]
                            },
                            page: 1,
                            pageSize: 4,
                            sum: false,
                        },
                        ["Tipo", "FechaEmision"],
                        "Cantidad"

                    ), loadDataGrafic(
                        getAPI,
                        {
                            filters: {
                                filtros: [{
                                    key: "Tipo",
                                    value: "MERMA",
                                    operator: "="
                                }],
                                sumas: [{
                                    key: "FechaEmision"
                                }, {
                                    key: "Tipo"
                                }]
                            },
                            page: 1,
                            pageSize: 4,
                            sum: false,
                        },
                        ["Tipo", "FechaEmision"],
                        "Cantidad"

                    )
                ]);

            console.log(chartCompras[0], "-----", chartVentas[0], "-----", chartMermas[0]);
        } catch (error: any) {
            console.error(error);
        }
    }, [getAPI]);

    useEffect(() => {
        handleLoadData();
    }, [handleLoadData]);

    const areaData: ChartData[] = [
        { name: "Compras", data: [{ x: "2023-10-01", y: 100 }, { x: "2023-10-02", y: 150 }] },
        { name: "Ventas", data: [{ x: "2023-10-01", y: 80 }, { x: "2023-10-02", y: 120 }] },
        { name: "Mermas", data: [{ x: "2023-10-01", y: 20 }, { x: "2023-10-02", y: 30 }] },
    ];

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

    return (
        <div className="p-4">
            {/* Gráfico de Área */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Comparacion COMPRA/VENTA/MERMAS</h2>
                <RenderChart type="area" barData={areaData} treemapData={[]} />
            </div>

            {/* Gráfico de Tarta */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Categorias</h2>
                <RenderChart type="pie" barData={pieData} treemapData={[]} />
            </div>

            {/* Gráfico de Treemap */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Productos de temporada</h2>
                <RenderChart type="treemap" barData={[]} treemapData={treemapData} />
            </div>
        </div>
    );
}
