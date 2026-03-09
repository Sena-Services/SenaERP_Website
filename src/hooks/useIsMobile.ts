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
    let rafId: number;
    setIsMobile(window.innerWidth < breakpoint);
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < breakpoint);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [breakpoint]);

  return isMobile;
}
