"use client";

import { shell } from "@/content/overview";
import { formatClock, formatToday } from "@/lib/format";
import { useNow } from "@/lib/motion";

/** Today's date and the time, refreshed every 30 s; placeholders until hydrated. */
export default function LiveClock({ className, dotClassName }: { className?: string; dotClassName?: string }) {
  const now = useNow();
  return (
    <span className={className}>
      <span className={dotClassName} aria-hidden="true" />
      {now === null ? shell.datePlaceholder : formatToday(now)} ·{" "}
      <time dateTime={now === null ? undefined : new Date(now).toISOString()}>
        {now === null ? shell.timePlaceholder : formatClock(now)}
      </time>
    </span>
  );
}
