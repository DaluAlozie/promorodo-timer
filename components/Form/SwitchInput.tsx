import { Control, Controller, FieldValues, Path } from "react-hook-form";

/* SwitchInput Component
   Wraps a checkbox with a Controller internally */
interface SwitchInputProps<T>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: keyof T;
  control: Control<T extends FieldValues ? T : FieldValues>;
  id: string;
  label: string;
  onPress: () => void;
}

export const SwitchInput = <T,>({
  name,
  control,
  id,
  label,
  onPress,
  ...props
}: SwitchInputProps<T>) => {
  return (
    <Controller
      name={name as unknown as Path<T extends FieldValues ? T : FieldValues>}
      control={control}
      render={({ field: { onChange, value, ref, ...restField } }) => (
        <div className="mb-5 flex items-start">
          {/* Label for the switch */}
          <label className="inline-flex cursor-pointer items-center">
            {/* Switch input */}
            <input
              id={id}
              {...restField}
              ref={ref}
              checked={!!value}
              onChange={(e) => {
                onChange(e.target.checked);
                onPress();
              }}
              onClick={props.onClick}
              type="checkbox"
              value=""
              className="peer sr-only"
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600"></div>
            <span className="ms-3 h-7 text-2xl text-gray-900">{label}</span>
          </label>
        </div>
      )}
    />
  );
};
