"use client";
import { useGeneralStore } from "@/stores/generalStore";
import { useEffect } from "react";

export default function useSettings() {
  const setInitialised = useGeneralStore((state) => state.setInitialised);

  // Load saved settings from localStorage when the hook first runs.
  // localStorage is synchronous, so the store is hydrated before initialised
  // is set.
  useEffect(() => {
    useGeneralStore.persist.rehydrate();
    setInitialised(true);
  }, [setInitialised]);
}
