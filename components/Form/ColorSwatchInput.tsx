import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FaCheck } from "react-icons/fa";
import { ColorPreset } from "@/stores/colors";

/* ColorSwatchInput Component
   A row of preset colour swatches plus a custom colour picker */
interface ColorSwatchInputProps<T> {
  name: keyof T;
  control: Control<T extends FieldValues ? T : FieldValues>;
  label: string;
  presets: ColorPreset[];
}

const swatchClassName =
  "relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-sm ring-offset-1 transition-transform hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100";

export const ColorSwatchInput = <T,>({
  name,
  control,
  label,
  presets,
}: ColorSwatchInputProps<T>) => {
  return (
    <Controller
      name={name as unknown as Path<T extends FieldValues ? T : FieldValues>}
      control={control}
      render={({ field: { onChange, value } }) => {
        const isCustom = !presets.some((preset) => preset.value === value);
        return (
          <fieldset className="mb-3">
            <legend className="mb-1 h-7 text-2xl text-gray-900">{label}</legend>
            <div className="flex flex-wrap items-center gap-2">
              {presets.map((preset) => (
                <label key={preset.value} title={preset.name}>
                  <input
                    type="radio"
                    name={name as string}
                    value={preset.value}
                    checked={value === preset.value}
                    onChange={() => onChange(preset.value)}
                    className="peer sr-only"
                  />
                  <span
                    className={
                      swatchClassName +
                      " peer-checked:ring-2 peer-checked:ring-gray-700 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500"
                    }
                    style={{ backgroundColor: preset.value }}
                  >
                    {value === preset.value && (
                      <FaCheck size={12} className="text-white drop-shadow" />
                    )}
                  </span>
                  <span className="sr-only">{preset.name}</span>
                </label>
              ))}
              {/* Custom colour: shows a rainbow until a custom colour is picked */}
              <label
                title="Custom colour"
                className={
                  swatchClassName +
                  " focus-within:ring-2 focus-within:ring-blue-500" +
                  (isCustom ? " ring-2 ring-gray-700" : "")
                }
                style={{
                  background: isCustom
                    ? value
                    : "conic-gradient(#e57373, #ffd54f, #81c784, #64b5f6, #ba68c8, #e57373)",
                }}
              >
                <input
                  type="color"
                  value={value ?? "#000000"}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <span className="sr-only">Custom {label.toLowerCase()}</span>
                {isCustom && (
                  <FaCheck size={12} className="text-white drop-shadow" />
                )}
              </label>
            </div>
          </fieldset>
        );
      }}
    />
  );
};
