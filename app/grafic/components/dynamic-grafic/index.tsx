"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ChartData } from "../../@user/page";

// Carga dinámica de ApexCharts para evitar problemas en el servidor de Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Tipado para las props del componente
interface DynamicChartProps {
    type: "pie" | "bar" | "line" | "area"; // Tipos válidos de gráficos
    categories: string[]; // Categorías para el eje x o etiquetas
    data: ChartData[]; // Datos de la serie
    height?: string | number; // Altura opcional del gráfico
}

const DynamicChart: React.FC<DynamicChartProps> = ({ type, categories, data, height = 350 }) => {
    // Configuración común para los gráficos
    const chartOptions: ApexOptions = {
        chart: {
            type: type,
            toolbar: { show: true },
            background: "transparent",
        },
        xaxis: type !== "pie" ? {
            categories,
            labels: { style: { colors: "#64748b", fontSize: "12px" } },
        } : undefined,
        stroke: {
            curve: type === "area" || type === "line" ? "smooth" : "straight",
            width: 2,
        },
        fill: type === "area" ? {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 },
        } : { type: "solid" },
        plotOptions: type === "bar" ? {
            bar: { borderRadius: 4, horizontal: categories.length > 4 },
        } : undefined,
        dataLabels: { enabled: false },
        tooltip: { theme: "dark" },
        legend: { position: "bottom" },
        labels: type === "pie" ? categories : undefined, // Solo para gráfico de pie
    };

    return <Chart options={chartOptions} series={data} type={type} height={height} />;
};

export default DynamicChart;
