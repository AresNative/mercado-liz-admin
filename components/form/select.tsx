import { SearchableSelectProps } from "@/utils/constants/interfaces";
import { useState, useEffect } from "react";

export function SearchableSelect(props: SearchableSelectProps) {
  const { cuestion, setValue } = props;
  const [selected, setSelected] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState(cuestion.options);

  useEffect(() => {
    if (cuestion.valueDefined) {
      setSelected(cuestion.valueDefined.name);
    }
  }, [cuestion.valueDefined]);

  useEffect(() => {
    if (cuestion.enableAutocomplete) {
      setFilteredOptions(
        cuestion.options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, cuestion.options, cuestion.enableAutocomplete]);

  const handleSelectChange = (value: string) => {
    setSelected(value);
    setValue(cuestion.name, value);
  };

  return (
    <div className="space-y-2">
      {cuestion.enableAutocomplete && (
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 p-2 text-sm"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      <select
        className="w-full rounded-md border border-gray-300 p-2 text-sm"
        value={selected}
        onChange={(e) => handleSelectChange(e.target.value)}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
        })}
      >
        <option value="" disabled>
          {cuestion.placeholder || "Select an option"}
        </option>
        {filteredOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {props.errors[cuestion.name]?.message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name]?.message}
        </span>
      )}
    </div>
  );
}
