'use client'

import React, { useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Card, CardHeader, CardBody } from "@nextui-org/card"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown"
import { FileText, FileSpreadsheet } from 'lucide-react'
import { useAsyncList } from '@react-stately/data'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import autoTable from "jspdf-autotable"

type ReportItem = {
    id: number;
    art: string;
    unit: string;
    cant: number;
    price: number;
    idMov: string;
    idTypeTaxes: string;
    client: string;
    user: string;
}

type Filters = {
    codigo: string;
    cuenta: string;
    proveedor: string;
    fechaEmision: string;
}

export default function ReportesScreen() {
    const [filters, setFilters] = useState<Filters>({
        codigo: '',
        cuenta: '',
        proveedor: '',
        fechaEmision: '',
    });

    const handleFilterChange = (field: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }

    const filterItems = (items: ReportItem[], filters: Filters) => {
        return items.filter((item) => {
            return (
                (filters.codigo === '' || item.art.toLowerCase().includes(filters.codigo.toLowerCase())) &&
                (filters.cuenta === '' || item.unit.toLowerCase().includes(filters.cuenta.toLowerCase())) &&
                (filters.proveedor === '' || item.client.toLowerCase().includes(filters.proveedor.toLowerCase())) &&
                (filters.fechaEmision === '' || item.idMov.includes(filters.fechaEmision))
            );
        });
    }

    const [isLoading, setIsLoading] = useState<boolean>(true);

    let list = useAsyncList<ReportItem>({
        async load({ signal }) {
            try {
                let res = await fetch('http://matrizmercadoliz.dyndns.org:29010/api/v1/reporteria/ventas', { signal });

                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }

                let json = await res.json();
                return {
                    items: json as ReportItem[],
                };
            } catch (error) {
                console.error("Error fetching data:", error);
                return { items: [] };
            } finally {
                setIsLoading(false);
            }
        },
        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a: any, b: any) => {
                    let first = a[sortDescriptor.column!];
                    let second = b[sortDescriptor.column!];

                    let firstValue = isNaN(first) ? first : parseInt(first);
                    let secondValue = isNaN(second) ? second : parseInt(second);

                    let cmp = firstValue < secondValue ? -1 : 1;

                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                }),
            };
        },
    });

    const filteredItems = filterItems(list.items, filters);

    // Extraer valores únicos para sugerencias (autocompletado)
    const uniqueValues = (key: keyof ReportItem) => {
        return Array.from(new Set(list.items.map(item => item[key]))).slice(0, 10); // Limitar a 10 sugerencias
    };

    // Función para exportar a PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Compras", 14, 10);

        const tableColumns = ["Código", "Unidad", "Cantidad", "Precio", "Mov ID", "Impuesto", "Cliente", "Usuario"];
        const tableRows: any[] = [];

        filteredItems.forEach((item) => {
            const rowData = [
                item.art,
                item.unit,
                item.cant,
                item.price.toFixed(2),
                item.idMov,
                item.idTypeTaxes,
                item.client,
                item.user,
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: 20,
        });

        doc.save('reporte_compras.pdf');
    };

    // Función para exportar a Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredItems.map(item => ({
                Código: item.art,
                Unidad: item.unit,
                Cantidad: item.cant,
                Precio: item.price.toFixed(2),
                "Mov ID": item.idMov,
                Impuesto: item.idTypeTaxes,
                Cliente: item.client,
                Usuario: item.user,
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Compras");

        XLSX.writeFile(workbook, 'reporte_compras.xlsx');
    };

    return (
        <Card className="max-w-[1000px] mx-auto">
            <CardHeader className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Reporte de Ventas</h1>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="flat">
                            Exportar
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Opciones de exportación">
                        <DropdownItem key="pdf" startContent={<FileText />} onPress={exportToPDF}>
                            Exportar a PDF
                        </DropdownItem>
                        <DropdownItem key="excel" startContent={<FileSpreadsheet />} onPress={exportToExcel}>
                            Exportar a Excel
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </CardHeader>
            <CardBody>
                <div className="flex gap-4 mb-4">
                    <div>
                        <Input
                            placeholder="Código"
                            autoComplete="off"
                            list="codigo-options"
                            value={filters.codigo}
                            onChange={(e) => handleFilterChange('codigo', e.target.value)}
                        />
                        <datalist id="codigo-options">
                            {uniqueValues('art').map((codigo, index) => (
                                <option key={index} value={codigo} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <Input
                            placeholder="Cuenta"
                            autoComplete="off"
                            list="cuenta-options"
                            value={filters.cuenta}
                            onChange={(e) => handleFilterChange('cuenta', e.target.value)}
                        />
                        <datalist id="cuenta-options">
                            {uniqueValues('unit').map((cuenta, index) => (
                                <option key={index} value={cuenta} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <Input
                            placeholder="Proveedor"
                            autoComplete="off"
                            list="proveedor-options"
                            value={filters.proveedor}
                            onChange={(e) => handleFilterChange('proveedor', e.target.value)}
                        />
                        <datalist id="proveedor-options">
                            {uniqueValues('client').map((proveedor, index) => (
                                <option key={index} value={proveedor} />
                            ))}
                        </datalist>
                    </div>
                    <Input
                        type="date"
                        autoComplete="on"
                        placeholder="Fecha de Emisión"
                        value={filters.fechaEmision}
                        onChange={(e) => handleFilterChange('fechaEmision', e.target.value)}
                    />
                </div>
                <Table
                    aria-label="Tabla de reportes de compras"
                    sortDescriptor={list.sortDescriptor}
                    onSortChange={list.sort}
                    disableAnimation
                >
                    <TableHeader>
                        <TableColumn key="art" allowsSorting>Código</TableColumn>
                        <TableColumn key="unit" allowsSorting>Unidad</TableColumn>
                        <TableColumn key="cant" allowsSorting>Cantidad</TableColumn>
                        <TableColumn key="price" allowsSorting>Precio</TableColumn>
                        <TableColumn key="idMov" allowsSorting>Mov ID</TableColumn>
                        <TableColumn key="idTypeTaxes" allowsSorting>Impuesto</TableColumn>
                        <TableColumn key="client" allowsSorting>Cliente</TableColumn>
                        <TableColumn key="user" allowsSorting>Usuario</TableColumn>
                    </TableHeader>
                    <TableBody items={filteredItems} isLoading={isLoading}>
                        {(item: ReportItem) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.art}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.cant}</TableCell>
                                <TableCell>{item.price.toFixed(2)}</TableCell>
                                <TableCell>{item.idMov}</TableCell>
                                <TableCell>{item.idTypeTaxes}</TableCell>
                                <TableCell>{item.client}</TableCell>
                                <TableCell>{item.user}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    )
}
