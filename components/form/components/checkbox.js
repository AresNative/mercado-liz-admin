import { useState } from "react";
import { Checkbox } from "@nextui-org/react";

export function CheckBox(props) {
  const { cuestion } = props;
  const [isAtLeastOneChecked, setIsAtLeastOneChecked] = useState(false);

  const handleCheckboxChange = async (option) => {
    setIsAtLeastOneChecked(!isAtLeastOneChecked);
    await props.setValue(cuestion.name, option);
    props.setError(cuestion.name, {});
  };

  return (
    <div className="space-y-2">
      {cuestion.options.length > 1 && <label>{cuestion.placeholder}</label>}
      {cuestion.options.map((option, index) => (
        <Checkbox
          key={index}
          isSelected={isAtLeastOneChecked}
          onChange={() => handleCheckboxChange(option)}
          required={cuestion.require}
          color={props.errors[cuestion.name] ? "error" : "default"}
          helperText={props.errors[cuestion.name]?.message}
        >
          {option}
        </Checkbox>
      ))}
    </div>
  );
}
