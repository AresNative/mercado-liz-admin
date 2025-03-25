"use client"

import { cn } from "@/utils/functions/cn"
import { ShoppingCart, BarChart3, Eye, LineChart, FileQuestion, Table } from "lucide-react"

interface ActionTabsProps {
    activeTab?: string
}

export function ActionTabs({ activeTab = "Compras" }: ActionTabsProps) {
    const tabs = [
        {
            name: "Compras",
            icon: <ShoppingCart className="h-4 w-4 mr-2" />,
        },
        {
            name: "Ventas",
            icon: <BarChart3 className="h-4 w-4 mr-2" />,
        },
        {
            name: "Ver Filtros",
            icon: <Eye className="h-4 w-4 mr-2" />,
        },
        {
            name: "Ver Resumen",
            icon: <LineChart className="h-4 w-4 mr-2" />,
        },
        {
            name: "Ver Grafica",
            icon: <LineChart className="h-4 w-4 mr-2" />,
        },
        {
            name: "Ver Cuestionario",
            icon: <FileQuestion className="h-4 w-4 mr-2" />,
        },
        {
            name: "Ver Tabla",
            icon: <Table className="h-4 w-4 mr-2" />,
        },
    ]

    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.name}
                    className={cn(
                        "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium",
                        activeTab === tab.name
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
                    )}
                >
                    {tab.icon}
                    {tab.name}
                </button>
            ))}
        </div>
    )
}

