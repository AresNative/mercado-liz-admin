import { generateData } from "@/components/hooks/data";
import DynamicChart from "@/components/ui/grafic";
import { HeatmapMultiColor, HeatmapSingleColor } from "@/components/ui/heat-map";
import TreemapChart from "@/components/ui/Treemap";

const ChartPage = () => {
  const barData = [
    { name: "Ingresos", data: [30, 40, 45, 50, 49, 60] },
    { name: "Ventas", data: [20, 35, 40, 55, 65, 70] },
  ];

  const lineData = [
    { name: "Clientes Activos", data: [10, 15, 25, 35, 45, 50] },
    { name: "Nuevos Clientes", data: [5, 10, 15, 20, 25, 30] },
  ];

  const areaData = [
    { name: "Usuarios Nuevos", data: [15, 30, 25, 40, 35, 50] },

    { name: "Usuarios", data: [40, 35, 15, 30, 25, 50] },

    { name: "Nuevos", data: [25, 15, 40, 35, 30, 50] },
  ];

  const pieData = [45, 30, 25];
  const treemapData = [
    {
      data: [
        { x: "A", y: 90 },
        { x: "B", y: 20 },
        { x: "C", y: 30 },
        { x: "D", y: 40 },
        { x: "E", y: 50 },
        { x: "F", y: 30 },
        { x: "G", y: 15 },
        { x: "H", y: 25 },
        { x: "I", y: 35 },
        { x: "J", y: 45 },
      ],
    },
  ];
  const heatmapData = generateData(5, 7)
  const heatmapDataSingle = generateData(10, 10);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dynamic Chart Examples</h1>

      {/* Gráfico de barras */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Bar Chart</h2>
        <DynamicChart type="bar" categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} data={barData} />
      </div>

      {/* Gráfico de líneas */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Line Chart</h2>
        <DynamicChart type="line" categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} data={lineData} />
      </div>

      {/* Gráfico de área */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Area Chart</h2>
        <DynamicChart type="area" categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} data={areaData} />
      </div>

      {/* Gráfico circular */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pie Chart</h2>
        <DynamicChart type="pie" categories={["Productos", "Servicios", "Suscripciones"]} data={pieData} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Treemap Chart</h2>
        <TreemapChart data={treemapData} />
      </div>
      <div>
        <h2>Heatmap</h2>
        <HeatmapMultiColor data={heatmapData} />
        <HeatmapSingleColor data={heatmapDataSingle} />
      </div>
    </div>
  );
};

export default ChartPage;
