"use client";

import dynamic from "next/dynamic";

// Carga dinámica de ApexCharts para evitar problemas en el servidor de Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
export const HeatmapMultiColor  = ({ data }) => {
  const chartOptions = {
    chart: {
      height: 350,
      type: 'heatmap',
      toolbar: { show: false },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
      },
    },
    xaxis: {
      type: 'category',
    },
  };

  return <Chart options={chartOptions} series={data} type="heatmap" height={350} />;
};

export const HeatmapSingleColor = ({ data }) => {
   const chartOptions = {
    chart: {
      height: 350,
      type: 'heatmap',
      toolbar: { show: false },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.4, // Ajuste de la intensidad para un difuminado más suave
       
      },
    },
    dataLabels: {
      enabled: false, // Desactivar etiquetas para un diseño más limpio
     },
    
    colors: ["#008FFB"],
    xaxis: {
    
           type: 'category',
       },
  };

  return <Chart options={chartOptions} series={data} type="heatmap" height={350} />;
};