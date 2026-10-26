import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { BackgrounAudio } from "./audio";
import { DEFAULT_BREAK_COLOR, DEFAULT_STUDY_COLOR, HEX_COLOR } from "./colors";

type GeneralStore = {
  initialised: boolean;
  openSettings: boolean;
  studyTime: number;
  breakTime: number;
  midBreakTime: number;
  longBreakTime: number;
  autoStartBreak: boolean;
  autoStartStudy: boolean;
  midBreakInterval: number;
  longBreakInterval: number;
  backgroundAudio: BackgrounAudio;
  audioVolume: number;
  audioReady: boolean;
  audioPaused: boolean;
  pauseAudioOnBreak: boolean;
  studying: boolean;
  cycle: number;
  timerTotal: number;
  firstVisit: boolean;
  studyColor: string;
  breakColor: string;

  setInitialised: (initialised: boolean) => void;
  setOpenSettings: (open: boolean) => void;
  setStudyTime: (time: number) => void;
  setBreakTime: (time: number) => void;
  setMidBreakTime: (time: number) => void;
  setLongBreakTime: (time: number) => void;
  setAutoStartBreak: (auto: boolean) => void;
  setAutoStartStudy: (auto: boolean) => void;
  setMidBreakInterval: (interval: number) => void;
  setLongBreakInterval: (interval: number) => void;

  setBackgroundAudio: (audio: BackgrounAudio) => void;
  setAudioVolume: (volume: number) => void;
  setAudioReady: (ready: boolean) => void;
  setAudioPaused: (paused: boolean) => void;
  setPauseAudioOnBreak: (pause: boolean) => void;

  setStudying: (studying: boolean) => void;
  setCycle: (cycle: number) => void;
  setTimerTotal: (total: number) => void;

  setFirstVisit: (firstVisit: boolean) => void;
  setStudyColor: (color: string) => void;
  setBreakColor: (color: string) => void;
};

// Keys the old useSettings hook stored one per localStorage entry
const LEGACY_KEYS = [
  "studyTime",
  "breakTime",
  "midBreakTime",
  "longBreakTime",
  "autoStartBreak",
  "autoStartStudy",
  "midBreakInterval",
  "longBreakInterval",
  "backgroundAudio",
  "audioVolume",
  "pauseAudioOnBreak",
  "firstVisit",
  "timerTotal",
  "cycle",
  "studying",
] as const satisfies readonly (keyof GeneralStore)[];

// Settings and session progress that survive a reload. Runtime UI/audio
// flags (initialised, openSettings, audioReady, audioPaused) are left out.
const PERSISTED_KEYS = [
  ...LEGACY_KEYS,
  "studyColor",
  "breakColor",
] as const satisfies readonly (keyof GeneralStore)[];

type PersistedState = Pick<GeneralStore, (typeof PERSISTED_KEYS)[number]>;

const STORAGE_KEY = "general-store";
const STORAGE_VERSION = 1;
// Version given to settings read from the old one-key-per-setting format
const LEGACY_VERSION = 0;

// Reads settings saved by the old useSettings hook, which stored each one
// under its own localStorage key, and removes those keys.
function takeLegacySettings(): Partial<PersistedState> | null {
  const legacy: Record<string, unknown> = {};
  for (const key of LEGACY_KEYS) {
    const value = localStorage.getItem(key);
    if (value === null) continue;
    try {
      legacy[key] = JSON.parse(value);
    } catch {
      // backgroundAudio was stored as a bare string
      legacy[key] = value;
    }
  }
  if (Object.keys(legacy).length === 0) return null;
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  return legacy as Partial<PersistedState>;
}

// Last value this tab read or wrote. persist saves on every set, including
// runtime-only ones (openSettings, audioPaused...), so skipping unchanged
// values stops an idle tab overwriting settings saved in another tab.
let lastValue: string | null = null;

const storage: StateStorage = {
  getItem: (name) => {
    const stored = localStorage.getItem(name);
    if (stored !== null) return (lastValue = stored);
    const legacy = takeLegacySettings();
    if (!legacy) return null;
    // The version mismatch makes persist run migrate and save the result
    // under the new key straight away.
    return JSON.stringify({ state: legacy, version: LEGACY_VERSION });
  },
  setItem: (name, value) => {
    if (value === lastValue) return;
    lastValue = value;
    localStorage.setItem(name, value);
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useGeneralStore = create<GeneralStore>()(
  persist(
    (set) => ({
      initialised: false,
      openSettings: false,
      studyTime: 25,
      breakTime: 5,
      midBreakTime: 30,
      longBreakTime: 45,
      autoStartBreak: true,
      autoStartStudy: true,
      midBreakInterval: 8,
      longBreakInterval: 16,
      backgroundAudio: BackgrounAudio.NONE,
      audioReady: false,
      audioVolume: 50,
      audioPaused: false,
      pauseAudioOnBreak: true,

      studying: true,
      cycle: 1,
      timerTotal: 25,

      firstVisit: true,
      studyColor: DEFAULT_STUDY_COLOR,
      breakColor: DEFAULT_BREAK_COLOR,

      setInitialised: (initialised) => set(() => ({ initialised })),
      setOpenSettings: (open) => set(() => ({ openSettings: open })),
      setStudyTime: (time) => set(() => ({ studyTime: time })),
      setBreakTime: (time) => set(() => ({ breakTime: time })),
      setMidBreakTime: (time) => set(() => ({ midBreakTime: time })),
      setLongBreakTime: (time) => set(() => ({ longBreakTime: time })),
      setAutoStartBreak: (auto) => set(() => ({ autoStartBreak: auto })),
      setAutoStartStudy: (auto) => set(() => ({ autoStartStudy: auto })),
      setMidBreakInterval: (interval) =>
        set(() => ({ midBreakInterval: interval })),
      setLongBreakInterval: (interval) =>
        set(() => ({ longBreakInterval: interval })),
      setBackgroundAudio: (backgroundAudio) => set(() => ({ backgroundAudio })),
      setAudioVolume: (volume) => set(() => ({ audioVolume: volume })),
      setAudioReady: (ready) => set(() => ({ audioReady: ready })),
      setAudioPaused: (paused) => set(() => ({ audioPaused: paused })),
      setPauseAudioOnBreak: (pause) =>
        set(() => ({ pauseAudioOnBreak: pause })),

      setStudying: (studying) => set(() => ({ studying })),
      setCycle: (cycle) => set(() => ({ cycle })),
      setTimerTotal: (total) => set(() => ({ timerTotal: total })),

      setFirstVisit: (firstVisit) => set(() => ({ firstVisit })),
      setStudyColor: (color) => set(() => ({ studyColor: color })),
      setBreakColor: (color) => set(() => ({ breakColor: color })),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => storage),
      partialize: (state) =>
        Object.fromEntries(
          PERSISTED_KEYS.map((key) => [key, state[key]]),
        ) as PersistedState,
      // Legacy settings are already in the current shape
      migrate: (persistedState) => persistedState as PersistedState,
      // Fall back to the default colours if a stored one isn't a valid hex
      // colour, so the background never ends up blank
      merge: (persistedState, currentState) => {
        const state = {
          ...currentState,
          ...(persistedState as Partial<PersistedState>),
        };
        if (!HEX_COLOR.test(state.studyColor))
          state.studyColor = DEFAULT_STUDY_COLOR;
        if (!HEX_COLOR.test(state.breakColor))
          state.breakColor = DEFAULT_BREAK_COLOR;
        return state;
      },
      // Hydrated on the client by useSettings so server and client render
      // the same defaults first
      skipHydration: true,
    },
  ),
);
