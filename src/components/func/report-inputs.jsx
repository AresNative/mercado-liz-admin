import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FileChartColumn, FileText } from "lucide-react";
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
          placeholder={`Buscar por ${
            filterType.charAt(0).toUpperCase() + filterType.slice(1)
          }`}
          onChange={handleFilterChange}
          className="w-full"
          aria-label={filterType}
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
        <Button color="success"><FileChartColumn /> Exel</Button>
        <Button color="danger"><FileText /> PDF</Button>
    </div>
  );
}

export default ReportInputs;