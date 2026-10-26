"use client";
import { useEffect } from "react";
import { useGeneralStore } from "@/stores/generalStore";
import { BackgrounAudio } from "@/stores/audio";
import { backgroundLoop } from "./loopPlayer";

export default function BackgroundAudioPlayer() {
  const backgroundAudio = useGeneralStore((state) => state.backgroundAudio);
  const volume = useGeneralStore((state) => state.audioVolume) / 100;
  const ready = useGeneralStore((state) => state.audioReady);
  const audioPaused = useGeneralStore((state) => state.audioPaused);

  useEffect(() => {
    backgroundLoop.setVolume(volume);
  }, [volume]);

  // Play the chosen track once the user has started the timer
  useEffect(() => {
    if (!ready || backgroundAudio === BackgrounAudio.NONE) {
      backgroundLoop.stop();
      return;
    }
    void backgroundLoop.play(`/background-audio/${backgroundAudio}.mp3`);
  }, [ready, backgroundAudio]);

  useEffect(() => {
    if (audioPaused) backgroundLoop.pause();
    else backgroundLoop.resume();
  }, [audioPaused]);

  // Stop playback if the player is unmounted
  useEffect(() => () => backgroundLoop.stop(), []);

  return null;
}
