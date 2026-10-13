/** Office clocks for the About section, ported from renderVals() in the design. */

/** IANA time zone of each office, keyed by city name from @repo/shared-types. */
export const OFFICE_TIME_ZONES: Readonly<Record<string, string>> = {
  Valencia: "Europe/Madrid",
  Miami: "America/New_York",
};

/** Rendered on the server and before hydration, so the markup never depends on the clock. */
export const TIME_PLACEHOLDER = "--:--";

/** The design's fallback when the gap cannot be computed (CET/CEST vs ET outside DST changeovers). */
export const DEFAULT_HOURS_APART = 6;

export function timeZoneFor(city: string): string {
  const tz = OFFICE_TIME_ZONES[city];
  if (!tz) throw new Error(`No time zone for office "${city}"`);
  return tz;
}

/** "HH:MM", 24-hour, in the given time zone. */
export function formatOfficeTime(now: number, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(now));
  } catch {
    return "";
  }
}

/** Whole hours between the wall clocks of two time zones at `now`. */
export function hoursApart(now: number, zoneA: string, zoneB: string): number {
  const d = new Date(now);
  const wall = (tz: string) => new Date(d.toLocaleString("en-US", { timeZone: tz })).getTime();
  try {
    return Math.round(Math.abs(wall(zoneA) - wall(zoneB)) / 3.6e6);
  } catch {
    return DEFAULT_HOURS_APART;
  }
}
