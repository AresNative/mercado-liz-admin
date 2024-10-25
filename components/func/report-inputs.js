"use client";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

function ReportInputs({
  filter,
  setFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleFilterTypeChange,
  handleFilterChange,
}) {
  // Estado para manejar el tipo de búsqueda seleccionado
  const [filterType, setFilterType] = useState("codigo");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="flex col-span-2 gap-2">
        <select
          className="w-1/3 p-2 border rounded"
          value={filterType}
          onChange={handleFilterTypeChange}
        >
          <option value="codigo">Código</option>
          <option value="articulo">Artículo</option>
          <option value="proveedor">Proveedor</option>
          <option value="descripcion">Descripcion</option>
        </select>

        <Input
          placeholder={`Buscar por ${
            filterType.charAt(0).toUpperCase() + filterType.slice(1)
          }`}
          onChange={handleFilterChange}
          className="w-full"
          aria-label={filterType} // Añadido para accesibilidad
        />
      </div>

      <Input
        type="date"
        placeholder="Fecha de inicio"
        onChange={(e) => {
          const date = new Date(e.target.value);
          setStartDate(date.toISOString().split("Z")[0]);
        }}
        className="w-full"
      />

      <Input
        type="date"
        placeholder="Fecha de fin"
        onChange={(e) => {
          const date = new Date(e.target.value);
          setEndDate(date.toISOString().split("Z")[0]);
        }}
        className="w-full"
      />
      <Button className="bg-green-400 text-white">EXCEL</Button>
      <Button className="bg-red-400 text-white">PDF</Button>
    </div>
  );
}

export default ReportInputs;
