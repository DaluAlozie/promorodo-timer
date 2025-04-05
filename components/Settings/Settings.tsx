"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import Input from "../Form/Input";
import { CheckboxInput } from "../Form/CheckInput";
import RadioOption from "../Form/RadioGroupItem";
import { SwitchInput } from "../Form/SwitchInput";
import { useCollapse } from "react-collapsed";
import { SliderInput } from "../Form/SliderInput";
import { audioLabelMap, BackgrounAudio } from "@/stores/audio";
import { NOISE, WATER, FIRE, RAIN, CHATTER, NATURE } from "@/stores/audio";
import { useGeneralStore } from "@/stores/GerneralStore";

interface FormValues {
  studyTime: number;
  breakTime: number;
  midBreakTime: number;
  midBreakInterval: number;
  longBreakTime: number;
  longBreakInterval: number;
  autoStartBreak: boolean;
  autoStartStudy: boolean;
  backgroundAudio: BackgrounAudio;
  backgrounAudioEnabled: boolean;
  volume: number;
  pauseAudioOnBreak: boolean;
}

const schema = yup.object().shape({
  studyTime: yup
    .number()
    .typeError("Study time must be a number")
    .required("Study time is required")
    .positive("Must be positive")
    .integer("Must be an integer"),
  breakTime: yup
    .number()
    .typeError("Break time must be a number")
    .required("Break time is required")
    .positive("Must be positive")
    .integer("Must be an integer"),
  midBreakTime: yup
    .number()
    .typeError("Short break time must be a number")
    .required("Short break time is required")
    .positive("Must be positive")
    .integer("Must be an integer"),
  midBreakInterval: yup
    .number()
    .typeError("Short break interval must be a number")
    .required("Short break interval is required")
    .positive("Must be positive")
    .integer("Must be an integer"),
  longBreakTime: yup
    .number()
    .typeError("Long break time must be a number")
    .required("Long break time is required")
    .positive("Must be positive")
    .integer("Must be an integer"),
  longBreakInterval: yup
    .number()
    .typeError("Long break interval must be a number")
    .required("Long break interval is required")
    .positive("Must be positive")
    .integer("Must be an integer"),
  backgroundAudio: yup
    .mixed<BackgrounAudio>()
    .oneOf(Object.values(BackgrounAudio), "Invalid background audio option")
    .required("Background audio is required"),
  backgrounAudioEnabled: yup.boolean().required(),
  autoStartBreak: yup.boolean().required(),
  autoStartStudy: yup.boolean().required(),
  volume: yup
    .number()
    .typeError("Volume must be a number")
    .required("Volume is required")
    .min(0, "Volume must be at least 0")
    .max(100, "Volume must be at most 100"),
  pauseAudioOnBreak: yup.boolean().required(),
});

export default function Settings({ close }: { close: () => void }) {
  const {
    studyTime,
    setStudyTime,
    breakTime,
    setBreakTime,
    midBreakTime,
    setMidBreakTime,
    longBreakTime,
    setLongBreakTime,
    autoStartBreak,
    setAutoStartBreak,
    autoStartStudy,
    setAutoStartStudy,
    midBreakInterval,
    setMidBreakInterval,
    longBreakInterval,
    setLongBreakInterval,
    backgroundAudio,
    setBackgroundAudio,
    audioVolume,
    setAudioVolume,
    pauseAudioOnBreak,
    setPauseAudioOnBreak,
  } = useGeneralStore();

  const [checksChanged, setChecksChanged] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isDirty, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      studyTime,
      breakTime,
      midBreakTime,
      midBreakInterval,
      longBreakTime,
      longBreakInterval,
      autoStartBreak,
      autoStartStudy,
      backgroundAudio,
      backgrounAudioEnabled: backgroundAudio !== BackgrounAudio.NONE,
      volume: audioVolume,
      pauseAudioOnBreak,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const backgroundAudioEnabled = watch("backgrounAudioEnabled");

  // Set the default values for the form fields when the component mounts
  // and when the settiings are initrialized
  useEffect(() => {
    setValue("studyTime", studyTime);
    setValue("breakTime", breakTime);
    setValue("midBreakTime", midBreakTime);
    setValue("midBreakInterval", midBreakInterval);
    setValue("longBreakTime", longBreakTime);
    setValue("longBreakInterval", longBreakInterval);
    setValue("autoStartBreak", autoStartBreak);
    setValue("autoStartStudy", autoStartStudy);
    setValue("backgroundAudio", backgroundAudio);
    setValue("backgrounAudioEnabled", backgroundAudio !== BackgrounAudio.NONE);
    setValue("volume", audioVolume);
    setValue("pauseAudioOnBreak", pauseAudioOnBreak);
  }, [
    studyTime,
    breakTime,
    midBreakTime,
    midBreakInterval,
    longBreakTime,
    longBreakInterval,
    autoStartBreak,
    autoStartStudy,
    backgroundAudio,
    audioVolume,
    pauseAudioOnBreak,
    setValue,
  ]);

  const onSubmit = useCallback(
    (data: FormValues) => {
      if (studyTime !== data.studyTime) setStudyTime(data.studyTime);
      if (breakTime !== data.breakTime) setBreakTime(data.breakTime);
      if (midBreakTime !== data.midBreakTime)
        setMidBreakTime(data.midBreakTime);
      if (midBreakInterval !== data.midBreakInterval)
        setMidBreakInterval(data.midBreakInterval);
      if (longBreakTime !== data.longBreakTime)
        setLongBreakTime(data.longBreakTime);
      if (longBreakInterval !== data.longBreakInterval)
        setLongBreakInterval(data.longBreakInterval);
      if (autoStartBreak !== data.autoStartBreak)
        setAutoStartBreak(data.autoStartBreak);
      if (autoStartStudy !== data.autoStartStudy)
        setAutoStartStudy(data.autoStartStudy);
      if (backgroundAudio !== data.backgroundAudio)
        setBackgroundAudio(data.backgroundAudio);
      if (audioVolume !== data.volume) setAudioVolume(data.volume);
      if (pauseAudioOnBreak !== data.pauseAudioOnBreak)
        setPauseAudioOnBreak(data.pauseAudioOnBreak);

      toast.success("Settings saved successfully!");
      setChecksChanged(false);
      reset(data);
      close();
    },
    [
      studyTime,
      breakTime,
      midBreakTime,
      longBreakTime,
      midBreakInterval,
      longBreakInterval,
      autoStartBreak,
      autoStartStudy,
      backgroundAudio,
      audioVolume,
      pauseAudioOnBreak,
      setStudyTime,
      setBreakTime,
      setMidBreakTime,
      setMidBreakInterval,
      setLongBreakTime,
      setLongBreakInterval,
      setAutoStartBreak,
      setAutoStartStudy,
      setBackgroundAudio,
      setAudioVolume,
      setPauseAudioOnBreak,
      reset,
      close,
    ],
  );

  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: backgroundAudioEnabled,
  });

  const resetSettings = useCallback(() => {
    const defaults: FormValues = {
      studyTime: 25,
      breakTime: 5,
      midBreakTime: 30,
      midBreakInterval: 8,
      longBreakTime: 45,
      longBreakInterval: 16,
      autoStartBreak: true,
      autoStartStudy: true,
      backgroundAudio: BackgrounAudio.NONE,
      backgrounAudioEnabled: false,
      volume: 50,
      pauseAudioOnBreak: false,
    };
    setStudyTime(defaults.studyTime);
    setBreakTime(defaults.breakTime);
    setMidBreakTime(defaults.midBreakTime);
    setLongBreakTime(defaults.longBreakTime);
    setAutoStartBreak(defaults.autoStartBreak);
    setAutoStartStudy(defaults.autoStartStudy);
    setMidBreakInterval(defaults.midBreakInterval);
    setLongBreakInterval(defaults.longBreakInterval);
    setBackgroundAudio(defaults.backgroundAudio);
    setAudioVolume(defaults.volume);
    setPauseAudioOnBreak(defaults.pauseAudioOnBreak);
    setValue("backgrounAudioEnabled", defaults.backgrounAudioEnabled);
    setChecksChanged(false);
    reset(defaults);
    toast.success("Settings reset to default values!");
  }, [
    setStudyTime,
    setBreakTime,
    setMidBreakTime,
    setLongBreakTime,
    setAutoStartBreak,
    setAutoStartStudy,
    setMidBreakInterval,
    setLongBreakInterval,
    setBackgroundAudio,
    setAudioVolume,
    setPauseAudioOnBreak,
    setValue,
    reset,
  ]);

  // Reset the background audio to NONE if the background audio is disabled
  // and set it to CALMING_RAIN as the default if the background audio is enabled
  useEffect(() => {
    if (backgroundAudioEnabled) {
      if (backgroundAudio === BackgrounAudio.NONE) {
        setValue("backgroundAudio", BackgrounAudio.CALMING_RAIN);
      }
    } else {
      setValue("backgroundAudio", BackgrounAudio.NONE);
    }
  }, [backgroundAudioEnabled, setValue, backgroundAudio]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full px-12 pt-11"
    >
      <div
        className="absolute top-8 left-2 flex w-full flex-col items-center justify-center"
        style={{ zIndex: 0 }}
      >
        {/* Dotted border around cycle inputs */}
        <div className="w-11/12">
          <span className="mb-2 ml-2 text-2xl text-gray-900 opacity-35">
            Cycle
          </span>
          <div className="flex w-29/30 rounded-2xl border-2 border-dashed border-gray-300 sm:w-19/20">
            <div className="opacity-0">
              {/* Dummy Input so dotted border is the correct size */}
              <Input
                name="studyTime"
                control={control}
                id="dummy"
                label="dummy"
                type="number"
                placeholder="dummy"
                disabled={true}
              />
              <Input
                name="breakTime"
                control={control}
                id="breakTimedummy"
                label="dummy"
                type="number"
                placeholder="dummy"
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Cycle */}
      <Input
        name="studyTime"
        control={control}
        id="studyTime"
        label="Study Time"
        type="number"
        placeholder="Enter study time in minutes"
      />
      <Input
        name="breakTime"
        control={control}
        id="breakTime"
        label="Break Time"
        type="number"
        placeholder="Enter break time in minutes"
      />
      {/* Short Break */}
      <div className="mt-9 flex flex-col space-x-4 sm:flex-row">
        <Input
          name="midBreakTime"
          control={control}
          id="midBreakTime"
          label="Short Break Time"
          type="number"
          placeholder="Enter short break time in minutes"
          containerClassName="mb-5 sm:w-1/2 w-full"
        />
        <Input
          name="midBreakInterval"
          control={control}
          id="midBreakInterval"
          label="Short Break Interval"
          type="number"
          placeholder="e.g. Every 8 cycles"
          containerClassName="mb-5 sm:w-1/2 w-full"
        />
      </div>
      {/* Long Break */}
      <div className="flex flex-col space-x-4 sm:flex-row">
        <Input
          name="longBreakTime"
          control={control}
          id="longBreakTime"
          label="Long Break Time"
          type="number"
          placeholder="Enter long break time in minutes"
          containerClassName="mb-5 sm:w-1/2 w-full"
        />
        <Input
          name="longBreakInterval"
          control={control}
          id="longBreakInterval"
          label="Long Break Interval"
          type="number"
          placeholder="e.g. Every 16 cycles"
          containerClassName="mb-5 sm:w-1/2 w-full"
        />
      </div>
      <div className="mt-[-0.9rem] mb-5 flex w-full flex-row justify-between overflow-hidden text-2xl text-gray-900 opacity-35 sm:h-6">
        <div className="w-1/2 sm:mr-4.5">Time = minutes</div>
        <div className="w-1/2 text-right sm:text-left">Interval = cycles</div>
      </div>
      {/* CheckBoxes */}
      <div className="flex w-full flex-row items-start justify-between">
        <div>
          <CheckboxInput
            name="autoStartBreak"
            control={control}
            id="autoStartBreak"
            label="Auto Start Break"
            onPress={() => setChecksChanged(true)}
          />
          <CheckboxInput
            name="autoStartStudy"
            control={control}
            id="autoStartStudy"
            label="Auto Start Study"
            onPress={() => setChecksChanged(true)}
          />
          <CheckboxInput
            name="pauseAudioOnBreak"
            control={control}
            id="pauseAudioOnBreak"
            label="Pause Audio on Break"
            onPress={() => setChecksChanged(true)}
          />
        </div>
        {backgroundAudioEnabled && (
          <button
            type="submit"
            disabled={(!isDirty || !isValid) && !checksChanged}
            className={
              "text-blue-700 hover:opacity-70" +
              ((!isDirty || !isValid) && !checksChanged
                ? " cursor-not-allowed opacity-50"
                : "")
            }
          >
            <div className="h-7 text-2xl">Save</div>
          </button>
        )}
      </div>

      {/* Background Audio */}
      <SwitchInput
        name="backgrounAudioEnabled"
        control={control}
        label="Background Audio"
        onPress={() => setChecksChanged(true)}
        {...getToggleProps()}
      />
      <div className="w-full" {...getCollapseProps()}>
        <AudioSection title="Rain" options={RAIN} control={control} />
        <AudioSection title="Chatter" options={CHATTER} control={control} />
        <AudioSection title="Water" options={WATER} control={control} />
        <AudioSection title="Nature" options={NATURE} control={control} />
        <AudioSection title="Fire" options={FIRE} control={control} />
        <AudioSection title="Noise" options={NOISE} control={control} />
        <SliderInput
          name="volume"
          control={control}
          id="volume"
          label="Volume"
          onPress={() => setChecksChanged(true)}
        />
      </div>

      {/* Save and Reset */}
      <div className="mt-6 flex flex-col justify-between sm:flex-row">
        <button
          type="submit"
          disabled={(!isDirty || !isValid) && !checksChanged}
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <div className="h-7 text-2xl">Save Settings</div>
        </button>
        <button
          type="button"
          onClick={resetSettings}
          className="w-full rounded-lg px-5 py-2.5 text-center text-2xl text-red-500 sm:w-auto"
        >
          Reset Settings
        </button>
      </div>
    </form>
  );
}

const AudioSection = ({
  title,
  options,
  control,
}: {
  title: string;
  options: BackgrounAudio[];
  control: Control<FormValues>;
}) => {
  return (
    <div className="mb-5 flex w-full flex-col flex-wrap justify-between sm:flex-row">
      <div className="mb-1 flex w-full">
        <span className="text-2xl text-gray-900 opacity-65">{title}</span>
      </div>
      {options.map((option) => (
        <RadioOption
          key={option}
          name="backgroundAudio"
          control={control}
          id={option}
          label={audioLabelMap[option]}
          value={option}
        />
      ))}
    </div>
  );
};
