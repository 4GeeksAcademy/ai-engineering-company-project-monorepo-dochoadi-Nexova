"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_HOURS_APART,
  formatOfficeTime,
  hoursApart,
  TIME_PLACEHOLDER,
  timeZoneFor,
} from "@/lib/time";
import styles from "./OfficeClock.module.css";

/** The design refreshes the clocks every 15 s. */
const REFRESH_MS = 15_000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, REFRESH_MS);
  return () => window.clearInterval(id);
}
// Whole seconds, so repeated reads within one render agree.
const getNow = () => Math.floor(Date.now() / 1000) * 1000;
// No clock on the server: the first client render matches it, then switches to the real time.
const getServerNow = () => null;

function useNow(): number | null {
  return useSyncExternalStore(subscribe, getNow, getServerNow);
}

/** Live local time of an office, "--:--" until hydrated. */
export default function OfficeClock({ city }: { city: string }) {
  const now = useNow();
  return (
    <time className={styles.time}>{now === null ? TIME_PLACEHOLDER : formatOfficeTime(now, timeZoneFor(city))}</time>
  );
}

/** Hours between two offices' clocks; the design's default of 6 until hydrated. */
export function HoursApart({ cityA, cityB, className }: { cityA: string; cityB: string; className?: string }) {
  const now = useNow();
  const n = now === null ? DEFAULT_HOURS_APART : hoursApart(now, timeZoneFor(cityA), timeZoneFor(cityB));
  return <span className={className}>{n}</span>;
}
