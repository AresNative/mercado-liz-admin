import { Input } from "@nextui-org/react";

export function MonthInput(props) {
  const { cuestion } = props;
  const toDay = new Date().toISOString().slice(0, 7);

  const handleInputChange = (e) => {
    const selectedDate = e.target.value;
    props.setValue(cuestion.name, selectedDate);
    props.setError(cuestion.name, {});
  };

  return (
    <div className="space-y-2">
      <Input
        type="month"
        fullWidth
        max={toDay}
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