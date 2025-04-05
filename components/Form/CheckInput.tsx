import { Control, Controller, FieldValues, Path } from "react-hook-form";

/* CheckboxInput Component
   Wraps a checkboxInput with a Controller internally */
interface CheckboxInputProps<T> {
  name: keyof T;
  control: Control<T extends FieldValues ? T : FieldValues>;
  id: string;
  label: string;
  onPress: () => void;
}

export const CheckboxInput = <T,>({
  name,
  control,
  id,
  label,
  onPress,
}: CheckboxInputProps<T>) => {
  return (
    <Controller
      name={name as unknown as Path<T extends FieldValues ? T : FieldValues>}
      control={control}
      render={({ field: { onChange, onBlur, value, ref, ...restField } }) => (
        <div className="mb-5 flex items-start">
          <div className="flex h-5 items-center">
            {/* Checkbox input */}
            <input
              id={id}
              type="checkbox"
              onChange={(e) => {
                onChange(e.target.checked);
                onPress();
              }}
              onBlur={onBlur}
              checked={!!value}
              ref={ref}
              {...restField}
              className="h-4 w-4 rounded-sm border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          {/* Label for the checkbox */}
          <label htmlFor={id} className="ms-2 text-2xl text-gray-900">
            <div className="flex h-6 items-center overflow-hidden">{label}</div>
          </label>
        </div>
      )}
    />
  );
};
