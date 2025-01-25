"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ChartData } from "../../@user/page";

// Carga dinámica de ApexCharts para evitar problemas en el servidor de Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Tipado para las props del componente
interface TreemapChartProps {
    data: ChartData[]; // Datos requeridos para el gráfico de treemap
    height?: string | number; // Altura opcional del gráfico
}

const TreemapChart: React.FC<TreemapChartProps> = ({ data, height = 350 }) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: "treemap",
            height: height,
            toolbar: { show: false },
        },
        plotOptions: {
            treemap: {
                distributed: true,
                enableShades: true,
                shadeIntensity: 0.5,
            },
        },
        colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"],
        title: {
            align: "center",
            style: {
                fontSize: "20px",
                fontWeight: "bold",
            },
        },
        tooltip: { theme: "dark" },
    };

    return <Chart options={chartOptions} series={data} type="treemap" height={height} />;
};

export default TreemapChart;
