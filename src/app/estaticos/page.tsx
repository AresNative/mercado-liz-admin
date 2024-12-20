"use client";
import React, { useEffect, useState } from "react";
import DynamicChart from "@/components/ui/grafic";
import TreemapChart from "@/components/ui/Treemap";
import { HeatmapMultiColor, HeatmapSingleColor } from "@/components/ui/heat-map";
import { Filter, RotateCw } from "lucide-react";
import { Button, DateRangePicker, Select, SelectItem } from "@nextui-org/react";
import { useGetHistorialComprasQuery } from "@/actions/reducers/api-reducer";
import Loading from "@/components/ux/loading";

interface ChartData {
    name: string;
    data: { x: string | number; y: number }[];
}

export default function Estatico() {
    const [chartType, setChartType] = useState("bar");
    const [previewData, setPreviewData] = useState<ChartData[]>([]);
    const { data, isLoading, refetch } = useGetHistorialComprasQuery({});

    useEffect(() => {
        if (data?.data) {
            const formattedData = [
                {
                    name: "Proveedores",
                    data: data.data.map((item: any) => ({
                        x: item.ProveedorNom,
                        y: item.Total,
                    })),
                },
            ];
            setPreviewData(formattedData);
        } else {
            setPreviewData([]);
        }
    }, [data]);

    const handleChartTypeChange = (type: string) => {
        setChartType(type);
    };
    if (isLoading) return <Loading />

    return (
        <>
            <nav>
                <ul className="flex gap-2 m-2 items-center">
                    <li>
                        <DateRangePicker className="max-w-xs" label="Duración" variant="faded" />
                    </li>
                    <li className="min-w-52">
                        <Select
                            className="max-w-xs"
                            label="Tipo de Gráfica"
                            variant="faded"
                            startContent={<Filter />}
                            onChange={(e) => handleChartTypeChange(e.target.value)}
                            defaultSelectedKeys={["bar"]}
                            placeholder="Selecciona un tipo"
                            items={[
                                { value: "bar", label: "Barras" },
                                { value: "treemap", label: "Treemap" },
                                { value: "heatmap-single", label: "Heatmap Single" },
                            ]}
                        >
                            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
                        </Select>
                    </li>
                    <li className="ml-auto">
                        <Button
                            isIconOnly
                            color="secondary"
                            variant="faded"
                            aria-label="Recargar"
                            onPress={refetch}
                        >
                            <RotateCw />
                        </Button>
                    </li>
                </ul>
            </nav>
            <section>
                <RenderChart
                    type={chartType}
                    barData={previewData}
                    heatmapData={previewData}
                    treemapData={previewData}
                />
            </section>
        </>
    );
}

interface RenderChartProps {
    type: string;
    barData: ChartData[];
    heatmapData: ChartData[];
    treemapData: ChartData[];
}

function RenderChart({ type, barData, heatmapData, treemapData }: RenderChartProps) {
    const categories = barData.slice(0, 6).map((data: any) => data.data.map((item: { x: string }) => item.x));

    switch (type) {
        case "treemap":
            return <TreemapChart data={treemapData} height={""} />;
        case "heatmap-single":
            return <HeatmapSingleColor data={heatmapData} height={""} />;
        default:
            return (
                <DynamicChart
                    type="bar"
                    categories={[categories]}
                    data={barData}
                    height={""}
                />
            );
    }
}
