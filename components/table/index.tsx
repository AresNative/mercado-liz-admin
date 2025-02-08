"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Download, Grid2x2X, MoreVertical, X } from "lucide-react";

export type DataItem = Record<string, any>;

interface DynamicTableProps {
    data: DataItem[];
    itemsPerPage?: number;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data }) => {
    const columns = useMemo(() => {
        return data.length > 0 ? Object.keys(data[0]).filter(Boolean) : [];
    }, [data]);

    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [showColumnMenu, setShowColumnMenu] = useState<string | null>(null);

    // Sincroniza las columnas visibles con las columnas disponibles
    useEffect(() => {
        setVisibleColumns(columns.reduce((acc, column) => ({ ...acc, [column]: true }), {}));
    }, [columns]);

    const toggleColumn = (column: string) => {
        setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
    };


    const toggleRowSelection = (id: number) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const toggleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const showAllColumns = () => {
        setVisibleColumns(columns.reduce((acc, column) => ({ ...acc, [column]: true }), {}))
    }

    const formatValue = (key: string, value: any) => {
        if (value === null || value === undefined) return '-';

        // Formato de fechas
        const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Formato de fechas (considera cualquier campo que contenga "fecha")
        if (normalizedKey.includes('fecha') && typeof value === 'string' || normalizedKey.includes('date') && typeof value === 'string') {
            try {
                const date = new Date(value);

                // Verificar si la fecha es válida
                if (isNaN(date.getTime())) {
                    throw new Error('Fecha inválida');
                }

                return date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // Formato 24 horas
                });
            } catch (error) {
                console.warn(`Error formateando fecha para el campo ${key}:`, error);
                return value; // Devuelve el valor original si no se puede formatear
            }
        }

        // Formato de porcentajes
        if (key.toLowerCase().includes('porcentaje') && typeof value === 'string') {
            return `${value}%`;
        }

        // Formato de precios
        if (
            (key.toLowerCase().includes('price') || key.toLowerCase().includes('importe')) &&
            typeof value === 'number'
        ) {
            return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        if (
            (key.toLowerCase().includes('cantidad')) &&
            typeof value === 'number'
        ) {
            return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        // Formato booleano
        if (typeof value === 'boolean') {
            return value ? <Check color="purple" size={18} /> : <X color="red" size={18} />;
        }

        // Formato de archivos
        if (key.toLowerCase() === 'file') {
            return value?.content ? (
                <Download
                    size={18}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:${value.contentType};base64,${value.content}`;
                        link.download = value.fileName || 'file';
                        link.click();
                    }}
                />
            ) : (
                <X color="gray" size={18} />
            );
        }

        return value.toString();
    };

    const filteredAndSortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            if (!sortColumn) return 0;
            if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortColumn, sortDirection]);
    const paginatedData = useMemo(() => {
        return filteredAndSortedData
    }, [filteredAndSortedData]);

    if (!paginatedData.length) {
        return (
            <div className="w-full">
                <section className="w-fit text-center py-5 m-auto items-center flex gap-2">
                    <Grid2x2X className="text-gray-500" /> Sin datos disponibles
                </section>
            </div>
        )
    }

    return (
        <>
            <button
                onClick={showAllColumns}
                className="border bg-indigo-600 text-white p-2 rounded-lg mb-2 hover:scale-105 transition-all">
                ver todo
            </button>
            <div className="w-full mx-auto space-y-8">
                <div className="bg-white border shadow-xl rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            checked={selectedRows.length === data.length}
                                            onChange={() =>
                                                setSelectedRows(
                                                    selectedRows.length === data.length
                                                        ? []
                                                        : data.map((_, index) => index)
                                                )
                                            }
                                        />
                                    </th>
                                    {columns.map(
                                        (column) =>
                                            visibleColumns[column] && (
                                                <th
                                                    key={column}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <button
                                                            className="flex items-center space-x-1 hover:text-gray-700"
                                                            onClick={() => toggleSort(column)}
                                                        >
                                                            <span>{column}</span>
                                                            <ChevronDown
                                                                className={`h-4 w-4 ${sortColumn === column
                                                                    ? sortDirection === "asc"
                                                                        ? "transform rotate-180"
                                                                        : ""
                                                                    : ""
                                                                    }`}
                                                            />
                                                        </button>
                                                        <div className="relative">
                                                            <button
                                                                onClick={() =>
                                                                    setShowColumnMenu(
                                                                        showColumnMenu === column ? null : column
                                                                    )
                                                                }
                                                                className="p-1 hover:bg-gray-100 rounded-full"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </button>
                                                            <AnimatePresence>
                                                                {showColumnMenu === column && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: -10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: -10 }}
                                                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5"
                                                                    >
                                                                        <div className="py-1">
                                                                            <button
                                                                                onClick={() => toggleColumn(column)}
                                                                                className="block w-full z-30 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                            >
                                                                                Ocultar columna
                                                                            </button>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                </th>
                                            )
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedData.map((item, index) => (
                                    <motion.tr
                                        key={index}
                                        className={`${selectedRows.includes(index) ? "bg-blue-50" : ""
                                            } hover:bg-gray-50`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                checked={selectedRows.includes(item.ID)}
                                                onChange={() => toggleRowSelection(item.ID)}
                                            />
                                        </td>
                                        {columns.map(
                                            (column) =>
                                                visibleColumns[column] && (
                                                    <td
                                                        key={column}
                                                        className="px-6 py-4 whitespace-nowrap"
                                                    >
                                                        <div className="text-sm text-gray-900">
                                                            {formatValue(column, item[column])}
                                                        </div>
                                                    </td>
                                                )
                                        )}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-700">
                        {selectedRows.length} columna(s) seleccionada(s)
                    </div>
                </div>
            </div>
        </>
    );
};

export default DynamicTable;
