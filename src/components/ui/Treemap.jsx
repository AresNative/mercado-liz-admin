"use client";

import dynamic from "next/dynamic";

// Carga dinámica de ApexCharts para evitar problemas en el servidor de Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TreemapChart = ({data, height= null | Number}) => {
  const chartOptions = {
    chart: {
      height: 350,
      type: 'treemap',
      toolbar: { show: false },
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: true,
        shadeIntensity: 0.5,
      },
    },
    title: {
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
      },
    },
  };

    return <Chart options={chartOptions} series={data} type="treemap" height={height} />;
};

export default TreemapChart;
