import { useState } from "react";
import { Radio } from "@nextui-org/react";

export function RadioComponent(props) {
  const { cuestion } = props;
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    props.setValue(cuestion.name, value);
  };

  return (
    <div className="space-y-2">
      <span>{cuestion.placeholder}</span>
      <Radio.Group
        value={selectedOption}
        onChange={handleOptionChange}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
        })}
        color={props.errors[cuestion.name] ? "error" : "default"}
      >
        {cuestion.options.map((option, index) => (
          <Radio key={index} value={option}>
            {option}
          </Radio>
        ))}
      </Radio.Group>
      {props.errors[cuestion.name] && (
        <span className="text-red-500 text-sm">
          {props.errors[cuestion.name].message}
        </span>
      )}
    </div>
  );
}
