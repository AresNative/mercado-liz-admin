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

   const animals = [
  {label: "Cat", key: "cat", description: "The second most popular pet in the world"},
  {label: "Dog", key: "dog", description: "The most popular pet in the world"},
  {label: "Elephant", key: "elephant", description: "The largest land animal"},
  {label: "Lion", key: "lion", description: "The king of the jungle"},
  {label: "Tiger", key: "tiger", description: "The largest cat species"},
  {label: "Giraffe", key: "giraffe", description: "The tallest land animal"},
  {
    label: "Dolphin",
    key: "dolphin",
    description: "A widely distributed and diverse group of aquatic mammals",
  },
  {label: "Penguin", key: "penguin", description: "A group of aquatic flightless birds"},
  {label: "Zebra", key: "zebra", description: "A several species of African equids"},
  {
    label: "Shark",
    key: "shark",
    description: "A group of elasmobranch fish characterized by a cartilaginous skeleton",
  },
  {
    label: "Whale",
    key: "whale",
    description: "Diverse group of fully aquatic placental marine mammals",
  },
  {label: "Otter", key: "otter", description: "A carnivorous mammal in the subfamily Lutrinae"},
  {label: "Crocodile", key: "crocodile", description: "A large semiaquatic reptile"},
];
  
  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex col-span-2 gap-2">
        <Select
          placeholder="Selecciona un tipo de filtro"
          selectionMode="single"
          onSelectionChange={handleFilterTypeChange}
          items={[
            { value: "codigo", label: "Código" },
            { value: "articulo", label: "Artículo" },
            { value: "proveedor", label: "Proveedor" },
            { value: "descripcion1", label: "Descripción" },
          ]}
        >
          {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
        </Select>
        <Autocomplete
          placeholder={`Buscar por ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
          /* onChange={handleFilterChange} */
          className="w-full"
          aria-label={filterType}
        >{animals.map((animal) => <AutocompleteItem key={animal.key}>{animal.label}</AutocompleteItem>)}
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