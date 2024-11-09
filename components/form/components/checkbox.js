import { useState } from "react";
import { Checkbox } from "@nextui-org/react";

export function CheckBox(props) {
  const { cuestion } = props;
  const [isAtLeastOneChecked, setIsAtLeastOneChecked] = useState(false);

  const handleCheckboxChange = async () => {
    const newValue = !isAtLeastOneChecked;
    setIsAtLeastOneChecked(newValue);
    await props.setValue(cuestion.name, newValue); // Pasa true o false directamente
    props.register(cuestion.name, {
      required: cuestion.require && "The field is required.",
    });
    props.setError(cuestion.name, {}); // Limpia errores si los hay
  };

  return (
    <div className="space-y-2">
      {cuestion.options.length > 1 && <label>{cuestion.placeholder}</label>}
      {cuestion.options.map((option, index) => (
        <Checkbox
          className="w-full"
          key={index}
          isSelected={isAtLeastOneChecked}
          onChange={handleCheckboxChange}
          required={cuestion.require}
        >
          {option}
        </Checkbox>
      ))}

      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name].message}
        </span>
      )}
    </div>
  );
}
