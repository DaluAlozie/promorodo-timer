import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface InputProps<T> {
  name: keyof T;
  control: Control<T extends FieldValues ? T : FieldValues>;
  id: string;
  label: string;
  type: "text" | "number";
  placeholder?: string;
  containerClassName?: string;
  disabled?: boolean;
}

const Input = <T,>({
  name,
  control,
  id,
  label,
  type,
  placeholder,
  containerClassName = "mb-5",
  disabled = false,
}: InputProps<T>) => {
  return (
    <Controller
      name={name as unknown as Path<T extends FieldValues ? T : FieldValues>}
      control={control}
      render={({ field, fieldState }) => (
        <div className={containerClassName}>
          {/* Label for the input */}
          <label
            htmlFor={id}
            className="mb-2 block h-5 text-2xl text-gray-900 opacity-65"
          >
            {label}
          </label>
          {/* Input field */}
          <input
            id={id}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            {...field}
            value={
              typeof field.value === "boolean"
                ? String(field.value)
                : field.value
            }
            className="relative block h-12 w-full rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-2xl text-gray-900 focus:border-0 focus:ring-2 focus:ring-[rgba(72,147,217,0.7)] focus:outline-none"
            style={{ zIndex: 1000000 }}
          />
          {fieldState.error && (
            <p className="mt-2 text-xl leading-4 text-red-500 italic">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default Input;
