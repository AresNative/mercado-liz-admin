"use client";

import dynamic from "next/dynamic";

// Carga dinámica de ApexCharts para evitar problemas en el servidor de Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DynamicChart = ({ type, categories, data, height = null | Number }) => {
  // Configuración común para los gráficos
  const chartOptions = type === "pie" ? {
  chart: { type: "pie" },
  labels: categories,
  fill: {
    type: type === "area" ? "gradient" : "solid",
    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 },
  },
  legend: { position: "bottom" },
  tooltip: { theme: "dark" },
} : {
  chart: { type, toolbar: { show: true }, background: "transparent" },
  xaxis: { categories, labels: { style: { colors: "#64748b", fontSize: "12px" } } },
  stroke: { curve: type === "area" || type === "line" ? "smooth" : "straight", width: 2 },
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

  return <Chart options={chartOptions} series={data} type={type} height={height} />;
};

export default DynamicChart;
