"use client";

import React, { useEffect, useRef } from "react";
import IntroSection from "@/components/IntroSection";
import Builder from "@/components/Builder";
import HowItWorksSection from "@/components/HowItWorksSection";
import LandingEnvironments from "@/components/LandingEnvironments";
import IntegrationsSection from "@/components/IntegrationsSection";
import PricingSection from "@/components/PricingSection";
import BlogSection from "@/components/BlogSection";
import JoinUsSection from "@/components/JoinUsSection";
import NavBar from "@/components/NavBar";


export default function Home() {
  const introRef = useRef<HTMLDivElement>(null);
  const environmentsRef = useRef<HTMLElement>(null);
  const integrationsRef = useRef<HTMLElement>(null);
  const builderRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const joinUsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isAnimating = false;
    let animationFrameId: number;
    let scrollTimeout: NodeJS.Timeout;
    let autoRotateTriggered = false;
    let manualScrollEnabled = false;

    // Define snap points and zones
    const getSnapPoints = () => {
      const introSection = introRef.current;
      const environmentsSection = environmentsRef.current;

      if (!introSection || !environmentsSection) return {
        initial: 0,
        unitedCard: 0,
        splitZoneStart: 0,
        splitZoneEnd: 0,
        autoTriggerPoint: 0,
        rotated: 0,
        environments: 0,
      };

      const introTop = introSection.offsetTop;

      return {
        initial: 0,
        unitedCard: introTop + 900,
        splitZoneStart: introTop + 900,
        splitZoneEnd: introTop + 900 + 400,
        autoTriggerPoint: introTop + 900 + 400 * 0.8, // 80% through split
        rotated: introTop + 900 + 400 + 800,
        environments: environmentsSection.offsetTop,
      };
    };

    const isInSplitZone = (scrollY: number) => {
      const points = getSnapPoints();
      return scrollY >= points.splitZoneStart && scrollY <= points.splitZoneEnd;
    };

    // Smooth animation to target scroll position with FIXED duration
    const animateToPosition = (targetY: number, duration: number = 1200, onComplete?: () => void) => {
      // Cancel any existing animation first
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Capture start position immediately - no delay
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation (ease-in-out)
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const currentY = startY + distance * easeProgress;
        window.scrollTo(0, currentY);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          isAnimating = false;
          if (onComplete) onComplete();
        }
      };

      isAnimating = true;
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      const currentScrollY = window.scrollY;
      const direction = e.deltaY > 0 ? 'down' : 'up';
      const points = getSnapPoints();

      // Check if we're in manual scroll zone (split zone)
      if (manualScrollEnabled && isInSplitZone(currentScrollY)) {
        // In manual zone - allow natural scrolling
        // Check for auto-trigger threshold
        if (direction === 'down' && currentScrollY >= points.autoTriggerPoint && !autoRotateTriggered) {
          e.preventDefault();
          autoRotateTriggered = true;
          manualScrollEnabled = false;
          animateToPosition(points.rotated, 1200, () => {
            autoRotateTriggered = false;
          });
        }
        return; // Allow natural scroll in split zone
      }

      // Outside manual zone - prevent scroll and animate
      e.preventDefault();

      // Block during animation
      if (isAnimating) {
        return;
      }

      // Determine which zone we're in and where to go based on current position
      if (currentScrollY <= points.unitedCard + 50) {
        // At initial or united card position (with 50px tolerance)
        if (direction === 'down') {
          animateToPosition(points.unitedCard, 1200, () => {
            manualScrollEnabled = true; // Enable manual scroll in split zone
          });
        } else if (direction === 'up' && currentScrollY > points.initial + 50) {
          // Scroll up from united card to initial
          manualScrollEnabled = false;
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY > points.unitedCard + 50 && currentScrollY < points.splitZoneEnd + 50) {
        // In split zone
        if (direction === 'down') {
          // Enable manual scrolling mode - don't auto-advance
          manualScrollEnabled = true;
        } else if (direction === 'up') {
          // Scroll up from split zone goes back to initial
          manualScrollEnabled = false;
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY >= points.splitZoneEnd + 50 && currentScrollY < points.environments - 50) {
        // At or after rotated position (anywhere between split end and environments)
        if (direction === 'down') {
          animateToPosition(points.environments, 1200);
        } else if (direction === 'up') {
          // Scroll up from rotated back to united card
          manualScrollEnabled = false;
          autoRotateTriggered = false;
          animateToPosition(points.unitedCard, 1200, () => {
            manualScrollEnabled = true; // Re-enable manual scroll
          });
        }
      } else if (currentScrollY >= points.environments - 50) {
        // At environments section
        if (direction === 'up') {
          animateToPosition(points.rotated, 1200);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      (window as any).touchStartY = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default scroll on touch
      if (isAnimating) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;

      const touch = e.changedTouches[0];
      const touchStartY = (window as any).touchStartY || touch.clientY;
      const deltaY = touchStartY - touch.clientY;

      // Ignore tiny movements
      if (Math.abs(deltaY) < 30) return;

      const direction = deltaY > 0 ? 'down' : 'up';
      const snapPoints = getSnapPoints();
      let targetIndex = currentSnapIndex;

      if (direction === 'down') {
        targetIndex = Math.min(currentSnapIndex + 1, snapPoints.length - 1);
      } else {
        targetIndex = Math.max(currentSnapIndex - 1, 0);
      }

      const targetSnap = snapPoints[targetIndex];

      if (targetSnap && targetIndex !== currentSnapIndex) {
        currentSnapIndex = targetIndex;
        animateToPosition(targetSnap.y, 1200);
      }
    };


    // Listen to wheel events with { passive: false } to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(scrollTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <main className="relative bg-waygent-cream text-waygent-text-primary">
      {/* Fixed NavBar at top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] px-4 sm:px-8"
        style={{
          width: "min(640px, 90vw)",
          paddingTop: "4px",
        }}
      >
        <NavBar />
      </div>

      <div ref={introRef}>
        <IntroSection />
      </div>

      <div className="bg-waygent-cream w-full relative z-1">
        <div className="flex min-h-screen flex-1 flex-col bg-waygent-cream">
          <div className="flex-1 flex flex-col relative">
            <LandingEnvironments ref={environmentsRef} />
            <IntegrationsSection ref={integrationsRef} />
            <Builder ref={builderRef} />
          </div>

          <PricingSection ref={pricingRef} />
          <BlogSection ref={blogRef} />
          <JoinUsSection ref={joinUsRef} />
        </div>
      </div>
    </main>
  );
}
