import { useEffect } from "react";
import { InputFormProps } from "@/utils/constants/interfaces";

export function InputComponent(props: InputFormProps) {
  const { cuestion } = props;

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

  const Icon = cuestion.icon || null;

  return (
    <div className="space-y-2">
      <div className="flex items-center rounded-md bg-white px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
        {Icon && (
          <div className="shrink-0 pr-2 text-gray-500">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        <input
          type={cuestion.type}
          className="block w-full grow py-1.5 text-base text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm"
          placeholder={cuestion.placeholder}
          value={cuestion.valueDefined || ""}
          onChange={handleInputChange}
          required={cuestion.require}
          {...props.register(cuestion.name, {
            required: cuestion.require ? "The field is required." : undefined,
          })}
        />
      </div>

      {props.errors[cuestion.name]?.message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name]!.message}
        </span>
      )}
    </div>
  );
}
