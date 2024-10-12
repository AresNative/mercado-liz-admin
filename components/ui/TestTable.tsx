'use client'

import React, { useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Card, CardHeader, CardBody } from "@nextui-org/card"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown"
import { FileText, FileSpreadsheet } from 'lucide-react'
import { useAsyncList } from '@react-stately/data'

export default function ReportesScreen() {
    const [data, setData] = useState()
    const [filters, setFilters] = useState({
        codigo: '',
        cuenta: '',
        proveedor: '',
        fechaEmision: '',
    })

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

    const applyFilters = () => {

    }

    const [isLoading, setIsLoading] = React.useState(true);
    let list = useAsyncList({
        async load({ signal }) {
            try {
                let res = await fetch('http://localhost:5000/api/v1/reporteria/ventas', {
                    signal,
                });

                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }

                let json = await res.json();
                return {
                    items: json, // Devuelve los datos al hook de lista
                };
            } catch (error) {
                console.error("Error fetching data:", error);
                return {
                    items: [], // Devuelve una lista vacía en caso de error
                };
            } finally {
                setIsLoading(false); // Asegura que el estado de carga se actualiza al finalizar
            }
        },
    });

    const exportToPDF = () => {
        // Implementar lógica de exportación a PDF
        console.log("Exportando a PDF...")
    }

    const exportToExcel = () => {
        // Implementar lógica de exportación a Excel
        console.log("Exportando a Excel...")
    }

    return (
        <Card className="max-w-[1000px] mx-auto">
            <CardHeader className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Reporte de Compras</h1>
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
                <div className="flex flex-wrap gap-4 mb-4">
                    <Input
                        placeholder="Código"
                        value={filters.codigo}
                        onChange={(e) => handleFilterChange('codigo', e.target.value)}
                    />
                    <Input
                        placeholder="Cuenta"
                        value={filters.cuenta}
                        onChange={(e) => handleFilterChange('cuenta', e.target.value)}
                    />
                    <Input
                        placeholder="Proveedor"
                        value={filters.proveedor}
                        onChange={(e) => handleFilterChange('proveedor', e.target.value)}
                    />
                    <Input
                        type="date"
                        placeholder="Fecha de Emisión"
                        value={filters.fechaEmision}
                        onChange={(e) => handleFilterChange('fechaEmision', e.target.value)}
                    />
                    <Button color="primary" onPress={applyFilters}>
                        Aplicar Filtros
                    </Button>
                </div>
                <Table aria-label="Tabla de reportes de compras">
                    <TableHeader>
                        <TableColumn>Código</TableColumn>
                        <TableColumn>Unidad</TableColumn>
                        <TableColumn>Cantidad</TableColumn>
                        <TableColumn>Precio</TableColumn>
                        <TableColumn>Mov ID</TableColumn>
                        <TableColumn>Impuesto</TableColumn>
                        <TableColumn>Cliente</TableColumn>
                        <TableColumn>Usuario</TableColumn>
                    </TableHeader>
                    <TableBody items={list.items} isLoading={isLoading}>
                        {(item: any) => (
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