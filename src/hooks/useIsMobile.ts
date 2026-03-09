"use client";

import { useState, useEffect } from "react";

/**
 * Shared hook for mobile detection via window width.
 * Replaces duplicate resize-listener patterns across components.
 * @param breakpoint - Width threshold in px (default 768)
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
