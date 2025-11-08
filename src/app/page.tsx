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
  const builderRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const joinUsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isSnapping = false;
    let snapTimeout: NodeJS.Timeout;

    // Define snap points in pixels from top
    // These correspond to the visual states you described
    const getSnapPoints = () => {
      const introSection = introRef.current;
      const environmentsSection = environmentsRef.current;

      if (!introSection || !environmentsSection) return [];

      const introTop = introSection.offsetTop;
      const viewportHeight = window.innerHeight;

      return [
        { y: 0, name: 'initial' },                           // Snap 1: Initial page with content
        { y: introTop + 900, name: 'empty-card' },          // Snap 2: Empty card (after shrink)
        { y: introTop + 900 + 400 + 400, name: 'split-flip' }, // Snap 3: Cards split and flipped
        { y: environmentsSection.offsetTop, name: 'environments' }, // Snap 4: Environments section
      ];
    };

    const findClosestSnapPoint = (currentScroll: number, direction: 'up' | 'down') => {
      const snapPoints = getSnapPoints();

      if (direction === 'down') {
        // Find next snap point above current scroll
        return snapPoints.find(point => point.y > currentScroll + 100);
      } else {
        // Find previous snap point below current scroll
        const reversed = [...snapPoints].reverse();
        return reversed.find(point => point.y < currentScroll - 100);
      }
    };

    let lastScrollY = 0;
    let scrollVelocity = 0;

    const handleScroll = () => {
      if (isSnapping) return;

      const currentScrollY = window.scrollY;
      scrollVelocity = currentScrollY - lastScrollY;

      // Only trigger snap if user scrolled more than 50px
      if (Math.abs(scrollVelocity) < 50) {
        lastScrollY = currentScrollY;
        return;
      }

      const direction = scrollVelocity > 0 ? 'down' : 'up';
      lastScrollY = currentScrollY;

      const targetSnap = findClosestSnapPoint(currentScrollY, direction);

      if (targetSnap) {
        isSnapping = true;

        window.scrollTo({
          top: targetSnap.y,
          behavior: 'smooth'
        });

        snapTimeout = setTimeout(() => {
          isSnapping = false;
        }, 1000);
      }
    };

    // Debounced scroll handler - trigger after user stops scrolling
    let scrollEndTimer: NodeJS.Timeout;
    const handleScrollEnd = () => {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        if (!isSnapping) {
          handleScroll();
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScrollEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollEnd);
      clearTimeout(snapTimeout);
      clearTimeout(scrollEndTimer);
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
          <div className="flex-1 flex flex-col">
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
