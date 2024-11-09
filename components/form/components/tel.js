import { Input } from "@nextui-org/react";

export function Tel(props) {
  const { cuestion } = props;

  const handleInputChange = (event) => {
    event.target.value = event.target.value.replace(/\D/, "");
    props.setError(cuestion.name, {});
  };

  return (
    <div className="space-y-2">
      <Input
        type="tel"
        fullWidth
        placeholder={cuestion.placeholder}
        value={cuestion.valueDefined}
        required={cuestion.require}
        onInput={handleInputChange}
        {...props.register(cuestion.name, {
          required: cuestion.require && "The field is required.",
          pattern: {
            value: /^[0-9]*$/,
            message: "Only numeric values are allowed.",
          },
        })}
      />
    </div>
  );
}
