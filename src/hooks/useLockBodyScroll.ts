"use client";

import { useEffect } from "react";

type ScrollLockState = {
  scrollY: number;
  htmlOverflow: string;
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyWidth: string;
  bodyPaddingRight: string;
};

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Locks outer page scrolling while keeping inner modal scroll usable.
 * Uses position:fixed with preserved scrollY (more reliable than overflow:hidden alone).
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const body = document.body;

    const state: ScrollLockState = {
      scrollY: window.scrollY,
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    };

    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Freeze the page at the current scroll position
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${state.scrollY}px`;
    body.style.width = "100%";

    return () => {
      // Restore styles
      html.style.overflow = state.htmlOverflow;
      body.style.overflow = state.bodyOverflow;
      body.style.position = state.bodyPosition;
      body.style.top = state.bodyTop;
      body.style.width = state.bodyWidth;
      body.style.paddingRight = state.bodyPaddingRight;

      // Restore scroll position
      window.scrollTo(0, state.scrollY);
    };
  }, [locked]);
}


