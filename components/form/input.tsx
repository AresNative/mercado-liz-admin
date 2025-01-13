import { useEffect } from "react";
import { InputFormProps } from "@/utils/constants/interfaces";
import { User } from "lucide-react";

export function InputComponent(props: InputFormProps) {
  const { cuestion } = props;

  // Obtén el valor actual del input desde react-hook-form usando `watch`
  const currentValue = props.watch(cuestion.name) || "";

  useEffect(() => {
    if (cuestion.valueDefined) {
      props.setValue(cuestion.name, cuestion.valueDefined);
    }
  }, [cuestion.valueDefined, cuestion.name, props]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, value);
  };

  return (
    <div className="flex flex-col">
      <label className="leading-loose flex items-center gap-2">
        <User className="w-4 h-4" />
        {cuestion.label}
      </label>
      <div className="relative">
        <input
          type="text"
          name={cuestion.name}
          onChange={handleInputChange}
          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          placeholder={cuestion.placeholder}
          maxLength={cuestion.maxLength}
          {...props.register(cuestion.name,
            cuestion.require
              ? { required: "El campo es obligatorio." }
              : {}
          )}
        />
        {cuestion.maxLength && (<span className="absolute right-2 top-2 text-xs text-gray-400">
          {currentValue.length}/{cuestion.maxLength}
        </span>)}
      </div>
      {props.errors[cuestion.name] && props.errors[cuestion.name]?.message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name]?.message}
        </span>
      )}
    </div>
  );
}
