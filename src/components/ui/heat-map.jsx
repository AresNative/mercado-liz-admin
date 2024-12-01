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

    const { min, max} = getMinMax(data)
   const chartOptions = {
    chart: {
      height: 350,
      type: 'heatmap',
      toolbar: { show: false },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.4, // Ajuste de la intensidad para un difuminado más suave
        colorScale: {
          ranges: [
            {
              from: min,
              to: max,
              color: '#42acfc', // Color base
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false, // Desactivar etiquetas para un diseño más limpio
    },
    xaxis: {
    
           type: 'category',
       },
  };

  return <Chart options={chartOptions} series={data} type="heatmap" height={350} />;
};

const getMinMax = (data) => {
  let min = Infinity;
  let max = -Infinity;

  // Recorremos los datos para encontrar el valor mínimo y máximo
  data.forEach((metric) => {
    metric.data.forEach((value) => {
      if (value < min) min = value;
      if (value > max) max = value;
    });
  });

  return { min, max };
};
