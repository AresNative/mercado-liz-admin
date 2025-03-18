"use client";

import { useCallback, useEffect, useMemo, useState, memo, useRef } from "react";
import { RenderChart } from "../components/render-grafic";
import { loadDataGrafic } from "../constants/load-data";
import { useGetAllMutation } from "@/hooks/reducers/api";

export interface ChartData {
    name: string;
    data: { x: string; y: number }[];
}

interface ChartConfig {
    filter: any;
    nameX: string[];
    nameY: string;
}

export default function Estatico() {
    const [charts, setCharts] = useState<{
        area: any;
        pie: any;
        treemap: any;
    }>({ area: [], pie: [], treemap: [] });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [getAPI] = useGetAllMutation();
    const controllerRef = useRef<AbortController>(null);

    // Configuraciones memoizadas
    const chartConfigs = useMemo(() => ({
        COMPRA: createChartConfig("COMPRA", ["Tipo", "Mes"], "Mes", "Costo"),
        VENTA: createChartConfig("VENTA", ["Tipo", "Mes"], "Mes", "Importe"),
        MERMA: createChartConfig("MERMA", ["Tipo", "Mes"], "Mes", "Costo", "="),
        CATEGORY: createChartConfig("VENTA", ["Categoria"], "Importe", "Importe"),
        ARTICULO: createChartConfig("VENTA", ["Nombre"], "Importe", "Importe")
    }), []);

    const handleLoadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            controllerRef.current = new AbortController();

            const [compras, ventas, mermas, categorias, articulos] = await Promise.all([
                loadDataGrafic(getAPI, chartConfigs.COMPRA.filter, chartConfigs.COMPRA.nameX, chartConfigs.COMPRA.nameY),
                loadDataGrafic(getAPI, chartConfigs.VENTA.filter, chartConfigs.VENTA.nameX, chartConfigs.VENTA.nameY),
                loadDataGrafic(getAPI, chartConfigs.MERMA.filter, chartConfigs.MERMA.nameX, chartConfigs.MERMA.nameY),
                loadDataGrafic(getAPI, chartConfigs.CATEGORY.filter, chartConfigs.CATEGORY.nameX, chartConfigs.CATEGORY.nameY),
                loadDataGrafic(getAPI, chartConfigs.ARTICULO.filter, chartConfigs.ARTICULO.nameX, chartConfigs.ARTICULO.nameY)
            ]);

            setCharts({
                area: [compras[0], ventas[0], mermas[0]],
                pie: categorias,
                treemap: articulos
            });

        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.log("Error loading data:", error);
                setError('Error al cargar los datos');
            }
        } finally {
            setIsLoading(false);
        }
    }, [getAPI, chartConfigs]);

    useEffect(() => {
        handleLoadData();
        return () => controllerRef.current?.abort();
    }, [handleLoadData]);

    return (
        <div className="p-4">
            {isLoading && <Loader />}
            {error && <Error message={error} />}

            <ChartGrid
                areaData={charts.area}
                pieData={charts.pie}
                treemapData={charts.treemap}
            />
        </div>
    );
}

// Función para crear configuraciones
function createChartConfig(
    tipo: string,
    sumFields: string[],
    orderField: string,
    yField: string,
    operator: string = ""
): ChartConfig {
    return {
        filter: {
            filters: {
                filtros: [{ key: "Tipo", value: tipo, operator }],
                Selects: sumFields.map(key => ({ key })),
                Order: [{ Key: orderField, Direction: "Desc" }]
            },
            page: 1,
            pageSize: 6,
            sum: true,
            distinct: false
        },
        nameX: sumFields,
        nameY: yField
    };
}

// Componentes memoizados
const Loader = memo(() => <div className="p-4">Cargando datos...</div>);

const Error = memo(({ message }: { message: string }) => (
    <span className="text-red-500 font-bold text-2xl p-4">{message}</span>
));

const ChartGrid = memo(({ areaData, pieData, treemapData }: {
    areaData: ChartData[];
    pieData: any;
    treemapData: ChartData[];
}) => {

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-28">
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
        </>
    )
});

const ChartSection = memo(({
    title,
    type,
    data
}: {
    title: string;
    type: 'area' | 'pie' | 'treemap';
    data: ChartData[];
}) => (
    <div className="p-2">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {title}
        </h2>
        <div className="h-64">
            <RenderChart
                type={type}
                barData={type === 'treemap' ? [] : data}
                treemapData={type === 'treemap' ? data : []}
            />
        </div>
    </div>
));