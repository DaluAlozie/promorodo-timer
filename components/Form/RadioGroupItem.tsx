import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface RadioOptionProps<T> {
  name: keyof T;
  control: Control<T extends FieldValues ? T : FieldValues>;
  id: string;
  label: string;
  value: string;
  containerClassName?: string;
}

const RadioOption = <T,>({
  name,
  control,
  id,
  label,
  value,
}: RadioOptionProps<T>) => {
  return (
    <Controller
      name={name as unknown as Path<T extends FieldValues ? T : FieldValues>}
      control={control}
      render={({ field, fieldState }) => (
        <div
          className={
            "mb-2 flex w-full flex-row items-center justify-start sm:w-1/2"
          }
          id={id}
        >
          <input
            id={id}
            type="radio"
            name={name as string}
            value={value}
            onChange={() => field.onChange(value)}
            checked={field.value === value}
            className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700"
          />
          {/* Label for the radio button */}
          <label htmlFor={id} className="ml-2 h-7 text-2xl text-gray-900">
            {label}
          </label>
          {fieldState.error && (
            <p className="text-xs text-red-500 italic">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default RadioOption;
