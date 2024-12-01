import { DatePicker } from "@nextui-org/react";
import { Controller } from "react-hook-form";

export function DateInput(props) {
  const { cuestion } = props;

  const toDay = new Date().toISOString().slice(0, 16);

  const handleDateChange = (date) => {
    if (date) {
      const selectedDateTime = new Date(date);

      if (selectedDateTime <= new Date(toDay)) {
        props.setError(cuestion.name, {
          message: `Value must be ${toDay} or later`,
        });
      } else {
        props.setValue(cuestion.name, selectedDateTime.toISOString());
        props.setError(cuestion.name, {});
      }
    }
  };

  return (
    <div className="space-y-2">
      <Controller
        name={cuestion.name}
        control={props.control}
        render={({ field }) => (
          <DatePicker
            selected={field.value ? new Date(field.value) : null}
            onChange={(date) => {
              field.onChange(date);
              handleDateChange(date);
            }}
            placeholder={cuestion.placeholder}
            required={cuestion.require}
            isClearable
          />
        )}
        rules={{
          required: cuestion.require && "The field is required.",
        }}
      />

      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name].message}
        </span>
      )}
    </div>
  );
}
