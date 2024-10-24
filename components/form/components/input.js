import { useEffect } from "react";
import { Input } from "@nextui-org/react";

export function InputComponent(props) {
  const { cuestion } = props;

  useEffect(() => {
    if (cuestion.valueDefined) {
      props.setValue(cuestion.name, cuestion.valueDefined);
    }
  }, [cuestion.valueDefined]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, value);
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        fullWidth
        placeholder={cuestion.placeholder}
        value={cuestion.valueDefined}
        required={cuestion.require}
        onChange={handleInputChange}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
        })}
        helperText={props.errors[cuestion.name]?.message}
        color={props.errors[cuestion.name] ? "error" : "default"}
      />
    </div>
  );
}
