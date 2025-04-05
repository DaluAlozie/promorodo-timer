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
import { useGeneralStore } from "@/stores/GerneralStore";
import { BackgrounAudio } from "@/stores/audio";
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
    initialised: initialisedSettings,
    setAudioReady,
    setOpenSettings,
    setStudying,
    setCycle,
    setTimerTotal,
    setAudioPaused,
    setFirstVisit,
  } = useGeneralStore();

  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [mode, setMode] = useState<
    "study" | "break" | "longbreak" | "midbreak"
  >("study");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prorogressColor = studying ? "#4b9c49" : "#d1a152";
  const backgroundColor = studying ? "#7aa679" : "#d1b06dF1";
  const [openInfo, setOpenInfo] = useState(false);

  const onExpire = useCallback(() => {
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
    // Play the sound when the timer expires
    if (audioRef.current) {
      audioRef.current.play();
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

  // Resets the cycle and timer to the initial values
  const resetCycle = useCallback(() => {
    const sure = confirm("Are you sure you want to reset the cycles?");
    if (!sure) return;
    setCycle(1);
    setStudying(true);
    setTimerTotal(studyTime);
    restart(getTimestamp(studyTime), false);
  }, [restart, studyTime]);

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
    restart(
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

  // Sets the timer to the initial value when settings are loaded
  useEffect(() => {
    if (!initialisedSettings) return;
    restart(getTimestamp(timerTotal), false);
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
    if (!initialisedSettings) return;
    if (!studying) return;
    setTimerTotal(studyTime);
    restart(getTimestamp(studyTime), false);
  }, [studyTime]);

  // Resets the timer when when break time changes
  useEffect(() => {
    if (!initialisedSettings) return;
    if (studying) return;
    if (mode === "break") {
      setTimerTotal(breakTime);
      restart(getTimestamp(breakTime), false);
    }
  }, [breakTime]);

  // Resets the timer when when long break time changes
  useEffect(() => {
    if (!initialisedSettings) return;
    if (studying) return;
    if (mode === "longbreak") {
      setTimerTotal(longBreakTime);
      restart(getTimestamp(longBreakTime), false);
    }
  }, [longBreakTime]);

  // Resets the timer when when mid break time changes
  useEffect(() => {
    if (!initialisedSettings) return;
    if (studying) return;
    if (mode === "midbreak") {
      setTimerTotal(midBreakTime);
      restart(getTimestamp(midBreakTime), false);
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

  return (
    <div
      className="relative flex h-full min-h-max w-screen flex-col items-center justify-between overflow-x-hidden text-gray-200"
      style={{ backgroundColor: backgroundColor, textAlign: "center" }}
    >
      {/* Heading */}
      <div className="flex w-full flex-col items-center">
        <div className="mt-1 flex w-full flex-row items-center justify-between px-1 pt-1 sm:px-5">
          {backgroundAudio === BackgrounAudio.NONE ? (
            <div className="w-16"></div>
          ) : (
            <Button onClick={() => setAudioPaused(!audioPaused)}>
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
          <Button onClick={() => setOpenSettings(true)}>
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
                  >
                    <BsSkipBackwardFill size={buttonSize} />
                  </Button>
                </div>
                <div className="w-max">
                  {isRunning ? (
                    <Button onClick={pause}>
                      <div className="m-0 h-10 w-10 overflow-hidden p-0">
                        <FaPause size={buttonSize + 6} />
                      </div>
                    </Button>
                  ) : (
                    <Button onClick={resume}>
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
            <Button onClick={() => restart(getTimestamp(timerTotal), false)}>
              <div className="h-10.5 text-center text-5xl">Restart Timer</div>
            </Button>
          ) : (
            <Button
              disabled={timerStarted || !initialisedSettings}
              onClick={() => {
                setTimerStarted(true);
                setAudioReady(true);
                start();
              }}
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
        <Button onClick={() => setOpenInfo(true)}>
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
