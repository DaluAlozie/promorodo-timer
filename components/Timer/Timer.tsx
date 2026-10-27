/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useTimer } from "react-timer-hook";
import ProgressCircle from "../ProgressCircle/ProgressCircle";
import Button from "../Button/Button";
import { FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { BsSkipBackwardFill } from "react-icons/bs";
import { BsSkipForwardFill } from "react-icons/bs";
import Modal from "../Modal/Modal";
import useSettings from "@/customHooks/useSettings";
import Settings from "../Settings/Settings";
import { useGeneralStore } from "@/stores/generalStore";
import { BackgrounAudio } from "@/stores/audio";
import { progressColor } from "@/stores/colors";
import { backgroundLoop } from "../BackgrounAudioPlayer/loopPlayer";
import { BsGearFill } from "react-icons/bs";
import { FiInfo } from "react-icons/fi";
import Info from "../Info/Info";

export default function Timer() {
  const buttonSize = 40;
  useSettings();

  const {
    cycle,
    studying,
    timerTotal,
    studyTime,
    breakTime,
    midBreakTime,
    longBreakTime,
    autoStartBreak,
    autoStartStudy,
    openSettings,
    midBreakInterval,
    longBreakInterval,
    audioPaused,
    backgroundAudio,
    pauseAudioOnBreak,
    firstVisit,
    studyColor,
    breakColor,
    notifications,
    savedTimer,
    audioReady,
    initialised: initialisedSettings,
    setAudioReady,
    setOpenSettings,
    setStudying,
    setCycle,
    setTimerTotal,
    setAudioPaused,
    setFirstVisit,
    setSavedTimer,
  } = useGeneralStore();

  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [mode, setMode] = useState<
    "study" | "break" | "longbreak" | "midbreak"
  >("study");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundColor = studying ? studyColor : breakColor;
  const prorogressColor = progressColor(backgroundColor);
  const [openInfo, setOpenInfo] = useState(false);
  const [fadeColors, setFadeColors] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Set once saved settings have been applied, so the effects that reset the
  // timer when a setting changes ignore the values loaded from storage
  const settingsAppliedRef = useRef(false);

  // Moves on to the next study session or break
  const advance = useCallback(() => {
    if (!studying) {
      // If we are on break, set the next study time
      setTimerTotal(studyTime);
      setCycle(cycle + 1);
      setStudying(true);
    } else {
      // If we are studying, choose the break time based on cycle settings
      if (cycle % longBreakInterval === 0 && cycle !== 0) {
        setTimerTotal(longBreakTime);
      } else if (cycle % midBreakInterval === 0 && cycle !== 0) {
        setTimerTotal(midBreakTime);
      } else {
        setTimerTotal(breakTime);
      }
      setStudying(false);
    }
  }, [
    studying,
    cycle,
    studyTime,
    breakTime,
    midBreakTime,
    longBreakTime,
    longBreakInterval,
    midBreakInterval,
  ]);

  // Shows a system notification when a session ends while the page isn't
  // visible. Permission is asked for when the setting is turned on.
  const notifySessionEnd = useCallback(() => {
    if (
      !notifications ||
      typeof Notification === "undefined" ||
      Notification.permission !== "granted" ||
      document.visibilityState === "visible"
    ) {
      return;
    }
    try {
      const notification = new Notification(
        studying ? "Study session complete" : "Break over",
        {
          body: studying
            ? "Time for a break."
            : "Time to get back to studying.",
          icon: "/icon.svg",
          // Replaces the previous notification instead of stacking them
          tag: "session-end",
        },
      );
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch {
      // Some browsers, e.g. Chrome on Android, only allow notifications from
      // a service worker
    }
  }, [notifications, studying]);

  const onExpire = useCallback(() => {
    advance();
    // Play the sound when the timer expires. Browsers block it until the
    // user has interacted with the page, e.g. just after a refresh.
    audioRef.current?.play().catch(() => {});
    notifySessionEnd();
  }, [advance, notifySessionEnd]);

  const {
    totalMilliseconds,
    seconds,
    minutes,
    isRunning,
    hours,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: getTimestamp(studyTime),
    onExpire: onExpire,
    autoStart: false,
  });

  // The timer controls below also save the countdown, so it can be restored
  // after a page refresh
  const restartTimer = useCallback(
    (expiry: Date, autoStart: boolean) => {
      restart(expiry, autoStart);
      if (!timerStarted) return;
      setSavedTimer(
        autoStart
          ? { running: true, endsAt: expiry.getTime() }
          : {
              running: false,
              remaining: Math.max(expiry.getTime() - Date.now(), 0),
            },
      );
    },
    [restart, timerStarted, setSavedTimer],
  );

  const startTimer = () => {
    setTimerStarted(true);
    // Audio can only be started from a user gesture
    backgroundLoop.unlock();
    setAudioReady(true);
    start();
    setSavedTimer({ running: true, endsAt: Date.now() + totalMilliseconds });
  };

  const pauseTimer = () => {
    pause();
    setSavedTimer({ running: false, remaining: totalMilliseconds });
  };

  const resumeTimer = () => {
    resume();
    setSavedTimer({ running: true, endsAt: Date.now() + totalMilliseconds });
  };

  // Resets the cycle and timer to the initial values
  const resetCycle = useCallback(() => {
    const sure = confirm("Are you sure you want to reset the cycles?");
    if (!sure) return;
    setCycle(1);
    setStudying(true);
    setTimerTotal(studyTime);
    restartTimer(getTimestamp(studyTime), false);
  }, [restartTimer, studyTime]);

  // Skips forwards to the next cycle or break
  const skipForward = useCallback(() => {
    onExpire();
  }, [onExpire]);

  // Skips back to the previous cycle or break
  const skipBack = useCallback(() => {
    if (!studying) {
      // If we are on break, set the next study time
      setTimerTotal(studyTime);
      setStudying(true);
    } else {
      const prevCycle = cycle - 1;
      // If we are studying, choose the break time based on the previous cycle
      if (prevCycle % longBreakInterval === 0 && prevCycle !== 0) {
        setTimerTotal(longBreakTime);
      } else if (prevCycle % midBreakInterval === 0 && prevCycle !== 0) {
        setTimerTotal(midBreakTime);
      } else {
        setTimerTotal(breakTime);
      }
      setCycle(prevCycle);
      setStudying(false);
    }
  }, [
    studying,
    cycle,
    studyTime,
    breakTime,
    midBreakTime,
    longBreakTime,
    longBreakInterval,
    midBreakInterval,
    restart,
  ]);

  const timeElapsed = timerTotal * 60 - totalMilliseconds / 1000;
  const progress = timeElapsed / (timerTotal * 60);
  const timeText = [hours > 0 ? hours : null, minutes, seconds]
    .filter((n) => n != null)
    .map((num) => padNumber(num))
    .join(":");

  // Restarts timer when studying changes
  useEffect(() => {
    if (!initialisedSettings || !timerStarted) return;
    restartTimer(
      getTimestamp(timerTotal),
      (studying && autoStartStudy) || (!studying && autoStartBreak),
    );
    if (studying && audioPaused && backgroundAudio !== BackgrounAudio.NONE) {
      setAudioPaused(false);
    }
    if (
      !studying &&
      !audioPaused &&
      pauseAudioOnBreak &&
      backgroundAudio !== BackgrounAudio.NONE
    ) {
      setAudioPaused(true);
    }
  }, [studying]);

  // Once settings are loaded, restores the countdown saved before a refresh,
  // or sets the timer to the full session
  useEffect(() => {
    if (!initialisedSettings) return;
    const restoringBreak =
      savedTimer &&
      (!savedTimer.running || savedTimer.endsAt > Date.now()) &&
      !studying;
    // Whether audio is paused isn't saved, so apply the pause-on-break
    // setting to a break that's being restored
    if (
      restoringBreak &&
      pauseAudioOnBreak &&
      backgroundAudio !== BackgrounAudio.NONE
    ) {
      setAudioPaused(true);
    }
    if (savedTimer?.running && savedTimer.endsAt > Date.now()) {
      setTimerStarted(true);
      restart(new Date(savedTimer.endsAt), true);
    } else if (savedTimer && !savedTimer.running) {
      setTimerStarted(true);
      restart(new Date(Date.now() + savedTimer.remaining), false);
    } else if (savedTimer?.running) {
      // The session ended while the page was closed, so move on to the next
      // one. Changing session restarts the timer as it would have on expiry.
      setTimerStarted(true);
      advance();
    } else if (studying) {
      setTimerTotal(studyTime);
      restart(getTimestamp(studyTime), false);
    } else {
      restart(getTimestamp(timerTotal), false);
    }
  }, [initialisedSettings]);

  // After a refresh the timer can carry on without a click, but browsers
  // only allow audio once the user interacts with the page, so background
  // audio starts on the first interaction
  useEffect(() => {
    if (!timerStarted || audioReady) return;
    const events = ["click", "keydown", "touchend"] as const;
    const unlockAudio = () => {
      // Some keys, e.g. Escape, don't count as a user gesture, and audio
      // started then would stay blocked
      if (navigator.userActivation && !navigator.userActivation.isActive) {
        return;
      }
      backgroundLoop.unlock();
      setAudioReady(true);
    };
    events.forEach((event) => window.addEventListener(event, unlockAudio));
    return () => {
      events.forEach((event) => window.removeEventListener(event, unlockAudio));
    };
  }, [timerStarted, audioReady, setAudioReady]);

  // Fades the background between study and break, but only after the saved
  // colours are applied, so a page load doesn't fade from the default.
  // Reading the computed style makes the browser apply the loaded colour
  // before the transition is switched on.
  useEffect(() => {
    if (!initialisedSettings || !containerRef.current) return;
    void getComputedStyle(containerRef.current).backgroundColor;
    setFadeColors(true);
  }, [initialisedSettings]);

  // Displays guide if it is the users first visit
  useEffect(() => {
    if (initialisedSettings) {
      if (firstVisit) {
        setOpenInfo(true);
        setFirstVisit(false);
      }
    }
  }, [initialisedSettings, firstVisit, setFirstVisit]);

  // Resets the timer when when study time changes
  useEffect(() => {
    if (!settingsAppliedRef.current) return;
    if (!studying) return;
    setTimerTotal(studyTime);
    restartTimer(getTimestamp(studyTime), false);
  }, [studyTime]);

  // Resets the timer when when break time changes
  useEffect(() => {
    if (!settingsAppliedRef.current) return;
    if (studying) return;
    if (mode === "break") {
      setTimerTotal(breakTime);
      restartTimer(getTimestamp(breakTime), false);
    }
  }, [breakTime]);

  // Resets the timer when when long break time changes
  useEffect(() => {
    if (!settingsAppliedRef.current) return;
    if (studying) return;
    if (mode === "longbreak") {
      setTimerTotal(longBreakTime);
      restartTimer(getTimestamp(longBreakTime), false);
    }
  }, [longBreakTime]);

  // Resets the timer when when mid break time changes
  useEffect(() => {
    if (!settingsAppliedRef.current) return;
    if (studying) return;
    if (mode === "midbreak") {
      setTimerTotal(midBreakTime);
      restartTimer(getTimestamp(midBreakTime), false);
    }
  }, [midBreakTime]);

  // Update the mode when the cycle changes
  useEffect(() => {
    if (studying) {
      setMode("study");
      return;
    }
    if (cycle % longBreakInterval === 0 && cycle !== 0) {
      setMode("longbreak");
      return;
    }
    if (cycle % midBreakInterval === 0 && cycle !== 0) {
      setMode("midbreak");
      return;
    }
    setMode("break");
  }, [studying, cycle, longBreakInterval, midBreakInterval]);

  // Declared after the effects above so they skip the render where saved
  // settings are applied
  useEffect(() => {
    if (initialisedSettings) settingsAppliedRef.current = true;
  }, [initialisedSettings]);

  // Shows the countdown in the tab title, so it can be seen from other tabs,
  // and puts the original title back when the timer isn't in use
  const tabTitle = timerStarted
    ? `${isRunning ? "" : "Paused · "}${timeText} · ${studying ? "Study" : "Break"}`
    : null;
  const defaultTitleRef = useRef<string | null>(null);
  useEffect(() => {
    defaultTitleRef.current ??= document.title;
    const title = tabTitle ?? defaultTitleRef.current;
    document.title = title;
    // Next.js hydrates the page's <title> after this component's first
    // effects and puts the original text back, so set it again whenever
    // something else changes it
    const element = document.querySelector("title");
    if (!element) return;
    const observer = new MutationObserver(() => {
      if (document.title !== title) document.title = title;
    });
    observer.observe(element, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [tabTitle]);
  useEffect(
    () => () => {
      if (defaultTitleRef.current) document.title = defaultTitleRef.current;
    },
    [],
  );

  // Keyboard shortcuts. The handler is kept in a ref so the listener is
  // added once but always sees the latest state.
  const shortcutsRef = useRef<(event: KeyboardEvent) => void>(() => {});
  const spaceHandledRef = useRef(false);
  // Whether focus was last moved with Tab rather than a mouse or touch press
  const navigatedByKeyboardRef = useRef(false);
  shortcutsRef.current = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.repeat) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    // Leave keys alone while a dialog is open or a form field has focus
    if (openSettings || openInfo) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("input, textarea, select, [contenteditable]")) return;

    switch (event.key) {
      case " ":
        // Space presses a button reached with Tab, so leave that alone. A
        // button that only has focus because it was clicked gets the
        // shortcut instead.
        if (target?.closest("button, a") && navigatedByKeyboardRef.current) {
          return;
        }
        if (!initialisedSettings) return;
        event.preventDefault();
        // Buttons are pressed on keyup, so that is cancelled too
        spaceHandledRef.current = true;
        if (!timerStarted) startTimer();
        else if (isRunning) pauseTimer();
        else resumeTimer();
        break;
      case "ArrowRight":
        if (!timerStarted) return;
        event.preventDefault();
        skipForward();
        break;
      case "ArrowLeft":
        if (!timerStarted || (cycle <= 1 && studying)) return;
        event.preventDefault();
        skipBack();
        break;
      case "m":
      case "M":
        if (backgroundAudio === BackgrounAudio.NONE) return;
        setAudioPaused(!audioPaused);
        break;
    }
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") navigatedByKeyboardRef.current = true;
      // Only the keyup of a Space press the shortcut handled is cancelled
      if (event.key === " " && !event.repeat) spaceHandledRef.current = false;
      shortcutsRef.current(event);
    };
    const onPointerDown = () => {
      navigatedByKeyboardRef.current = false;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== " " || !spaceHandledRef.current) return;
      spaceHandledRef.current = false;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        "relative flex h-full min-h-max w-screen flex-col items-center justify-between overflow-x-hidden text-gray-200" +
        (fadeColors
          ? " transition-colors duration-500 motion-reduce:transition-none"
          : "")
      }
      style={{ backgroundColor: backgroundColor, textAlign: "center" }}
    >
      {/* Heading */}
      <div className="flex w-full flex-col items-center">
        <div className="mt-1 flex w-full flex-row items-center justify-between px-1 pt-1 sm:px-5">
          {backgroundAudio === BackgrounAudio.NONE ? (
            <div className="w-16"></div>
          ) : (
            <Button
              onClick={() => setAudioPaused(!audioPaused)}
              label={
                audioPaused
                  ? "Unmute background audio"
                  : "Mute background audio"
              }
              shortcut="M"
            >
              {audioPaused ? (
                <FaVolumeMute size={32} />
              ) : (
                <FaVolumeUp size={32} />
              )}
            </Button>
          )}
          <div className="h-24 overflow-hidden text-center text-8xl">
            {studying ? "Study" : "Break"}
          </div>
          <Button onClick={() => setOpenSettings(true)} label="Settings">
            <BsGearFill size={32} />
          </Button>
        </div>
        {/* Timer */}
        <div className="flex flex-col items-center justify-center">
          <ProgressCircle progress={progress} color={prorogressColor}>
            <div>
              <div className="h-24 overflow-hidden text-center text-[105px] sm:h-34 sm:text-[150px]">
                {timeText}
              </div>
            </div>
            {timerStarted ? (
              <div className="mt-5 flex max-w-max flex-row items-center justify-between self-center px-1">
                <div>
                  <Button
                    disabled={(cycle <= 1 && studying) || !timerStarted}
                    onClick={skipBack}
                    className="mr-5"
                    label="Previous session"
                    shortcut="ArrowLeft"
                  >
                    <BsSkipBackwardFill size={buttonSize} />
                  </Button>
                </div>
                <div className="w-max">
                  {isRunning ? (
                    <Button onClick={pauseTimer} label="Pause" shortcut="Space">
                      <div className="m-0 h-10 w-10 overflow-hidden p-0">
                        <FaPause size={buttonSize + 6} />
                      </div>
                    </Button>
                  ) : (
                    <Button
                      onClick={resumeTimer}
                      label="Resume"
                      shortcut="Space"
                    >
                      <div className="m-0 h-10 w-10 overflow-hidden p-0">
                        <FaPlay size={buttonSize} />
                      </div>
                    </Button>
                  )}
                </div>
                <div>
                  <Button
                    disabled={!timerStarted}
                    onClick={skipForward}
                    className="ml-5"
                    label="Next session"
                    shortcut="ArrowRight"
                  >
                    <BsSkipForwardFill size={buttonSize} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 min-h-10"></div>
            )}
          </ProgressCircle>
        </div>
        <div className="flex flex-col items-center justify-center pt-5 text-center md:flex-row">
          {timerStarted ? (
            <Button
              onClick={() => restartTimer(getTimestamp(timerTotal), false)}
            >
              <div className="h-10.5 text-center text-5xl">Restart Timer</div>
            </Button>
          ) : (
            <Button
              disabled={timerStarted || !initialisedSettings}
              onClick={startTimer}
              shortcut="Space"
            >
              <div className="h-13 overflow-hidden text-center text-7xl">
                Start
              </div>
              <div className="h-1.5 w-30 rounded-4xl bg-gray-200"></div>
            </Button>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="mt-10 flex w-full flex-row items-end justify-between">
        <Button onClick={() => setOpenInfo(true)} label="Guide">
          <FiInfo size={32} />
        </Button>
        <div>
          <div>
            <span className="m-0 overflow-hidden p-0 text-center text-4xl">
              Cycle {cycle}
            </span>
          </div>
          <div>
            <Button onClick={resetCycle}>
              <div className="m-0 h-8 overflow-hidden p-0 text-center text-4xl">
                Reset Cycles
              </div>
              <div className="h-1 w-35 rounded-4xl bg-gray-200"></div>
            </Button>
          </div>
        </div>
        <Button disabled={true} onClick={() => {}}>
          <div className="opacity-0">
            <FiInfo size={32} />
          </div>
        </Button>
      </div>
      {/* Use root-relative path for the audio file */}
      <audio ref={audioRef} id="a1" src="/ping.mp3" />
      <Modal open={openSettings} setOpen={setOpenSettings}>
        <Settings close={() => setOpenSettings(false)} />
      </Modal>
      <Modal open={openInfo} setOpen={setOpenInfo}>
        <Info />
      </Modal>
    </div>
  );
}

const getTimestamp = (minutes: number) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + minutes * 60);
  return time;
};

const padNumber = (num: number) => {
  return num < 10 ? `0${num}` : num;
};
