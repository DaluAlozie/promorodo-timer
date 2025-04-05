"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGeneralStore } from "@/stores/GerneralStore";
import { BackgrounAudio } from "@/stores/audio";

export default function BackgroundAudioPlayer() {
  const backgroundAudio = useGeneralStore((state) => state.backgroundAudio);
  const volume = useGeneralStore((state) => state.audioVolume) / 100;
  const volumeFraction = volume * 0.7;
  const ready = useGeneralStore((state) => state.audioReady);
  const studying = useGeneralStore((state) => state.studying);
  const audioPaused = useGeneralStore((state) => state.audioPaused);

  const [remainingTime, setRemainingTime] = useState(0);
  const [timeoutLock, setTimeoutLock] = useState(false);

  const audio1Ref = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);
  const audioRefs = [audio1Ref, audio2Ref];

  const getAudioSrc = (audio: BackgrounAudio): string | null => {
    if (audio === BackgrounAudio.NONE) return null;
    return `/background-audio/${audio}.mp3`;
  };
  const audioSrc = getAudioSrc(backgroundAudio);

  // When the remaining time is less than 1 second, play the second audio file.
  // This is used to play the second audio file when the first one ends.
  // The second audio file is played for 2 seconds and then stopped.
  useEffect(() => {
    if (!ready) return;
    if (remainingTime < 2 && !timeoutLock) {
      setTimeoutLock(true);
      if (audio2Ref.current) {
        audio2Ref.current.currentTime = 10;
        audio2Ref.current.play().catch(console.error);
        if (audio1Ref.current) {
          audio1Ref.current.volume = volumeFraction;
        }
      }
      setTimeout(() => {
        if (audio2Ref.current) {
          audio2Ref.current.pause();
          audio2Ref.current.currentTime = 0;
        }
        if (audio1Ref.current) {
          audio1Ref.current.volume = volume;
        }
        setTimeoutLock(false);
      }, 4000);
    }
  }, [remainingTime]);

  // When the audio is paused, pause all audio elements.
  useEffect(() => {
    if (audioPaused) {
      if (audio1Ref.current) audio1Ref.current.pause();

      if (audio2Ref.current) audio2Ref.current.pause();

      return;
    }
    if (audio1Ref.current && audioSrc && ready) {
      audio1Ref.current.play().catch(console.error);
    }
  }, [audioSrc, audioPaused, studying]);

  // When the audioSrc changes, update the audio source and play the audio.
  useEffect(() => {
    if (!ready || !audioSrc) {
      audioRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.pause();
        }
      });
      return;
    }
    if (audio1Ref.current && audioSrc) {
      audio1Ref.current.src = audioSrc;
      audio1Ref.current.loop = true;
      audio1Ref.current.volume = volume;
    }
    if (audio2Ref.current) {
      audio2Ref.current.src = audioSrc;
      audio2Ref.current.volume = volumeFraction;
    }
    if (audio1Ref.current && !audioPaused) {
      audio1Ref.current.play().catch(console.error);
    }
  }, [ready, audioSrc, volume]);

  // Track remaining time for audio1 using the 'timeupdate' event.
  useEffect(() => {
    const audio1 = audio1Ref.current;
    if (!audio1) return;

    const updateRemainingTime = () => {
      if (audio1.duration) {
        const remaining = audio1.duration - audio1.currentTime;
        setRemainingTime(remaining);
      }
    };

    // Update on time changes.
    audio1.addEventListener("timeupdate", updateRemainingTime);

    // Cleanup event listener on unmount.
    return () => {
      audio1.removeEventListener("timeupdate", updateRemainingTime);
    };
  }, [audioSrc]);

  return (
    <>
      <audio ref={audio1Ref} style={{ display: "none" }} />
      <audio ref={audio2Ref} style={{ display: "none" }} />
    </>
  );
}
