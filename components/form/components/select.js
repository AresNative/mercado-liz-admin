import { useState, useEffect } from "react";
import { Select } from "@nextui-org/react";

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
        options={cuestion.options}
        value={selected}
        onChange={handleSelectChange}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
        })}
        helperText={props.errors[cuestion.name]?.message}
        color={props.errors[cuestion.name] ? "error" : "default"}
      />
    </div>
  );
}
