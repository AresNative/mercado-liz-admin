import { useEffect } from "react";
import { Input } from "@nextui-org/react";

export function Number(props) {
  const { cuestion } = props;

  useEffect(() => {
    if (cuestion.valueDefined) {
      props.setValue(cuestion.name, cuestion.valueDefined);
    }
  }, [cuestion.valueDefined]);

  const handleInputChange = (event) => {
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, event.target.value);
  };

  return (
    <div className="space-y-2">
      <Input
        type="number"
        fullWidth
        step="any"
        placeholder={cuestion.placeholder}
        required={cuestion.require}
        onChange={handleInputChange}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
        })}
      />
      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name].message}
        </span>
      )}
    </div>
  );
}
