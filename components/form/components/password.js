import { useState } from "react";
import { Input } from "@nextui-org/react";

export function Password(props) {
  const { cuestion } = props;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, e.target.value);
  };

  return (
    <div className="space-y-2">
      <Input
        type={showPassword ? "text" : "password"}
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
        clearable
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="text-sm text-blue-500"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
}
