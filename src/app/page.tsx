"use client";

import React, { useEffect, useRef, useState } from "react";
import IntroSection from "@/components/IntroSection";
import BuilderTabbed from "@/components/BuilderTabbed";
import LandingEnvironments from "@/components/LandingEnvironments";
import IntegrationsSection from "@/components/IntegrationsSection";
// import PricingSection from "@/components/PricingSection";
// import BlogSection from "@/components/BlogSection";
import JoinUsSection from "@/components/JoinUsSection";
import NavBar from "@/components/NavBar";
import SidebarNav from "@/components/SidebarNav";


export default function Home() {
  const introRef = useRef<HTMLDivElement>(null);
  const environmentsRef = useRef<HTMLElement>(null);
  const integrationsRef = useRef<HTMLElement>(null);
  const builderRef = useRef<HTMLDivElement>(null);
  // const pricingRef = useRef<HTMLElement>(null);
  // const blogRef = useRef<HTMLElement>(null);
  const joinUsRef = useRef<HTMLElement>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const sidebarSections = [
    { id: "intro", label: "Home" },
    { id: "how-it-works", label: "How it works" },
    { id: "builder", label: "Builder" },
    { id: "integrations", label: "Integrations" },
    { id: "environments", label: "Environments" },
    // { id: "pricing", label: "Pricing" },
    // { id: "blogs", label: "Blogs" },
    { id: "join-us", label: "Join Our Team" },
  ];

  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isAnimating = false;
    let animationFrameId: number;
    let directionLock: 'up' | 'down' | null = null;
    let directionLockTimeout: NodeJS.Timeout | null = null;
    let autoRotateTriggered = false;
    let manualScrollEnabled = false;
    let introSequencePlayed = false;
    let hasLeftHome = false; // Track if user has scrolled past home
    const lockDirection = (direction: 'up' | 'down', duration = 600) => {
      directionLock = direction;
      if (directionLockTimeout) {
        clearTimeout(directionLockTimeout);
      }
      directionLockTimeout = setTimeout(() => {
        directionLock = null;
        directionLockTimeout = null;
      }, duration);
    };

    // Define snap points and zones
    const getSnapPoints = () => {
      const introSection = introRef.current;
      const environmentsSection = environmentsRef.current;
      const builderSection = builderRef.current;

      if (!introSection || !environmentsSection) return {
        initial: 0,
        unitedCard: 0,
        splitZoneStart: 0,
        splitZoneEnd: 0,
        autoTriggerPoint: 0,
        rotated: 0,
        environments: 0,
        builder: 0,
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
        builder: builderSection?.offsetTop || 0,
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

    const playIntroSequence = (points: ReturnType<typeof getSnapPoints>, force = false) => {
      if (!force && (introSequencePlayed || isAnimating)) return;

      introSequencePlayed = true;
      manualScrollEnabled = false;
      autoRotateTriggered = true;
      lockDirection('down', 1800);

      animateToPosition(points.unitedCard, 600, () => {
        animateToPosition(points.rotated, 1200, () => {
          manualScrollEnabled = true;
          autoRotateTriggered = false;
          hasLeftHome = true; // Mark that user has left home section
          setShowNavigation(true); // Show navigation after leaving home
          // Dispatch event so sidebar knows home is locked
          window.dispatchEvent(new CustomEvent('homeLeft'));
        });
      });
    };

    const playReverseSequence = (points: ReturnType<typeof getSnapPoints>) => {
      // BLOCK: Once user has left home, they cannot go back
      if (hasLeftHome) return;
      if (isAnimating) return;

      manualScrollEnabled = false;
      autoRotateTriggered = false;
      lockDirection('up', 1800);

      const finishToIntro = () => {
        animateToPosition(points.initial, 1200, () => {
          introSequencePlayed = false;
          manualScrollEnabled = false;
          autoRotateTriggered = false;
        });
      };

      if (window.scrollY > points.unitedCard + 10) {
        animateToPosition(points.unitedCard, 600, finishToIntro);
      } else {
        finishToIntro();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const currentScrollY = window.scrollY;
      const direction = e.deltaY > 0 ? 'down' : 'up';
      const points = getSnapPoints();
      const inSplitZone = isInSplitZone(currentScrollY);
      let blocked = false;
      const blockScroll = () => {
        if (!blocked) {
          e.preventDefault();
          blocked = true;
        }
      };

      // BLOCK ALL UPWARD SCROLL if user has left home AND anywhere near intro section
      if (hasLeftHome && direction === 'up' && currentScrollY <= points.rotated + 200) {
        blockScroll();
        // Force scroll position to stay at minimum threshold
        const minScroll = points.rotated;
        if (window.scrollY < minScroll) {
          window.scrollTo(0, minScroll);
        }
        return;
      }

      // IMPORTANT: Allow completely normal scrolling after rotated position (How It Works)
      if (currentScrollY > points.rotated + 50) {
        // Everything after How It Works is completely normal scrolling - no snapping at all
        return;
      }

      if (directionLock && direction !== directionLock) {
        if (!isAnimating) {
          directionLock = null;
          if (directionLockTimeout) {
            clearTimeout(directionLockTimeout);
            directionLockTimeout = null;
          }
        } else {
          blockScroll();
          return;
        }
      }

      // Manual split zone handling
      if (inSplitZone) {
        if (direction === 'up') {
          // Already blocked at top if hasLeftHome is true
          if (!hasLeftHome) {
            blockScroll();
            playReverseSequence(points);
          }
          return;
        }

        if (manualScrollEnabled) {
          // Allow natural downward scroll until we hit the trigger
          if (direction === 'down' && currentScrollY >= points.autoTriggerPoint && !autoRotateTriggered) {
            blockScroll();
            autoRotateTriggered = true;
            manualScrollEnabled = false;
            lockDirection('down');
            animateToPosition(points.rotated, 1200, () => {
              autoRotateTriggered = false;
            });
          }
          return;
        }
      }

      // Block during animation
      if (isAnimating) {
        blockScroll();
        return;
      }

      // Determine which zone we're in and where to go based on current position
      if (currentScrollY <= points.unitedCard + 50) {
        // At initial or united card position (with 50px tolerance)
        if (direction === 'down') {
          if (!introSequencePlayed) {
            blockScroll();
            playIntroSequence(points);
          } else {
            blockScroll();
            lockDirection('down');
            animateToPosition(points.unitedCard, 1200, () => {
              manualScrollEnabled = true; // Enable manual scroll in split zone
            });
          }
        } else if (direction === 'up' && currentScrollY > points.initial + 50 && !hasLeftHome) {
          // Scroll up from united card to initial (only if haven't left home yet)
          blockScroll();
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY > points.unitedCard + 50 && currentScrollY < points.splitZoneEnd + 50) {
        // In split zone
        if (direction === 'down') {
          // Enable manual scrolling mode - don't auto-advance
          manualScrollEnabled = true;
        } else if (direction === 'up' && !hasLeftHome) {
          // Scroll up from split zone goes back to initial (only if haven't left home yet)
          blockScroll();
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY >= points.splitZoneEnd + 50 && currentScrollY <= points.rotated + 50) {
        // At rotated position (How It Works with 3 flipped cards)
        if (direction === 'down') {
          // Allow completely normal scroll to continue to the rest of the page
          return;
        } else if (direction === 'up' && !hasLeftHome) {
          // Only allow reverse if haven't left home yet
          blockScroll();
          playReverseSequence(points);
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
      const currentScrollY = window.scrollY;
      const points = getSnapPoints();

      // BLOCK ALL UPWARD SCROLL if user has left home AND anywhere near intro section
      if (hasLeftHome && direction === 'up' && currentScrollY <= points.rotated + 200) {
        return;
      }

      // IMPORTANT: Allow completely normal scrolling after rotated position (How It Works)
      if (currentScrollY > points.rotated + 50) {
        // Everything after How It Works is completely normal scrolling - no snapping at all
        return;
      }

      // Determine target position based on current scroll position and direction
      // Similar logic to handleWheel
      if (currentScrollY <= points.unitedCard + 50) {
        if (direction === 'down') {
          if (!introSequencePlayed) {
            playIntroSequence(points);
          } else {
            lockDirection('down');
            animateToPosition(points.unitedCard, 1200, () => {
              manualScrollEnabled = true;
            });
          }
        } else if (direction === 'up' && currentScrollY > points.initial + 50 && !hasLeftHome) {
          // Only allow going back if haven't left home yet
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY > points.unitedCard + 50 && currentScrollY < points.splitZoneEnd + 50) {
        if (direction === 'down') {
          manualScrollEnabled = true;
        } else if (direction === 'up' && !hasLeftHome) {
          // Only allow going back if haven't left home yet
          manualScrollEnabled = false;
          introSequencePlayed = false;
          lockDirection('up');
          animateToPosition(points.initial, 1200);
        }
      } else if (currentScrollY >= points.splitZoneEnd + 50 && currentScrollY <= points.rotated + 50) {
        if (direction === 'down') {
          // Allow completely normal scroll to continue to the rest of the page
          return;
        } else if (direction === 'up' && !hasLeftHome) {
          // Only allow reverse if haven't left home yet
          playReverseSequence(points);
        }
      }
    };


    // Listen to wheel events with { passive: false } to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Listen for custom event from sidebar to jump directly to "how it works" (rotated cards)
    const handleTriggerIntro = () => {
      const points = getSnapPoints();
      // Set state as if sequence was already played
      introSequencePlayed = true;
      manualScrollEnabled = true;
      autoRotateTriggered = false;
      // Jump directly to the rotated position (where 3 cards are visible)
      window.scrollTo({ top: points.rotated, behavior: 'auto' });
      // Trigger scroll event to update sidebar
      window.dispatchEvent(new Event('scroll'));
    };

    window.addEventListener('triggerIntroSequence', handleTriggerIntro);

    // Listen for resetHome event from sidebar/button to unlock home
    const handleResetHome = () => {
      // Unlock the animations first
      hasLeftHome = false;
      setShowNavigation(false); // Hide navigation when going back to home
      window.dispatchEvent(new CustomEvent('homeUnlocked'));

      // Get current position
      const points = getSnapPoints();

      // Play the reverse sequence animation
      if (isAnimating) return;

      manualScrollEnabled = false;
      autoRotateTriggered = false;
      lockDirection('up', 1800);

      const finishToIntro = () => {
        animateToPosition(points.initial, 1200, () => {
          introSequencePlayed = false;
          manualScrollEnabled = false;
          autoRotateTriggered = false;
        });
      };

      if (window.scrollY > points.unitedCard + 10) {
        animateToPosition(points.unitedCard, 600, finishToIntro);
      } else {
        finishToIntro();
      }
    };

    window.addEventListener('resetHome', handleResetHome);

    // Continuous scroll position monitoring to prevent going above threshold
    const monitorScrollPosition = () => {
      if (hasLeftHome) {
        const points = getSnapPoints();
        const minScroll = points.rotated;
        if (window.scrollY < minScroll) {
          window.scrollTo(0, minScroll);
        }
      }
    };

    // Monitor scroll position continuously
    const scrollMonitorId = setInterval(monitorScrollPosition, 16); // ~60fps

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('triggerIntroSequence', handleTriggerIntro);
      window.removeEventListener('resetHome', handleResetHome);
      clearInterval(scrollMonitorId);
      if (directionLockTimeout) {
        clearTimeout(directionLockTimeout);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <main className="relative bg-waygent-cream text-waygent-text-primary">
      {/* Fixed NavBar at top - only show when not on home */}
      {showNavigation && (
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] transition-opacity duration-500"
          style={{
            width: "min(640px, 90vw)",
            opacity: showNavigation ? 1 : 0,
          }}
        >
          <NavBar />
        </div>
      )}

      {/* Sidebar - only show when not on home */}
      {showNavigation && (
        <div className="transition-opacity duration-500" style={{ opacity: showNavigation ? 1 : 0 }}>
          <SidebarNav sections={sidebarSections} />
        </div>
      )}

      <div ref={introRef}>
        <IntroSection />
      </div>

      <div className="bg-waygent-cream w-full relative z-1">
        <div className="flex min-h-screen flex-1 flex-col bg-waygent-cream">
          <div className="flex-1 flex flex-col relative">
            <div id="builder">
              <BuilderTabbed />
            </div>
            <div id="integrations">
              <IntegrationsSection ref={integrationsRef} />
            </div>
            <div id="environments">
              <LandingEnvironments ref={environmentsRef} />
            </div>
          </div>

          {/* <div id="pricing">
            <PricingSection ref={pricingRef} />
          </div>
          <div id="blogs">
            <BlogSection ref={blogRef} />
          </div> */}
          <div id="join-us">
            <JoinUsSection ref={joinUsRef} />
          </div>
        </div>
      </div>
    </main>
  );
}
