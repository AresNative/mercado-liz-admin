import { Controller } from "react-hook-form";
import { useState } from "react";
import { DateRangeInputProps } from "@/utils/constants/interfaces";

export function DateRangeInput(props: DateRangeInputProps) {
  const { cuestion } = props;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const toDay = new Date().toISOString().slice(0, 16);

  const handleDateChange = (date: string | null) => {
    if (!date) {
      props.setValue(cuestion.name, "");
      props.setError(cuestion.name, {});
      return;
    }

    const selectedDateTime = new Date(date);

    if (selectedDateTime <= new Date(toDay)) {
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
      <Controller
        name={cuestion.name}
        control={props.control}
        render={({ field }) => (
          <div className="flex flex-col space-y-2">
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={selectedDate || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDate(value);
                field.onChange(value);
                handleDateChange(value);
              }}
              placeholder={cuestion.placeholder}
              required={cuestion.require}
            />
          </div>
        )}
        rules={{
          required: cuestion.require && "The field is required.",
        }}
      />

      {props.errors[cuestion.name]?.message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name]!.message}
        </span>
      )}
    </div>
  );
}
