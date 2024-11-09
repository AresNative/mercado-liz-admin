import { useState, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";

export function SearchableSelect(props) {
  const { cuestion, setValue } = props;
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (cuestion.valueDefined) {
      setSelected(cuestion.valueDefined.name);
    }
  }, [cuestion.valueDefined]);

  const handleSelectChange = (value) => {
    setSelected(value);
    setValue(cuestion.name, value);
  };

  return (
    <div className="space-y-2">
      <Select
        placeholder={cuestion.placeholder}
        items={cuestion.options}
        selectedKey={selected}
        onSelectionChange={(key) => handleSelectChange(key)}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
        })}
        errorMessage={props.errors[cuestion.name]?.message}
      >
        {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
      </Select>
      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name].message}
        </span>
      )}
    </div>
  );
}
