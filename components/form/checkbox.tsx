import { ChecboxFormProps } from "@/utils/constants/interfaces";
import { useState } from "react";

export function CheckBox(props: ChecboxFormProps) {
  const { cuestion } = props;
  const [isAtLeastOneChecked, setIsAtLeastOneChecked] = useState(false);

  const handleCheckboxChange = async () => {
    const newValue = !isAtLeastOneChecked;
    setIsAtLeastOneChecked(newValue);
    await props.setValue(cuestion.name, newValue);
    props.register(cuestion.name, {
      required: cuestion.require ? "The field is required." : undefined,
    });
    props.setError(cuestion.name, {});
  };

  return (
    <div className="space-y-2">
      {cuestion.options.length > 1 && (
        <label className="block text-gray-700 dark:text-gray-300">
          {cuestion.placeholder}
        </label>
      )}
      {cuestion.options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            checked={isAtLeastOneChecked}
            onChange={handleCheckboxChange}
            required={cuestion.require}
          />
          <label className="text-gray-700 dark:text-gray-300">
            {option}
          </label>
        </div>
      ))}

      {props.errors[cuestion.name]?.message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name]!.message}
        </span>
      )}
    </div>
  );
}
