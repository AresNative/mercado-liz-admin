"use client";
import { useEffect, useState } from "react";
import { useGetVentasMutation } from "@/hooks/reducers/api";
import MainForm from "@/components/form/main-form";
import { RenderChartProps, RenderChart } from "../components/render-grafic";
import { formatLoadDate, loadDataGrafic } from "../constants/load-data";

export interface ChartData {
    name: string;
    data: { x: string; y: number }[];
}

export default function Estatico() {

}

