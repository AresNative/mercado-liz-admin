import { DatePicker, Input, Select, SelectItem } from "@nextui-org/react";
function ReportInputs({
  filterType,
  setStartDate,
  setEndDate,
  handleFilterTypeChange,
  handleFilterChange,
}) {
  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex col-span-2 gap-2">
        <Select
          placeholder="Selecciona un tipo de filtro"
          selectionMode="multiple"
          onSelectionChange={handleFilterTypeChange}
          items={[
            { value: "codigo", label: "Código" },
            { value: "articulo", label: "Artículo" },
            { value: "proveedor", label: "Proveedor" },
            { value: "descripcion", label: "Descripción" },
          ]}
        >
          {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
        </Select>
        <Input
          placeholder={`Buscar por ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
          onChange={handleFilterChange}
          className="w-full"
          aria-label={filterType}
        />
      </div>

      <DatePicker
        placeholder="Fecha de inicio"
        onChange={setStartDate}
        className="w-full"
      />

      <DatePicker
        placeholder="Fecha de fin"
        onChange={setEndDate}
        className="w-full"
      />
    </div>
  );
}

export default ReportInputs;