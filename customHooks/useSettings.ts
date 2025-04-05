"use client";
import { BackgrounAudio } from "@/stores/audio";
import { useGeneralStore } from "@/stores/GerneralStore";
import { useCallback, useEffect } from "react";

export default function useSettings() {
  const initialised = useGeneralStore((state) => state.initialised);
  const studyTime = useGeneralStore((state) => state.studyTime);
  const breakTime = useGeneralStore((state) => state.breakTime);
  const midBreakTime = useGeneralStore((state) => state.midBreakTime);
  const longBreakTime = useGeneralStore((state) => state.longBreakTime);
  const autoStartBreak = useGeneralStore((state) => state.autoStartBreak);
  const autoStartStudy = useGeneralStore((state) => state.autoStartStudy);
  const midBreakInterval = useGeneralStore((state) => state.midBreakInterval);
  const longBreakInterval = useGeneralStore((state) => state.longBreakInterval);
  const backgroundAudio = useGeneralStore((state) => state.backgroundAudio);
  const audioVolume = useGeneralStore((state) => state.audioVolume);
  const pauseAudioOnBreak = useGeneralStore((state) => state.pauseAudioOnBreak);
  const firstVisit = useGeneralStore((state) => state.firstVisit);
  const studying = useGeneralStore((state) => state.studying);
  const cycle = useGeneralStore((state) => state.cycle);
  const timerTotal = useGeneralStore((state) => state.timerTotal);

  const setInitialised = useGeneralStore((state) => state.setInitialised);
  const setStudyTime = useGeneralStore((state) => state.setStudyTime);
  const setBreakTime = useGeneralStore((state) => state.setBreakTime);
  const setMidBreakTime = useGeneralStore((state) => state.setMidBreakTime);
  const setLongBreakTime = useGeneralStore((state) => state.setLongBreakTime);
  const setAutoStartBreak = useGeneralStore((state) => state.setAutoStartBreak);
  const setAutoStartStudy = useGeneralStore((state) => state.setAutoStartStudy);
  const setMidBreakInterval = useGeneralStore(
    (state) => state.setMidBreakInterval,
  );
  const setLongBreakInterval = useGeneralStore(
    (state) => state.setLongBreakInterval,
  );
  const setBackgroundAudio = useGeneralStore(
    (state) => state.setBackgroundAudio,
  );
  const setAudioVolume = useGeneralStore((state) => state.setAudioVolume);
  const setPauseAudioOnBreak = useGeneralStore(
    (state) => state.setPauseAudioOnBreak,
  );
  const setFirstVisit = useGeneralStore((state) => state.setFirstVisit);
  const setCycle = useGeneralStore((state) => state.setCycle);
  const setStudying = useGeneralStore((state) => state.setStudying);
  const setTimerTotal = useGeneralStore((state) => state.setTimerTotal);

  // Save settings to localStorage when they change (after initialisation)
  useEffect(() => {
    if (!initialised) return;
    window.localStorage.setItem("studyTime", studyTime.toString());
    window.localStorage.setItem("breakTime", breakTime.toString());
    window.localStorage.setItem("midBreakTime", midBreakTime.toString());
    window.localStorage.setItem("longBreakTime", longBreakTime.toString());
    window.localStorage.setItem("autoStartBreak", autoStartBreak.toString());
    window.localStorage.setItem("autoStartStudy", autoStartStudy.toString());
    window.localStorage.setItem(
      "midBreakInterval",
      midBreakInterval.toString(),
    );
    window.localStorage.setItem(
      "longBreakInterval",
      longBreakInterval.toString(),
    );
    window.localStorage.setItem("backgroundAudio", backgroundAudio);
    window.localStorage.setItem("audioVolume", audioVolume.toString());
    window.localStorage.setItem(
      "pauseAudioOnBreak",
      pauseAudioOnBreak.toString(),
    );
    window.localStorage.setItem("firstVisit", firstVisit.toString());
    window.localStorage.setItem("timerTotal", JSON.stringify(timerTotal));
    window.localStorage.setItem("cycle", JSON.stringify(cycle));
    window.localStorage.setItem("studying", JSON.stringify(studying));
  }, [
    studyTime,
    breakTime,
    midBreakTime,
    longBreakTime,
    autoStartBreak,
    autoStartStudy,
    midBreakInterval,
    longBreakInterval,
    backgroundAudio,
    audioVolume,
    pauseAudioOnBreak,
    firstVisit,
    initialised,
    timerTotal,
    cycle,
    studying,
  ]);

  const fetchSettings = useCallback(() => {
    const storedStudyTime = localStorage.getItem("studyTime");
    const storedBreakTime = localStorage.getItem("breakTime");
    const storedMidBreakTime = localStorage.getItem("midBreakTime");
    const storedLongBreakTime = localStorage.getItem("longBreakTime");
    const storedAutoStartBreak = localStorage.getItem("autoStartBreak");
    const storedAutoStartStudy = localStorage.getItem("autoStartStudy");
    const storedMidBreakInterval = localStorage.getItem("midBreakInterval");
    const storedLongBreakInterval = localStorage.getItem("longBreakInterval");
    const storedBackgroundAudio = localStorage.getItem("backgroundAudio");
    const storedAudioVolume = localStorage.getItem("audioVolume");
    const storedPauseAudioOnBreak = localStorage.getItem("pauseAudioOnBreak");
    const storedFirstVisit = localStorage.getItem("firstVisit");
    const cachedTimerTotal = window.localStorage.getItem("timerTotal");
    const cachedCycle = window.localStorage.getItem("cycle");
    const cachedStudying = window.localStorage.getItem("studying");

    if (storedStudyTime) setStudyTime(parseInt(storedStudyTime));
    if (storedBreakTime) setBreakTime(parseInt(storedBreakTime));
    if (storedMidBreakTime) setMidBreakTime(parseInt(storedMidBreakTime));
    if (storedLongBreakTime) setLongBreakTime(parseInt(storedLongBreakTime));
    if (storedAutoStartBreak)
      setAutoStartBreak(JSON.parse(storedAutoStartBreak));
    if (storedAutoStartStudy)
      setAutoStartStudy(JSON.parse(storedAutoStartStudy));
    if (storedMidBreakInterval)
      setMidBreakInterval(parseInt(storedMidBreakInterval));
    if (storedLongBreakInterval)
      setLongBreakInterval(parseInt(storedLongBreakInterval));
    if (storedBackgroundAudio)
      setBackgroundAudio(storedBackgroundAudio as BackgrounAudio);
    if (storedAudioVolume) setAudioVolume(parseFloat(storedAudioVolume));
    if (storedPauseAudioOnBreak)
      setPauseAudioOnBreak(JSON.parse(storedPauseAudioOnBreak));
    if (storedFirstVisit) setFirstVisit(JSON.parse(storedFirstVisit));
    if (cachedTimerTotal) setTimerTotal(JSON.parse(cachedTimerTotal));
    if (cachedCycle) setCycle(JSON.parse(cachedCycle));
    if (cachedStudying) setStudying(JSON.parse(cachedStudying));
    if (cachedTimerTotal) setTimerTotal(JSON.parse(cachedTimerTotal));
  }, [
    setAudioVolume,
    setAutoStartBreak,
    setAutoStartStudy,
    setBackgroundAudio,
    setBreakTime,
    setLongBreakInterval,
    setLongBreakTime,
    setMidBreakInterval,
    setMidBreakTime,
    setStudyTime,
    setPauseAudioOnBreak,
    setFirstVisit,
    setCycle,
    setStudying,
    setTimerTotal,
  ]);

  // Load settings from localStorage when the hook first runs
  useEffect(() => {
    fetchSettings();
    setInitialised(true);
  }, [fetchSettings, setInitialised]);
  return {};
}
