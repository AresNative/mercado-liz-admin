import { Autocomplete, AutocompleteItem, DatePicker, Select, SelectItem } from "@nextui-org/react";
function ReportInputs({
  filterType,
  setStartDate,
  setEndDate,
  keys,
  handleFilterTypeChange,
  handleFilterChange,
  Options
}) {
  const animals = Options ? Options.data.map((rows) => ({label: rows, key:rows, description:rows})) : []
   console.log(Options);
   
  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex col-span-2 gap-2">
        <Select
          placeholder="Selecciona un tipo de filtro"
          selectionMode="single"
          onSelectionChange={handleFilterTypeChange}
          defaultSelectedKeys={["Descripcion1"]}
          items={[
            { value: "Codigo", label: "Código" },
            { value: "Articulo", label: "Artículo" },
            { value: "Proveedor", label: "Proveedor" },
            { value: "Descripcion1", label: "Descripción" },
          ]}
        >
          {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
        </Select>
        <Autocomplete
          placeholder={`Buscar por ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
          onInputChange={handleFilterChange}
          className="w-full"
          aria-label={filterType}
        >{animals.length && animals.map((animal) => <AutocompleteItem key={animal.key}>{animal.label}</AutocompleteItem>)}
        </Autocomplete>
      </div>

      {["get-compras", "get-ventas"].includes(keys) && (
        <>
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
        </>
      )}

    </div>
  );
}

export default ReportInputs;