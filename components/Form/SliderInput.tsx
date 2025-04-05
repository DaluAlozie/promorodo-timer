import { Control, Controller, FieldValues, Path } from "react-hook-form";

/* SliderInput Component
   Wraps a checkbox with a Controller internally */
interface SliderInputProps<T> {
  name: keyof T;
  control: Control<T extends FieldValues ? T : FieldValues>;
  id: string;
  label: string;
  onPress: () => void;
}

export const SliderInput = <T,>({
  name,
  control,
  id,
  label,
}: SliderInputProps<T>) => {
  return (
    <Controller
      name={name as unknown as Path<T extends FieldValues ? T : FieldValues>}
      control={control}
      render={({ field: { onChange, value, ref, ...restField } }) => (
        <div className="mb-5 flex w-full flex-col items-start">
          {/* Label for the slider */}
          <label className="mb-2 block text-2xl text-gray-900">
            {label}: {value}%
          </label>
          {/* Slider input */}
          <input
            id={id}
            {...restField}
            onChange={onChange}
            ref={ref}
            type="range"
            value={value}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-400"
          />
        </div>
      )}
    />
  );
};
