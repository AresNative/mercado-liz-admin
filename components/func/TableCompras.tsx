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

// Requiere jspdf-autotable
const autoTable = require('jspdf-autotable');

type ReportItem = {
    codigo: string;
    cuenta: string;
    unidad: string;
    compraD_ID: number;
    compraD_Codigo: string;
    articulo: string;
    cantidad: number;
    costo: number;
    compra_ID: number;
    movID: string;
    fechaEmision: string;
    proveedor: string;
    proveedor_Nombre: string;
}

type Filters = {
    codigo: string;
    cuenta: string;
    proveedor: string;
    fechaEmision: string;
}

export default function ReportesScreenCompras() {
    const [filters, setFilters] = useState<Filters>({
        codigo: '',
        cuenta: '',
        proveedor: '',
        fechaEmision: '',
    });

    const [barcode, setBarcode] = useState<string>('');
    const [barcodeEntered, setBarcodeEntered] = useState<boolean>(false);

    const handleFilterChange = (field: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }

    const handleBarcodeSubmit = () => {
        if (barcode.trim() !== '') {
            setBarcodeEntered(true);
            list.reload(); // Recargar la lista cuando se ingrese el código de barras
        }
    }

    const filterItems = (items: ReportItem[], filters: Filters) => {
        return items.filter((item) => {
            return (
                (filters.codigo === '' || item.codigo.toLowerCase().includes(filters.codigo.toLowerCase())) &&
                (filters.cuenta === '' || item.cuenta.toLowerCase().includes(filters.cuenta.toLowerCase())) &&
                (filters.proveedor === '' || item.proveedor_Nombre.toLowerCase().includes(filters.proveedor.toLowerCase())) &&
                (filters.fechaEmision === '' || item.fechaEmision.includes(filters.fechaEmision))
            );
        });
    }

    const [isLoading, setIsLoading] = useState<boolean>(true);

    let list = useAsyncList<ReportItem>({
        async load({ signal }) {

            try {
                let res = await fetch(`http://matrizmercadoliz.dyndns.org:29010/api/v1/reporteria/compras?codigo=${encodeURIComponent(barcode)}`, { signal });

                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }

                let json = await res.json();
                // Mapear los datos al formato deseado
                let mappedData = json.map((item: any) => ({
                    codigo: item.codigo,
                    cuenta: item.cuenta,
                    unidad: item.unidad,
                    compraD_ID: item.compraD_ID,
                    compraD_Codigo: item.compraD_Codigo || '',
                    articulo: item.articulo,
                    cantidad: item.cantidad,
                    costo: item.costo,
                    compra_ID: item.compra_ID,
                    movID: item.movID,
                    fechaEmision: item.fechaEmision,
                    proveedor: item.proveedor,
                    proveedor_Nombre: item.proveedor_Nombre,
                }));

                return {
                    items: mappedData as ReportItem[],
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

    return (
        <Card className="max-w-[1000px] mx-auto">
            <CardHeader className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Reporte de Compras</h1>
            </CardHeader>
            <CardBody>
                {!barcodeEntered ? (
                    <div className="flex flex-col items-center">
                        <Input
                            placeholder="Ingrese el código de barra"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                        />
                        <Button className="mt-4" onPress={handleBarcodeSubmit}>
                            Confirmar Código de Barra
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-4 mb-4">
                            {/* Filtros */}
                            <div>
                                <Input
                                    placeholder="Código"
                                    autoComplete="off"
                                    value={filters.codigo}
                                    onChange={(e) => handleFilterChange('codigo', e.target.value)}
                                />
                            </div>
                            <div>
                                <Input
                                    placeholder="Cuenta"
                                    autoComplete="off"
                                    value={filters.cuenta}
                                    onChange={(e) => handleFilterChange('cuenta', e.target.value)}
                                />
                            </div>
                            <div>
                                <Input
                                    placeholder="Proveedor"
                                    autoComplete="off"
                                    value={filters.proveedor}
                                    onChange={(e) => handleFilterChange('proveedor', e.target.value)}
                                />
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
                                <TableColumn key="codigo" allowsSorting>Código</TableColumn>
                                <TableColumn key="cuenta" allowsSorting>Cuenta</TableColumn>
                                <TableColumn key="unidad" allowsSorting>Unidad</TableColumn>
                                <TableColumn key="cantidad" allowsSorting>Cantidad</TableColumn>
                                <TableColumn key="costo" allowsSorting>Costo</TableColumn>
                                <TableColumn key="movID" allowsSorting>Mov ID</TableColumn>
                                <TableColumn key="proveedor" allowsSorting>Proveedor</TableColumn>
                                <TableColumn key="proveedor_Nombre" allowsSorting>Proveedor Nombre</TableColumn>
                            </TableHeader>
                            <TableBody items={filteredItems} isLoading={isLoading}>
                                {(item: ReportItem) => (
                                    <TableRow key={item.compraD_ID}>
                                        <TableCell>{item.codigo}</TableCell>
                                        <TableCell>{item.cuenta}</TableCell>
                                        <TableCell>{item.unidad}</TableCell>
                                        <TableCell>{item.cantidad}</TableCell>
                                        <TableCell>{item.costo.toFixed(2)}</TableCell>
                                        <TableCell>{item.movID}</TableCell>
                                        <TableCell>{item.proveedor}</TableCell>
                                        <TableCell>{item.proveedor_Nombre}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
