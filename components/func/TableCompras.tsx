'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Card,
    CardHeader,
    CardBody,
    Tabs,
    Tab,
    Spinner,
    Tooltip,
} from '@nextui-org/react';
import {
    BarChart,
    LineChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
} from 'recharts';
import { FileText, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

export default function ImprovedReportsScreen() {
    const [activeTab, setActiveTab] = useState('ventas');
    const [filters, setFilters] = useState({
        codigo: '',
        cuenta: '',
        proveedor: '',
        fechaEmision: '',
    });
    const [barcode, setBarcode] = useState('');
    const [chartData, setChartData] = useState<any>([]);
    const [reportData, setReportData] = useState<any>([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleFilterChange = (field: any, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleBarcodeSubmit = () => {
        if (barcode.trim() !== '') fetchData();
    };

    const updateChartData = (items: any) => {
        const aggregatedData = items.reduce((acc: any, item: any) => {
            const cuenta = item.cuenta || item.art || item.codigo || 'Desconocido';
            const cantidad = item.cantidad || item.cant || 0;
            const precio = item.precio || item.price || item.costo || 0;

            if (!acc[cuenta]) {
                acc[cuenta] = { cuenta, totalVentas: 0 };
            }
            acc[cuenta].totalVentas += cantidad * precio;
            return acc;
        }, {});
        setChartData(Object.values(aggregatedData));
    };

    const filterItems = (items: any) => {
        return items.filter((item: any) => {
            const codigoMatch =
                filters.codigo === '' ||
                (item.codigo && item.codigo.toLowerCase().includes(filters.codigo.toLowerCase()));
            const cuentaMatch =
                filters.cuenta === '' ||
                (item.cuenta && item.cuenta.toLowerCase().includes(filters.cuenta.toLowerCase()));
            const proveedorMatch =
                filters.proveedor === '' ||
                (item.cliente && item.cliente.toLowerCase().includes(filters.proveedor.toLowerCase()));
            const fechaMatch =
                filters.fechaEmision === '' || (item.movID && item.movID.includes(filters.fechaEmision));
            return codigoMatch && cuentaMatch && proveedorMatch && fechaMatch;
        });
    };

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const url = `http://matrizmercadoliz.dyndns.org:29010/api/v1/reporteria/${activeTab}`;
            const query =
                activeTab === 'compras' ? `?codigo=${encodeURIComponent(barcode)}` : '';
            const res = await fetch(`${url}${query}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
            }

            const json = await res.json();

            if (!Array.isArray(json)) {
                throw new Error('La respuesta de la API no es un array.');
            }

            // Añadir el campo 'tipo' a cada elemento
            const dataWithTipo = json.map((item: any) => ({
                ...item,
                tipo: activeTab === 'ventas' ? 'venta' : 'compra',
            }));

            setReportData(dataWithTipo);
            updateChartData(dataWithTipo);

            // Generar columnas basadas en los datos
            const generatedColumns = generateColumns(dataWithTipo);
            setColumns(generatedColumns);
        } catch (error) {
            console.error('Error fetching data:', error);
            setReportData([]);
            setColumns([]); // Aseguramos que las columnas se limpien en caso de error
        } finally {
            setIsLoading(false);
        }
    };

    const generateColumns = (data: any) => {
        if (!data || data.length === 0) return [];
        const keys = Object.keys(data[0]);

        // Excluir claves no deseadas
        const excludeKeys = ['tipo']; // Agrega más claves si es necesario
        const filteredKeys = keys.filter((key: any) => !excludeKeys.includes(key));

        // Mapear claves a columnas con etiquetas legibles
        const columns = filteredKeys.map((key: any) => ({
            key: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
        }));

        return columns;
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const exportToPDF = () => {
        const doc: any = new jsPDF();
        const tableColumn = columns.map((col: any) => col.label);
        const tableRows = filterItems(reportData).map((item: any) => {
            return columns.map((col: any) => item[col.key]);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
        });
        doc.save('reporte.pdf');
    };

    const exportToExcel = () => {
        const dataToExport = filterItems(reportData).map((item: any) => {
            const row: any = {};
            columns.forEach((col: any) => {
                row[col.label] = item[col.key];
            });
            return row;
        });
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
        XLSX.writeFile(wb, 'reporte.xlsx');
    };

    const handleTabChange = (key: any) => setActiveTab(String(key));

    const renderCell = useCallback((item: any, columnKey: any) => {
        return item[columnKey] !== undefined && item[columnKey] !== null
            ? item[columnKey]
            : '-';
    }, []);

    return (
        <Card className="max-w-5xl mx-auto my-8 p-6 rounded-lg shadow-lg">
            <CardHeader className="flex justify-between items-center pb-4 border-b border-gray-300 ">
                <h1 className="text-3xl font-semibold ">Gestión de Reportes</h1>
                <div className="flex space-x-4">
                    <Button
                        onClick={exportToPDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                    >
                        <FileText className="w-5 h-5" /> <span>PDF</span>
                    </Button>
                    <Button
                        onClick={exportToExcel}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                    >
                        <FileSpreadsheet className="w-5 h-5" /> <span>Excel</span>
                    </Button>
                </div>
            </CardHeader>

            <CardBody className="space-y-6">
                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={handleTabChange}
                    className="border-b border-gray-200 pb-4"
                >
                    <Tab key="ventas" className="bg-transparent" title="Reporte de Ventas" />
                    <Tab key="compras" className="bg-transparent" title="Reporte de Compras" />
                </Tabs>

                <div className="flex space-x-4">
                    <Input
                        placeholder="Código de barras"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="flex-grow"
                    />
                    <Button
                        onClick={handleBarcodeSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Buscar
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="cuenta" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="totalVentas" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="cuenta" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalVentas" stroke="#10b981" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <Table className="rounded-lg shadow-md">
                    <TableHeader>
                        {columns.map((column: any) => (
                            <TableColumn key={column.key}>{column.label}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody
                        items={filterItems(reportData)}
                        isLoading={isLoading}
                        loadingContent={<Spinner label="Cargando..." />}
                    >
                        {(item: any) => (
                            <TableRow key={item.id || item.compra_ID || item.compraD_ID}>
                                {columns.map((column: any) => (
                                    <TableCell key={column.key}>
                                        {renderCell(item, column.key)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
}
