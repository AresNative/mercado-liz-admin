"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";

function ReportInputs({
  reportType,
  setReportType,
  filter,
  setFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleGenerateReport,
}) {
  const filters = [
    { label: "Reporte de Ventas", value: "ventas" },
    { label: "Reporte de Inventario", value: "inventario" },
    { label: "Reporte de Clientes", value: "clientes" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Select
        label="Select an filter"
        value={reportType}
        onChange={setReportType}
        className="max-w-xs"
      >
        {filters.map((animal) => (
          <SelectItem key={animal.value}>{animal.label}</SelectItem>
        ))}
      </Select>
      <Input
        placeholder="Ej: Categoría, Región, etc."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full"
      />
      <Input
        type="date"
        placeholder="Fecha de inicio"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full"
      />
      <Input
        type="date"
        placeholder="Fecha de fin"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full"
      />
      <Button
        onClick={handleGenerateReport}
        auto
        className="bg-black text-white col-span-2"
      >
        Generar Reporte
      </Button>
    </div>
  );
}

export default ReportInputs;
