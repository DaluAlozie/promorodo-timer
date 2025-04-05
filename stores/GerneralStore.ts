import { create } from "zustand";
import { BackgrounAudio } from "./audio";

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
};

export const useGeneralStore = create<GeneralStore>()((set) => ({
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
  setPauseAudioOnBreak: (pause) => set(() => ({ pauseAudioOnBreak: pause })),

  setStudying: (studying) => set(() => ({ studying })),
  setCycle: (cycle) => set(() => ({ cycle })),
  setTimerTotal: (total) => set(() => ({ timerTotal: total })),

  setFirstVisit: (firstVisit) => set(() => ({ firstVisit })),
}));
