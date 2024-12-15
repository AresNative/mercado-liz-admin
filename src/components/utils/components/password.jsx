import { useState } from "react";
import { Input, Tooltip } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";

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
        endContent={
          <Tooltip className="capitalize" color="secondary" content={`${showPassword ? 'ocultar' : 'ver'} ${cuestion.placeholder}`}>
            
            <button
              className="focus:outline-none"
              type="button"
              onClick={togglePasswordVisibility}
              aria-label="toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <Eye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
            </Tooltip>
          }
        clearable
      />
    </div>
  );
}
