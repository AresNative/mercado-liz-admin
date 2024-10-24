import { Input } from "@nextui-org/react";

export function Email(props) {
  const { cuestion } = props;

  const handleInputChange = (e) => {
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, e.target.value);
  };

  return (
    <div className="space-y-2">
      <Input
        type="email"
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
