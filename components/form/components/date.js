import { Input } from "@nextui-org/react";

export function DateInput(props) {
  const { cuestion } = props;

  const toDay = new Date().toISOString().slice(0, 16);

  const handleInputChange = (e) => {
    const selectedDate = e.target.value;
    const selectedDateTime = new Date(selectedDate);

    if (selectedDateTime <= toDay) {
      props.setError(cuestion.name, {
        message: `Value must be ${toDay} or later`,
      });
    } else {
      props.setValue(cuestion.name, selectedDateTime.toISOString());
      props.setError(cuestion.name, {});
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="datetime-local"
        fullWidth
        placeholder={cuestion.placeholder}
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
