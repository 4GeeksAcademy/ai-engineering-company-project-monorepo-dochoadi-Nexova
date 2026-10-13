"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { NeedType } from "@repo/shared-types";

interface NeedsFilterValue {
  filter: NeedType | null;
  toggle: (type: NeedType) => void;
}

const NeedsFilterContext = createContext<NeedsFilterValue>({ filter: null, toggle: () => {} });

/** Shares the "Where the work is" type filter with every department card. */
export function NeedsFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<NeedType | null>(null);
  const toggle = (type: NeedType) => setFilter((f) => (f === type ? null : type));
  return <NeedsFilterContext value={{ filter, toggle }}>{children}</NeedsFilterContext>;
}

export function useNeedsFilter(): NeedsFilterValue {
  return useContext(NeedsFilterContext);
}
