"use client";

import { useCallback, useEffect, useMemo, useState, memo, useRef } from "react";
import { RenderChart } from "../components/render-grafic";
import { loadDataGrafic } from "../constants/load-data";
import { useGetAllMutation } from "@/hooks/reducers/api";

export interface ChartData {
    name: string;
    data: { x: string; y: number }[];
}

const dataCache = {
    charts: null as {
        area: ChartData[];
        pie: ChartData[];
        treemap: ChartData[]
    } | null,
    timestamp: 0
};

const CACHE_DURATION = 3 * 60 * 1000;

export default function Estatico() {
    const [areaData, setAreaData] = useState<ChartData[]>([]);
    const [pieData, setPieData] = useState<ChartData[]>([]);
    const [treemapData, setTreemapData] = useState<ChartData[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [getAPI] = useGetAllMutation();
    const controllerRef = useRef<AbortController>(null);

    const handleLoadData = useCallback(async () => {
        if (dataCache.charts && Date.now() - dataCache.timestamp < CACHE_DURATION) {
            setAreaData(dataCache.charts.area);
            setPieData(dataCache.charts.pie);
            setTreemapData(dataCache.charts.treemap);
            return;
        }

        setError(null);
        try {
            controllerRef.current = new AbortController();

            const commonFilters = {
                page: 1,
                pageSize: 6,
                sum: true,
                distinct: false
            };

            const queries = [
                { tipo: "COMPRA", groupBy: ["Tipo", "Mes"], valueKey: "Costo" },
                { tipo: "VENTA", groupBy: ["Tipo", "Mes"], valueKey: "Importe" },
                { tipo: "MERMA", groupBy: ["Tipo", "Mes"], valueKey: "Costo" },
                { tipo: "VENTA", groupBy: ["Importe", "Categoria"], valueKey: "Importe", selects: [{ key: "Categoria" }], orderBy: [{ Key: "Importe", Direction: "Desc" }] },
                { tipo: "VENTA", groupBy: ["Importe", "Nombre"], valueKey: "Importe", selects: [{ key: "Nombre" }], orderBy: [{ Key: "Importe", Direction: "Desc" }] }
            ];

            const chartData = await Promise.all(
                queries.map(({ tipo, groupBy, valueKey, selects, orderBy }) =>
                    loadDataGrafic(
                        getAPI,
                        {
                            filters: {
                                filtros: [{ key: "Tipo", value: tipo, operator: "" }],
                                Selects: selects || [{ key: "Año" }, { key: "Mes" }, { key: "Tipo" }],
                                Order: orderBy || [
                                    { Key: "Año", Direction: "Desc" },
                                    { Key: "Mes", Direction: "Desc" }
                                ]
                            },
                            ...commonFilters
                        },
                        groupBy,
                        valueKey
                    )
                )
            );

            const [chartCompras, chartVentas, chartMermas, chartCategory, chartArt] = chartData;

            const newCharts = {
                area: [chartCompras[0], chartVentas[0], chartMermas[0]],
                pie: chartCategory,
                treemap: chartArt
            };


            dataCache.charts = newCharts;
            dataCache.timestamp = Date.now();

            setAreaData(newCharts.area);
            setPieData(newCharts.pie);
            setTreemapData(newCharts.treemap);

        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.log("Error:", error);
                setError('Error al cargar los datos');
            }
        }
    }, [getAPI]);

    useEffect(() => {
        handleLoadData();
        return () => controllerRef.current?.abort();
    }, [handleLoadData]);

    const MemoizedCharts = useMemo(() => (
        <div className="p-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full">
                <ChartSection
                    title="Comparación COMPRA/VENTA/MERMAS"
                    type="area"
                    data={areaData}
                />
                <ChartSection
                    title="Distribución por Categorías"
                    type="pie"
                    data={pieData}
                />
            </div>

            <ChartSection
                title="Productos más vendidos"
                type="treemap"
                data={treemapData}
            />
        </div>
    ), [areaData, pieData, treemapData]);

    if (error) {
        return <Error message={error} />;
    }

    return MemoizedCharts;
}

const ChartSection = memo(({
    title,
    type,
    data
}: {
    title: string;
    type: 'area' | 'pie' | 'treemap';
    data: ChartData[];
}) => (
    <div className="mb-8 w-full">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {title}
        </h2>
        <RenderChart
            type={type}
            barData={type === 'treemap' ? [] : data}
            treemapData={type === 'treemap' ? data : []}
        />
    </div>
));

const Error = memo(({ message }: { message: string }) => (
    <span className="text-red-500 font-bold text-2xl block p-4">
        {message}
    </span>
));