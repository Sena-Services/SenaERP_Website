"use client";

import { useEffect, useRef, useState } from "react";
import { getResponsiveValue as _getResponsiveValue } from "@/lib/responsive";

const SHRINK_SCROLL_DISTANCE = 900;
const SPLIT_SCROLL_DISTANCE = 400;
const ROTATE_SCROLL_DISTANCE = 800;
const EXTRA_HOLD_DISTANCE = 50;

export type ExpandedCard = "left" | "center" | "right" | null;

export { SHRINK_SCROLL_DISTANCE, SPLIT_SCROLL_DISTANCE, ROTATE_SCROLL_DISTANCE, EXTRA_HOLD_DISTANCE };

export function useIntroScrollAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
  expandedCard: ExpandedCard
) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [splitProgress, setSplitProgress] = useState(0);
  const [rotateProgress, setRotateProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [animationLocked, setAnimationLocked] = useState(false);
  const [isHomeButtonFixed, setIsHomeButtonFixed] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  // Track when home button should be fixed at top
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current && rotateProgress === 1) {
        const headerRect = headerRef.current.getBoundingClientRect();
        if (!isHomeButtonFixed && headerRect.top < 70) {
          setIsHomeButtonFixed(true);
        } else if (isHomeButtonFixed && headerRect.top > 90) {
          setIsHomeButtonFixed(false);
        }
      } else {
        setIsHomeButtonFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [rotateProgress, isHomeButtonFixed]);

  // Viewport resize with rAF throttle
  useEffect(() => {
    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setViewportWidth(window.innerWidth);
        setViewportHeight(window.innerHeight);
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Listen for homeLeft/homeUnlocked events to lock animations
  useEffect(() => {
    const handleHomeLocked = () => setAnimationLocked(true);
    const handleHomeUnlocked = () => setAnimationLocked(false);

    window.addEventListener('homeLeft', handleHomeLocked);
    window.addEventListener('homeUnlocked', handleHomeUnlocked);
    return () => {
      window.removeEventListener('homeLeft', handleHomeLocked);
      window.removeEventListener('homeUnlocked', handleHomeUnlocked);
    };
  }, []);

  // Main scroll handler — drives all three animation phases
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      if (viewportWidth < 768) {
        setScrollProgress(0);
        setSplitProgress(0);
        setRotateProgress(0);
        return;
      }

      if (expandedCard) {
        setScrollProgress(1);
        setSplitProgress(1);
        setRotateProgress(1);
        return;
      }

      if (animationLocked) {
        setScrollProgress(1);
        setSplitProgress(1);
        setRotateProgress(1);
        return;
      }

      const sectionTop = section.offsetTop;
      const scrollY = window.scrollY;
      const totalDistance = scrollY - sectionTop;

      // Phase 1: Shrink animation (0–900px)
      const shrinkDistance = Math.min(Math.max(totalDistance, 0), SHRINK_SCROLL_DISTANCE);
      setScrollProgress(shrinkDistance / SHRINK_SCROLL_DISTANCE);

      // Phase 3: Rotate animation (1300–2100px)
      const rotateDistance = Math.min(
        Math.max(totalDistance - SHRINK_SCROLL_DISTANCE - SPLIT_SCROLL_DISTANCE, 0),
        ROTATE_SCROLL_DISTANCE
      );
      const rawRotateProgress = rotateDistance / ROTATE_SCROLL_DISTANCE;
      setRotateProgress(rawRotateProgress);

      // Phase 2: Split animation (900–1300px)
      const splitDistance = Math.min(
        Math.max(totalDistance - SHRINK_SCROLL_DISTANCE, 0),
        SPLIT_SCROLL_DISTANCE
      );
      const rawSplitProgress = splitDistance / SPLIT_SCROLL_DISTANCE;
      const actualSplitProgress = rawRotateProgress > 0 ? 1 : rawSplitProgress;
      setSplitProgress(actualSplitProgress);
    };

    let rafId: number | null = null;
    const throttledScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };

    handleScroll();
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [animationLocked, viewportWidth, expandedCard, sectionRef]);

  // Derived layout calculations
  const getResponsiveValue = (baseValue: number) => _getResponsiveValue(viewportHeight, baseValue);

  const maxContainerWidth = 1280;
  const viewportPadding = viewportWidth < 900 ? 80 : viewportWidth < 1100 ? 160 : 320;
  const builderPadding = Math.max(16, Math.min(32, viewportWidth * 0.02));
  const targetWidth = Math.min(maxContainerWidth, viewportWidth - viewportPadding);
  const startWidth = viewportWidth < 768 ? viewportWidth : viewportWidth * 0.95;
  const currentWidthValue = startWidth - (startWidth - targetWidth) * scrollProgress;
  const currentWidth = viewportWidth === 0 ? "95vw" : `${currentWidthValue}px`;
  const currentPadding = scrollProgress * builderPadding;

  const startHeight = viewportWidth < 768 ? viewportHeight : viewportHeight * 0.92;
  const responsiveMinHeight = getResponsiveValue(600);
  const heightMultiplier =
    viewportHeight <= 720
      ? 0.78
      : viewportHeight >= 900
      ? 0.75
      : 0.78 - ((viewportHeight - 720) / (900 - 720)) * 0.03;
  const targetHeight = Math.max(viewportHeight * heightMultiplier, responsiveMinHeight);
  const currentHeightValue = startHeight - (startHeight - targetHeight) * scrollProgress;
  const currentHeight =
    viewportHeight === 0 ? (viewportWidth < 768 ? "100vh" : "92vh") : `${currentHeightValue}px`;

  const responsiveBorderRadius = getResponsiveValue(32) + scrollProgress * getResponsiveValue(16);
  const borderRadius = viewportWidth < 768 ? 0 : responsiveBorderRadius;
  const contentOpacity = Math.max(0, 1 - scrollProgress * 1.2);

  const sectionHeight =
    viewportWidth < 768
      ? 'auto'
      : startHeight + SHRINK_SCROLL_DISTANCE + SPLIT_SCROLL_DISTANCE + ROTATE_SCROLL_DISTANCE + EXTRA_HOLD_DISTANCE;
  const stickyFrameHeight = viewportHeight;

  const navbarHeight = getResponsiveValue(90);
  const titleHeight = getResponsiveValue(120);

  let extraTopSpace = 0;
  if (viewportHeight <= 720) {
    extraTopSpace = getResponsiveValue(60);
  } else if (viewportHeight <= 760) {
    extraTopSpace = getResponsiveValue(60 + ((viewportHeight - 720) / (760 - 720)) * 20);
  } else if (viewportHeight <= 1000) {
    extraTopSpace = getResponsiveValue(80 + ((viewportHeight - 760) / (1000 - 760)) * 20);
  } else if (viewportHeight <= 1400) {
    extraTopSpace = getResponsiveValue(100 + ((viewportHeight - 1000) / (1400 - 1000)) * 45);
  } else {
    extraTopSpace = getResponsiveValue(145);
  }
  const topSpaceNeeded = navbarHeight + titleHeight + extraTopSpace;

  const centeredPadding =
    viewportWidth < 768
      ? 0
      : Math.max(getResponsiveValue(16), (viewportHeight - currentHeightValue) / 2);

  const shiftProgress = Math.max(0, scrollProgress - 0.7) / 0.3;
  const heroPaddingTop = centeredPadding + (topSpaceNeeded - centeredPadding) * shiftProgress;

  const responsiveMaxGap = getResponsiveValue(6);
  const cardGap = splitProgress * responsiveMaxGap;

  const widthForCardCalculation =
    splitProgress > 0 ? Math.min(currentWidthValue, maxContainerWidth) : currentWidthValue;
  const cardWidth = (widthForCardCalculation - cardGap * 2) / 3;
  const baseCardWidth = currentWidthValue / 3;

  return {
    scrollProgress,
    splitProgress,
    rotateProgress,
    viewportWidth,
    viewportHeight,
    animationLocked,
    isHomeButtonFixed,
    headerRef,
    // layout
    currentWidth,
    currentWidthValue,
    currentHeight,
    currentHeightValue,
    borderRadius,
    contentOpacity,
    sectionHeight,
    stickyFrameHeight,
    heroPaddingTop,
    cardGap,
    cardWidth,
    baseCardWidth,
    currentPadding,
    maxContainerWidth,
    viewportPadding,
    getResponsiveValue,
  };
}
