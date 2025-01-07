import { RadioComponentProps } from "@/utils/constants/interfaces";
import { useState } from "react";


export function RadioComponent(props: RadioComponentProps) {
  const { cuestion } = props;
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    props.setValue(cuestion.name, value);
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700">{cuestion.placeholder}</span>
      <div className="flex flex-col space-y-2">
        {cuestion.options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              name={cuestion.name}
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              {...props.register(cuestion.name, {
                required: cuestion.require && "The field is required.",
              })}
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
      {props.errors[cuestion.name]?.message && (
        <span className="text-red-500 text-sm">{props.errors[cuestion.name]!.message}</span>
      )}
    </div>
  );
}
