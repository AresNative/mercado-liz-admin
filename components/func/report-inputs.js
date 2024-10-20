"use client";

import { Button, Input, Select } from "@nextui-org/react";

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Select
        placeholder="Seleccionar tipo de reporte"
        value={reportType}
        onChange={setReportType}
        options={[
          { label: "Reporte de Ventas", value: "ventas" },
          { label: "Reporte de Inventario", value: "inventario" },
          { label: "Reporte de Clientes", value: "clientes" },
        ]}
      />
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
