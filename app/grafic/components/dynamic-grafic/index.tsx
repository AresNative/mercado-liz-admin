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

const DynamicChart: React.FC<DynamicChartProps> = ({
    type,
    categories,
    data,
    height = 350,
}) => {
    // Configuración común para los gráficos
    const chartOptions: ApexOptions =
        type === "pie"
            ? {
                chart: { type: "pie" },
                labels: categories,
                fill: {
                    type: "gradient",
                    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 },
                },
                legend: { position: "bottom" },
                tooltip: { theme: "dark" },
            }
            : {
                chart: { type, toolbar: { show: true }, background: "transparent" },
                xaxis: {
                    categories,
                    labels: { style: { colors: "#64748b", fontSize: "12px" } },
                },
                stroke: {
                    curve: type === "area" || type === "line" ? "smooth" : "straight",
                    width: 2,
                },
                fill: {
                    type: type === "area" ? "gradient" : "solid",
                    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 },
                },
                plotOptions: {
                    bar: { borderRadius: 4, horizontal: type === "bar" && categories.length > 4 },
                },
                dataLabels: { enabled: false },
                tooltip: { theme: "dark" },
                legend: { position: "bottom" },
            };

    // Convertir datos al formato requerido para las series del gráfico
    const series =
        type === "pie"
            ? data.flatMap((d) => d.data.map((item) => item.y))
            : data.map((d) => ({
                name: d.name,
                data: d.data.map((item) => item.y),
            }));

    return <Chart options={chartOptions} series={series} type={type} height={height} />;
};

export default DynamicChart;
