import { DateRangePicker } from "@nextui-org/react";
import { Controller } from "react-hook-form";

export function DateRangeInput(props) {
  const { cuestion } = props;

  const toDay = new Date().toISOString().slice(0, 16);

  const handleDateChange = (date) => {
    if (!date) {
      props.setValue(cuestion.name, selectedDateTime.toISOString());
      props.setError(cuestion.name, {});
      return
    }
    const selectedDateTime = new Date(date);

    if (selectedDateTime <= new Date(toDay)) {
      props.setError(cuestion.name, {
        message: `Value must be ${toDay} or later`,
      });
    } 
  };

  return (
    <div className="space-y-2">
      <Controller
        name={cuestion.name}
        control={props.control}
        render={({ field }) => (
          <DateRangePicker
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