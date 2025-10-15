"use client";

import { useLayoutEffect, useState } from "react";

export function Timestamp() {
  const [date, setDate] = useState<string | null>(null);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(new Date().getFullYear().toString());
  }, []);
  if (date) {
    return date;
  }
  return null;
}
