"use client";

import { Button, Input } from "@nextui-org/react";

function ReportInputs({
  filter,
  setFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Input
        placeholder="Ej: Categoría, Región, etc."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full col-span-2"
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
      <Button className="bg-green-400 text-white">EXCEL</Button>

      <Button className="bg-red-400 text-white">PDF</Button>
    </div>
  );
}

export default ReportInputs;
