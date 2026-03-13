"use client";

import { useEffect, useRef } from "react";

/**
 * Mobile scroll exhaustion detection.
 * When the scrollable content container reaches the bottom, triggers a smooth
 * page scroll so the user can continue past the intro section.
 */
export function useIntroContentScroll(
  isMobile: boolean,
  contentRef: React.RefObject<HTMLDivElement | null>
) {
  const isManualScrollRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    if (!isMobile || !contentRef.current) return;

    const element = contentRef.current;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isScrollingDown = false;
    let hasTriggeredTransition = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchCurrentY = touchStartY;
      hasTriggeredTransition = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY - touchCurrentY;
      isScrollingDown = deltaY > 0;

      const { scrollTop, scrollHeight, clientHeight } = element;
      const scrollBottom = scrollTop + clientHeight;
      const isAtBottom = scrollBottom >= scrollHeight - 5;
      const isScrollable = scrollHeight > clientHeight;

      if ((!isScrollable || isAtBottom) && isScrollingDown && !hasTriggeredTransition) {
        e.preventDefault();
        hasTriggeredTransition = true;

        window.scrollBy({
          top: window.innerHeight * 0.5,
          behavior: 'smooth',
        });
      }
    };

    const handleScroll = () => {
      const { scrollTop } = element;
      lastScrollTopRef.current = scrollTop;
    };

    const handleTouchEnd = () => {
      if (isManualScrollRef.current || hasTriggeredTransition) {
        isManualScrollRef.current = false;
        hasTriggeredTransition = false;
        return;
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element?.removeEventListener('touchstart', handleTouchStart);
      element?.removeEventListener('touchmove', handleTouchMove);
      element?.removeEventListener('touchend', handleTouchEnd);
      element?.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, contentRef]);

  return { isManualScrollRef, lastScrollTopRef };
}
