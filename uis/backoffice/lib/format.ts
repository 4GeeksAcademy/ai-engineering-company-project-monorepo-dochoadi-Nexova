/** Date and time formats from the design (en-GB, the viewer's time zone). */
const todayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });
const clockFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
const dueFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatToday = (d: Date | number) => todayFormat.format(d);
export const formatClock = (d: Date | number) => clockFormat.format(d);
export const formatDue = (d: Date | number) => dueFormat.format(d);
